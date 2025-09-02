<?php

if (!defined('ABSPATH')) {
    exit;
}

use WP_REST_Request;
use WP_User_Query;

const VERSION   = '1.0.0';
const SLUG      = 'user-cleaner';
const OPT_KEY   = 'user_cleaner_settings';
const CRON_HOOK = 'user_cleaner_cron_cleanup';
const META_LAST_LOGIN = 'uc_last_login';
global $wpdb;
define(__NAMESPACE__ . '\\LOGS_TABLE', $wpdb->prefix . 'user_cleaner_logs');

/**
 * ===== Activation / Deactivation =====
 */
register_activation_hook(__FILE__, __NAMESPACE__ . '\\activate');
register_deactivation_hook(__FILE__, __NAMESPACE__ . '\\deactivate');

function activate()
{
    // Defaults
    if (!get_option(OPT_KEY)) {
        add_option(OPT_KEY, [
            'inactivity_days' => 30,
            'action'          => 'deactivate', // 'deactivate' | 'delete'
            'exclude_roles'   => ['administrator'],
            'schedule'        => 'daily', // 'daily' | 'twicedaily' | 'hourly'
        ], '', 'no');
    }

    // Schedule cron
    if (!wp_next_scheduled(CRON_HOOK)) {
        $settings = get_settings();
        $recurrence = sanitize_cron_recurrence($settings['schedule'] ?? 'daily');
        wp_schedule_event(time() + 60, $recurrence, CRON_HOOK);
    }
}

function deactivate()
{
    // Don’t drop logs table; keep history
    wp_clear_scheduled_hook(CRON_HOOK);
}

function create_logs_table()
{
    global $wpdb;
    $charset = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE " . LOGS_TABLE . " (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        created_at DATETIME NOT NULL,
        user_id BIGINT UNSIGNED NOT NULL,
        action VARCHAR(32) NOT NULL,
        actor_id BIGINT UNSIGNED NULL,
        notes TEXT NULL,
        PRIMARY KEY (id),
        KEY user_id (user_id),
        KEY created_at (created_at)
    ) $charset;";
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
}

/**
 * ===== Settings Helper =====
 */
function get_settings(): array
{
    $defaults = [
        'inactivity_days' => 30,
        'action'          => 'deactivate',
        'exclude_roles'   => ['administrator'],
        'schedule'        => 'daily',
    ];
    $opt = get_option(OPT_KEY, []);
    if (!is_array($opt)) $opt = [];
    return array_merge($defaults, $opt);
}

function sanitize_settings(array $in): array
{
    $days = isset($in['inactivity_days']) ? max(1, (int)$in['inactivity_days']) : 30;
    $action = in_array($in['action'] ?? 'deactivate', ['deactivate', 'delete'], true) ? $in['action'] : 'deactivate';
    $exclude_roles = array_values(array_unique(array_filter(array_map('sanitize_key', (array)($in['exclude_roles'] ?? [])))));
    $schedule = sanitize_cron_recurrence($in['schedule'] ?? 'daily');

    return [
        'inactivity_days' => $days,
        'action'          => $action,
        'exclude_roles'   => $exclude_roles,
        'schedule'        => $schedule,
    ];
}

function sanitize_cron_recurrence(string $r): string
{
    return in_array($r, ['hourly', 'twicedaily', 'daily'], true) ? $r : 'daily';
}

/**
 * ===== Track Last Login =====
 */
add_action('wp_login', __NAMESPACE__ . '\\track_last_login', 10, 2);
function track_last_login($user_login, $user)
{
    update_user_meta($user->ID, META_LAST_LOGIN, current_time('mysql', true)); // store GMT
}

/**
 * ===== REST API =====
 */
add_action('rest_api_init', function () {
    register_rest_route('user-cleaner/v1', '/settings', [
        [
            'methods'  => 'GET',
            'callback' => __NAMESPACE__ . '\\rest_get_settings',
            'permission_callback' => function () {
                return current_user_can('manage_options');
            }
        ],
        [
            'methods'  => 'POST',
            'callback' => __NAMESPACE__ . '\\rest_save_settings',
            'permission_callback' => function () {
                return current_user_can('manage_options');
            }
        ],
    ]);

    register_rest_route('user-cleaner/v1', '/inactive-users', [
        'methods'  => 'GET',
        'callback' => __NAMESPACE__ . '\\rest_inactive_users',
        'permission_callback' => function () {
            return current_user_can('list_users');
        }
    ]);

    register_rest_route('user-cleaner/v1', '/bulk-action', [
        'methods'  => 'POST',
        'callback' => __NAMESPACE__ . '\\rest_bulk_action',
        'permission_callback' => function () {
            return current_user_can('delete_users');
        }
    ]);
});

function rest_get_settings()
{
    return get_settings();
}

function rest_save_settings(WP_REST_Request $req)
{
    $body = $req->get_json_params() ?: $_POST;
    $new  = sanitize_settings(is_array($body) ? $body : []);
    $old  = get_settings();

    // Reschedule cron if cadence changed
    if (($old['schedule'] ?? 'daily') !== $new['schedule']) {
        wp_clear_scheduled_hook(CRON_HOOK);
        wp_schedule_event(time() + 60, $new['schedule'], CRON_HOOK);
    }

    update_option(OPT_KEY, $new, false);
    return ['success' => true, 'settings' => $new];
}

function rest_inactive_users(WP_REST_Request $req)
{
    $settings = get_settings();
    $search   = sanitize_text_field($req->get_param('search') ?? '');
    $paged    = max(1, (int)($req->get_param('page') ?? 1));
    $per_page = min(100, max(1, (int)($req->get_param('per_page') ?? 20)));
    $offset   = ($paged - 1) * $per_page;

    $threshold_gmt = gmdate('Y-m-d H:i:s', time() - (DAY_IN_SECONDS * (int)$settings['inactivity_days']));

    // Build user query:
    // Inactive if: (last_login < threshold) OR (no last_login AND registered < threshold)
    $meta_query = [
        'relation' => 'OR',
        [
            'key'     => META_LAST_LOGIN,
            'value'   => $threshold_gmt,
            'compare' => '<',
            'type'    => 'DATETIME',
        ],
        [
            'relation' => 'AND',
            [
                'key'     => META_LAST_LOGIN,
                'compare' => 'NOT EXISTS',
            ],
            // We'll filter by registered date after query since WP_User_Query can't compare user_registered in meta_query
        ]
    ];

    $args = [
        'number'      => $per_page * 3, // overfetch; we'll post-filter by role & registered
        'offset'      => 0,
        'search'      => $search ? '*' . $search . '*' : '',
        'search_columns' => ['user_login', 'user_email', 'user_nicename', 'display_name'],
        'orderby'     => 'ID',
        'order'       => 'ASC',
        'fields'      => 'all_with_meta',
        'meta_query'  => $meta_query,
    ];

    $q = new WP_User_Query($args);
    $exclude_roles = array_map('strtolower', $settings['exclude_roles'] ?? []);

    $items = [];
    $total = 0;
    if (!empty($q->results)) {
        foreach ($q->results as $u) {
            // Exclude roles
            $roles = array_map('strtolower', (array)($u->roles ?? []));
            if (array_intersect($roles, $exclude_roles)) {
                continue;
            }

            // Registered threshold check for users without last_login
            $last_login = get_user_meta($u->ID, META_LAST_LOGIN, true);
            $inactive_by_registered = false;
            if (empty($last_login)) {
                $inactive_by_registered = (strtotime(get_date_from_gmt($u->user_registered, 'Y-m-d H:i:s') . ' GMT') < strtotime($threshold_gmt));
            }

            $is_inactive = $inactive_by_registered || (!empty($last_login) && $last_login < $threshold_gmt);
            if (!$is_inactive) continue;

            $total++;
            $items[] = [
                'id'          => (int)$u->ID,
                'username'    => $u->user_login,
                'email'       => $u->user_email,
                'roles'       => $u->roles,
                'last_login'  => $last_login ?: null,
                'registered'  => gmdate('Y-m-d H:i:s', strtotime($u->user_registered)),
            ];
        }
    }

    // Pagination slice
    $items = array_slice($items, $offset, $per_page);

    return [
        'total'    => $total,
        'page'     => $paged,
        'per_page' => $per_page,
        'items'    => array_values($items),
    ];
}

function rest_bulk_action(WP_REST_Request $req)
{
    $params = $req->get_json_params() ?: [];
    $ids    = array_map('intval', (array)($params['user_ids'] ?? []));
    $action = in_array($params['action'] ?? '', ['deactivate', 'delete'], true) ? $params['action'] : null;

    if (!$ids || !$action) {
        return new \WP_Error('uc_bad_request', 'Missing user_ids or invalid action.', ['status' => 400]);
    }

    $settings = get_settings();
    $exclude_roles = array_map('strtolower', $settings['exclude_roles'] ?? []);
    $actor = get_current_user_id() ?: null;

    $results = ['processed' => [], 'skipped' => []];

    foreach ($ids as $uid) {
        $u = get_userdata($uid);
        if (!$u) {
            $results['skipped'][] = ['id' => $uid, 'reason' => 'not_found'];
            continue;
        }
        if (array_intersect(array_map('strtolower', $u->roles), $exclude_roles)) {
            $results['skipped'][] = ['id' => $uid, 'reason' => 'excluded_role'];
            continue;
        }

        if ($action === 'deactivate') {
            // Set sole role to 'inactive'
            $user_obj = new \WP_User($uid);
            $user_obj->set_role('inactive');
            log_action($uid, 'deactivate', $actor, 'Bulk REST');
            $results['processed'][] = ['id' => $uid, 'action' => 'deactivate'];
        } else {
            require_once ABSPATH . 'wp-admin/includes/user.php';
            $deleted = wp_delete_user($uid);
            if ($deleted) {
                log_action($uid, 'delete', $actor, 'Bulk REST');
                $results['processed'][] = ['id' => $uid, 'action' => 'delete'];
            } else {
                $results['skipped'][] = ['id' => $uid, 'reason' => 'delete_failed'];
            }
        }
    }

    return $results;
}

/**
 * ===== Cron Cleanup =====
 */
add_action(CRON_HOOK, __NAMESPACE__ . '\\cron_cleanup');
function cron_cleanup()
{
    $settings = get_settings();

    $list = rest_inactive_users(new class {
        // tiny fake request object to reuse logic
        public function get_param($k)
        {
            return null;
        }
    });

    if (!is_array($list) || empty($list['items'])) return;

    $actor = null; // cron
    foreach ($list['items'] as $row) {
        $uid = (int)$row['id'];
        $u = get_userdata($uid);
        if (!$u) continue;
        if (array_intersect(array_map('strtolower', $u->roles), array_map('strtolower', $settings['exclude_roles']))) {
            continue;
        }

        if ($settings['action'] === 'deactivate') {
            $user_obj = new \WP_User($uid);
            $user_obj->set_role('inactive');
            log_action($uid, 'cron_deactivate', $actor, 'Scheduled cleanup');
        } else {
            require_once ABSPATH . 'wp-admin/includes/user.php';
            if (wp_delete_user($uid)) {
                log_action($uid, 'cron_delete', $actor, 'Scheduled cleanup');
            }
        }
    }
}

/**
 * ===== Logging =====
 */
function log_action(int $user_id, string $action, ?int $actor_id = null, string $notes = '')
{
    global $wpdb;
    $wpdb->insert(LOGS_TABLE, [
        'created_at' => current_time('mysql', true),
        'user_id'    => $user_id,
        'action'     => sanitize_key($action),
        'actor_id'   => $actor_id ?: null,
        'notes'      => $notes ? wp_kses_post($notes) : null,
    ], ['%s', '%d', '%s', '%d', '%s']);
}

/**
 * ===== Admin (optional tiny link under Tools) =====
 * Frontend UI is React/ShadCN via your build; this just gives you a landing page hook if needed.
 */
add_action('admin_menu', function () {
    add_management_page(
        'User Cleaner',
        'User Cleaner',
        'manage_options',
        SLUG,
        function () {
            echo '<div class="wrap"><h1>User Cleaner</h1><p>Use the React admin app or REST API endpoints:</p><ul><li><code>/wp-json/user-cleaner/v1/settings</code></li><li><code>/wp-json/user-cleaner/v1/inactive-users</code></li><li><code>/wp-json/user-cleaner/v1/bulk-action</code></li></ul></div>';
        }
    );
});
