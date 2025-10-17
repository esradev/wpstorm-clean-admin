<?php

namespace WpstormCleanAdmin\Includes\Core;

use WP_Error;
use WP_User;
use WP_User_Query;

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('Routes')) {

    class Routes
    {

        private static object $instance;

        public static function get_instance()
        {
            if (!isset(self::$instance)) {
                self::$instance = new self();
            }

            return self::$instance;
        }

        public function __construct()
        {
            add_action('rest_api_init', [$this, 'register_routes']);
        }

        public function register_routes()
        {
            $namespace = 'wpstorm-clean-admin/v1';

            foreach (Options::$option_groups as $group => $options) {
                $route_name = $group . '_options';
                register_rest_route($namespace, $route_name, [
                    [
                        'methods' => 'GET',
                        'callback' => [$this, 'get_options'],
                        'permission_callback' => [$this, 'admin_permissions_check'],
                    ],
                    [
                        'methods' => 'POST',
                        'callback' => [$this, 'update_options'],
                        'permission_callback' => [$this, 'admin_permissions_check'],
                    ],
                ]);
            }

            register_rest_route($namespace, 'users', [
                'methods' => 'GET',
                'callback' => [$this, 'get_users'],
                'permission_callback' => [$this, 'admin_permissions_check'],
                'args' => [
                    'search' => [
                        'type' => 'string',
                        'required' => false,
                        'description' => 'Search term for user login/email',
                    ],
                    'page' => [
                        'type' => 'integer',
                        'required' => false,
                        'description' => 'Current page number',
                    ],
                    'per_page' => [
                        'type' => 'integer',
                        'required' => false,
                        'description' => 'Number of users per page',
                    ],
                ],
            ]);

            register_rest_route($namespace, 'inactive-users', [
                'methods' => 'GET',
                'callback' => [$this, 'get_inactive_users'],
                'permission_callback' => [$this, 'admin_permissions_check'],
                'args' => [
                    'search' => [
                        'type' => 'string',
                        'required' => false,
                        'description' => 'Search term for user login/email',
                    ],
                    'page' => [
                        'type' => 'integer',
                        'required' => false,
                        'description' => 'Current page number',
                    ],
                    'per_page' => [
                        'type' => 'integer',
                        'required' => false,
                        'description' => 'Number of users per page',
                    ],
                ],
            ]);

            register_rest_route($namespace, 'bulk-action', [
                'methods' => 'POST',
                'callback' => [$this, 'bulk_action'],
                'permission_callback' => [$this, 'admin_permissions_check'],
            ]);

            register_rest_route($namespace, 'dashboard-stats', [
                'methods' => 'GET',
                'callback' => [$this, 'get_dashboard_stats'],
                'permission_callback' => [$this, 'admin_permissions_check'],
            ]);

            register_rest_route($namespace, 'activity-chart', [
                'methods' => 'GET',
                'callback' => [$this, 'get_activity_chart'],
                'permission_callback' => [$this, 'admin_permissions_check'],
                'args' => [
                    'days' => [
                        'type' => 'integer',
                        'required' => false,
                        'default' => 90,
                        'description' => 'Number of days to fetch (7, 30, or 90)',
                    ],
                ],
            ]);

            register_rest_route($namespace, 'roles', [
                'methods' => 'GET',
                'callback' => [$this, 'get_roles'],
                'permission_callback' => [$this, 'admin_permissions_check'],
            ]);
        }

        public function get_options($req)
        {
            $group = basename($req->get_route(), '_options');

            return Options::get_options($group);
        }

        public function update_options($req)
        {
            $group = basename($req->get_route(), '_options');
            $options = $req->get_json_params();

            return Options::update_options($group, $options);
        }

        public function admin_permissions_check()
        {
            return current_user_can('manage_options');
        }

        public function get_inactive_users($req)
        {
            $search_term = $req->get_param('search') ?: '';
            $paged = max(1, (int)($req->get_param('page') ?? 1));
            $per_page = min(100, max(1, (int)($req->get_param('per_page') ?? 20)));
            $offset = ($paged - 1) * $per_page;

            $threshold_gmt = gmdate('Y-m-d H:i:s', time() - (DAY_IN_SECONDS * (int)Options::get_option_item('generals', 'inactivity_days')));

            // Build user query:
            // Inactive if: (last_login < $threshold) or (no last_login AND registered < $threshold)
            // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- Meta query is necessary to find inactive users based on last_login meta field. Performance is acceptable for admin-only functionality with pagination.
            $meta_query = [
                'relation' => 'OR',
                [
                    'key' => WPSTORM_CLEAN_ADMIN_META_LAST_LOGIN,
                    'value' => $threshold_gmt,
                    'compare' => '<',
                    'type' => 'DATETIME',
                ],
                [
                    'relation' => 'AND',
                    [
                        'key' => WPSTORM_CLEAN_ADMIN_META_LAST_LOGIN,
                        'compare' => 'NOT EXISTS',
                    ],
                    // We'll filter by registered date after query since WP_User_Query can't compare user_registered in meta_query
                ]
            ];

            $args = [
                'number' => $per_page * 3, // Fetch more than needed to account for role filtering
                'offset' => 0,
                'search' => $search_term ? '*' . $search_term . '*' : '',
                'search_columns' => ['user_login', 'user_email', 'user_nicename', 'display_name'],
                'orderby' => 'ID',
                'order' => 'ASC',
                'fields' => 'all_with_meta',
                'meta_query' => $meta_query,
            ];

            $q = new WP_User_Query($args);
            $exclude_roles_option = Options::get_option_item('generals', 'exclude_roles');
            $exclude_roles = array_map(
                fn($role) => isset($role['value']) ? strtolower($role['value']) : '',
                is_array($exclude_roles_option) ? $exclude_roles_option : []
            );

            // Always exclude administrator role
            if (!in_array('administrator', $exclude_roles)) {
                $exclude_roles[] = 'administrator';
            }

            $items = [];
            $total = 0;

            if (!empty($q->get_results())) {
                foreach ($q->get_results() as $user) {
                    // Exclude roles
                    $user_roles = array_map('strtolower', (array)$user->roles);
                    if (array_intersect($user_roles, $exclude_roles)) {
                        continue;
                    }
                    // Registered threshold check for users without last_login
                    $last_login = get_user_meta($user->ID, WPSTORM_CLEAN_ADMIN_META_LAST_LOGIN, true);
                    $inactive_by_registered = false;

                    if (empty($last_login)) {
                        $inactive_by_registered = (strtotime(get_date_from_gmt($user->user_registered, 'Y-m-d H:i:s') . ' GMT') < strtotime($threshold_gmt));
                    }

                    $is_inactive = $inactive_by_registered || (!empty($last_login) && $last_login < $threshold_gmt);

                    if (!$is_inactive) continue;

                    $total++;

                    $items[] = [
                        'id' => (int)$user->ID,
                        'username' => $user->user_login,
                        'email' => $user->user_email,
                        'roles' => $user->roles,
                        'last_login' => $last_login ?: null,
                        'registered' => gmdate('Y-m-d H:i:s', strtotime($user->user_registered)),
                    ];
                }
            }

            // Pagination slice
            $items = array_slice($items, $offset, $per_page);

            return [
                'total' => $total,
                'page' => $paged,
                'per_page' => $per_page,
                'items' => $items,
            ];
        }

        public function bulk_action($req)
        {
            $params = $req->get_json_params() ?: [];
            $ids = array_map('intval', (array)($params['user_ids'] ?? []));
            $action = in_array($params['action'] ?? '', ['deactivate', 'delete'], true) ? $params['action'] : null;

            if (!$ids || !$action) {
                return new WP_Error('wsca_bad_request', 'Missing user_ids or invalid action.', ['status' => 400]);
            }

            $exclude_roles_option = Options::get_option_item('generals', 'exclude_roles');
            $exclude_roles = array_map(
                fn($role) => isset($role['value']) ? strtolower($role['value']) : strtolower($role),
                is_array($exclude_roles_option) ? $exclude_roles_option : []
            );

            // Always exclude administrator role
            if (!in_array('administrator', $exclude_roles)) {
                $exclude_roles[] = 'administrator';
            }

            $actor = get_current_user_id() ?: null;

            $results = ['processed' => [], 'skipped' => []];

            foreach ($ids as $user_id) {
                $user = get_userdata($user_id);

                if (!$user) {
                    $results['skipped'][] = ['id' => $user_id, 'reason' => 'not_found'];
                    continue;
                }

                if (array_intersect(array_map('strtolower', $user->roles), $exclude_roles)) {
                    $results['skipped'][] = ['id' => $user_id, 'reason' => 'excluded_role'];
                    continue;
                }

                if ($action === 'deactivate') {
                    // Set sole role to 'inactive'
                    $user_obj = new WP_User($user_id);
                    $user_obj->set_role('inactive');
                    $this->log_action($user_id, 'deactivate', $actor, 'Bulk REST');
                    $results['processed'][] = ['id' => $user_id, 'action' => 'deactivate'];
                } else {
                    require_once ABSPATH . 'wp-admin/includes/user.php';
                    $deleted = wp_delete_user($user_id);
                    if ($deleted) {
                        $this->log_action($user_id, 'delete', $actor, 'Bulk REST');
                        $results['processed'][] = ['id' => $user_id, 'action' => 'delete'];
                    } else {
                        $results['skipped'][] = ['id' => $user_id, 'reason' => 'delete_failed'];
                    }
                }
            }

            return $results;
        }

        /**
         * ===== Logging =====
         */
        public function log_action(int $user_id, string $action, ?int $actor_id = null, string $notes = '')
        {
            global $wpdb;
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery -- Custom table insert for logging purposes
            $wpdb->insert(Database::get_table_name('login_logs'), [
                'created_at' => current_time('mysql', true),
                'user_id' => $user_id,
                'action' => sanitize_key($action),
                'actor_id' => $actor_id ?: null,
                'notes' => $notes ? wp_kses_post($notes) : null,
            ], ['%s', '%d', '%s', '%d', '%s']);
        }

        public function get_users($req)
        {
            $search_term = $req->get_param('search') ?: '';
            $paged = max(1, (int)($req->get_param('page') ?? 1));
            $per_page = min(100, max(1, (int)($req->get_param('per_page') ?? 20)));
            $offset = ($paged - 1) * $per_page;

            $args = [
                'number' => $per_page,
                'offset' => $offset,
                'search' => $search_term ? '*' . $search_term . '*' : '',
                'search_columns' => ['user_login', 'user_email', 'user_nicename', 'display_name'],
                'orderby' => 'ID',
                'order' => 'ASC',
                'fields' => 'all_with_meta',
            ];

            $q = new WP_User_Query($args);
            $exclude_roles_option = Options::get_option_item('generals', 'exclude_roles');
            $exclude_roles = array_map(
                fn($role) => isset($role['value']) ? strtolower($role['value']) : '',
                is_array($exclude_roles_option) ? $exclude_roles_option : []
            );

            // Always exclude administrator role
            if (!in_array('administrator', $exclude_roles)) {
                $exclude_roles[] = 'administrator';
            }

            $items = [];
            $total = (int)$q->get_total();

            if (!empty($q->get_results())) {
                foreach ($q->get_results() as $user) {
                    // Exclude roles
                    $user_roles = array_map('strtolower', (array)$user->roles);
                    if (array_intersect($user_roles, $exclude_roles)) {
                        continue;
                    }

                    $last_login = get_user_meta($user->ID, WPSTORM_CLEAN_ADMIN_META_LAST_LOGIN, true);

                    $items[] = [
                        'id' => (int)$user->ID,
                        'username' => $user->user_login,
                        'email' => $user->user_email,
                        'roles' => $user->roles,
                        'last_login' => $last_login ?: null,
                        'registered' => gmdate('Y-m-d H:i:s', strtotime($user->user_registered)),
                    ];
                }
            }

            return [
                'total' => $total,
                'page' => $paged,
                'per_page' => $per_page,
                'items' => $items,
            ];
        }

        public function get_dashboard_stats($req)
        {
            global $wpdb;

            // Check cache first
            $cache_key = 'wpstorm_clean_admin_dashboard_stats';
            $cached_stats = wp_cache_get($cache_key);

            if ($cached_stats !== false) {
                return $cached_stats;
            }

            // Total users count
            $total_users = count_users();
            $total_users_count = $total_users['total_users'];

            // New users this month
            $first_day_of_month = gmdate('Y-m-01 00:00:00');
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom query with caching implemented
            $new_users_this_month = (int) $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT COUNT(*) FROM {$wpdb->users} WHERE user_registered >= %s",
                    $first_day_of_month
                )
            );

            // New users last month
            $first_day_last_month = gmdate('Y-m-01 00:00:00', strtotime('-1 month'));
            $last_day_last_month = gmdate('Y-m-t 23:59:59', strtotime('-1 month'));
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom query with caching implemented
            $new_users_last_month = (int) $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT COUNT(*) FROM {$wpdb->users} WHERE user_registered >= %s AND user_registered <= %s",
                    $first_day_last_month,
                    $last_day_last_month
                )
            );

            // Calculate new users percentage change
            $new_users_change = 0;
            if ($new_users_last_month > 0) {
                $new_users_change = (($new_users_this_month - $new_users_last_month) / $new_users_last_month) * 100;
            } elseif ($new_users_this_month > 0) {
                $new_users_change = 100;
            }

            // Active users (logged in within last 30 days)
            $thirty_days_ago = gmdate('Y-m-d H:i:s', time() - (30 * DAY_IN_SECONDS));
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom query with caching implemented
            $active_users = (int) $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT COUNT(DISTINCT user_id) FROM {$wpdb->usermeta}
                    WHERE meta_key = %s AND meta_value >= %s",
                    WPSTORM_CLEAN_ADMIN_META_LAST_LOGIN,
                    $thirty_days_ago
                )
            );

            // Active users last period (30-60 days ago)
            $sixty_days_ago = gmdate('Y-m-d H:i:s', time() - (60 * DAY_IN_SECONDS));
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom query with caching implemented
            $active_users_last_period = (int) $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT COUNT(DISTINCT user_id) FROM {$wpdb->usermeta}
                    WHERE meta_key = %s AND meta_value >= %s AND meta_value < %s",
                    WPSTORM_CLEAN_ADMIN_META_LAST_LOGIN,
                    $sixty_days_ago,
                    $thirty_days_ago
                )
            );

            // Calculate active users percentage change
            $active_users_change = 0;
            if ($active_users_last_period > 0) {
                $active_users_change = (($active_users - $active_users_last_period) / $active_users_last_period) * 100;
            } elseif ($active_users > 0) {
                $active_users_change = 100;
            }

            // User activity rate (active users / total users)
            $activity_rate = $total_users_count > 0 ? ($active_users / $total_users_count) * 100 : 0;

            // Get previous month activity rate
            $sixty_days_start = gmdate('Y-m-d H:i:s', time() - (60 * DAY_IN_SECONDS));
            $thirty_days_start = gmdate('Y-m-d H:i:s', time() - (30 * DAY_IN_SECONDS));

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom query with caching implemented
            $users_at_sixty_days = (int) $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT COUNT(*) FROM {$wpdb->users} WHERE user_registered < %s",
                    $sixty_days_start
                )
            );

            $previous_activity_rate = $users_at_sixty_days > 0 ? ($active_users_last_period / $users_at_sixty_days) * 100 : 0;

            $activity_rate_change = 0;
            if ($previous_activity_rate > 0) {
                $activity_rate_change = (($activity_rate - $previous_activity_rate) / $previous_activity_rate) * 100;
            } elseif ($activity_rate > 0) {
                $activity_rate_change = 100;
            }

            $stats = [
                'total_users' => [
                    'value' => $total_users_count,
                    'change' => 0, // Total users doesn't have a meaningful percentage
                    'trend' => 'neutral',
                ],
                'new_users' => [
                    'value' => $new_users_this_month,
                    'change' => round($new_users_change, 1),
                    'trend' => $new_users_change > 0 ? 'up' : ($new_users_change < 0 ? 'down' : 'neutral'),
                ],
                'active_users' => [
                    'value' => $active_users,
                    'change' => round($active_users_change, 1),
                    'trend' => $active_users_change > 0 ? 'up' : ($active_users_change < 0 ? 'down' : 'neutral'),
                ],
                'activity_rate' => [
                    'value' => round($activity_rate, 1),
                    'change' => round($activity_rate_change, 1),
                    'trend' => $activity_rate_change > 0 ? 'up' : ($activity_rate_change < 0 ? 'down' : 'neutral'),
                ],
            ];

            // Cache the results for 5 minutes
            wp_cache_set($cache_key, $stats, '', 300);

            return $stats;
        }

        public function get_activity_chart($req)
        {
            global $wpdb;

            $days = min(90, max(7, (int)($req->get_param('days') ?? 90)));

            // Check cache first
            $cache_key = 'wpstorm_clean_admin_activity_chart_' . $days;
            $cached_chart = wp_cache_get($cache_key);

            if ($cached_chart !== false) {
                return $cached_chart;
            }

            $login_logs_table = Database::get_table_name('login_logs');

            // Get login activity for the specified period
            $start_date = gmdate('Y-m-d', time() - ($days * DAY_IN_SECONDS));
            $end_date = gmdate('Y-m-d');

            // Build the query with table name properly escaped
            $login_query = sprintf(
                "SELECT DATE(created_at) as date, COUNT(DISTINCT user_id) as logins
                FROM %s
                WHERE action = %%s AND DATE(created_at) >= %%s
                GROUP BY DATE(created_at)
                ORDER BY date ASC",
                esc_sql($login_logs_table)
            );

            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom query with caching implemented
            $login_results = $wpdb->get_results(
                $wpdb->prepare(
                    $login_query,
                    'login',
                    $start_date
                ),
                ARRAY_A
            );

            // Get new registrations for the specified period
            // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery,WordPress.DB.DirectDatabaseQuery.NoCaching -- Custom query with caching implemented
            $registration_results = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT DATE(user_registered) as date, COUNT(*) as registrations
                    FROM {$wpdb->users}
                    WHERE DATE(user_registered) >= %s
                    GROUP BY DATE(user_registered)
                    ORDER BY date ASC",
                    $start_date
                ),
                ARRAY_A
            );

            // Create a map for quick lookup
            $login_map = [];
            foreach ($login_results as $row) {
                $login_map[$row['date']] = (int)$row['logins'];
            }

            $registration_map = [];
            foreach ($registration_results as $row) {
                $registration_map[$row['date']] = (int)$row['registrations'];
            }

            // Generate data for all days in the range
            $chart_data = [];
            $current_date = strtotime($start_date);
            $end_timestamp = strtotime($end_date);

            while ($current_date <= $end_timestamp) {
                $date_str = gmdate('Y-m-d', $current_date);
                $chart_data[] = [
                    'date' => $date_str,
                    'logins' => $login_map[$date_str] ?? 0,
                    'registrations' => $registration_map[$date_str] ?? 0,
                ];
                $current_date += DAY_IN_SECONDS;
            }

            // Cache the results for 10 minutes
            wp_cache_set($cache_key, $chart_data, '', 600);

            return $chart_data;
        }

        public function get_roles($req)
        {
            global $wp_roles;

            if (!isset($wp_roles)) {
                $wp_roles = new \WP_Roles();
            }

            $roles = [];
            foreach ($wp_roles->roles as $role_key => $role_data) {
                $roles[] = [
                    'value' => $role_key,
                    'label' => translate_user_role($role_data['name']),
                ];
            }

            return $roles;
        }
    }

    Routes::get_instance();
}
