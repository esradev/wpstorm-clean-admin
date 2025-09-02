<?php

namespace WpstormCleanAdmin\Includes\Core;

use WP_Error;
use WP_User;
use WP_User_Query;

if (! defined('ABSPATH')) {
	exit;
}

if (! class_exists('Routes')) {

	class Routes
	{

		private static object $instance;

		public static function get_instance()
		{
			if (! isset(self::$instance)) {
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
						'methods'             => 'GET',
						'callback'            => [$this, 'get_options'],
						'permission_callback' => [$this, 'admin_permissions_check'],
					],
					[
						'methods'             => 'POST',
						'callback'            => [$this, 'update_options'],
						'permission_callback' => [$this, 'admin_permissions_check'],
					],
				]);
			}

			register_rest_route($namespace, 'inactive-users', [
				'methods'             => 'GET',
				'callback'            => [$this, 'get_inactive_users'],
				'permission_callback' => [$this, 'admin_permissions_check'],
				'args'                => [
					'search'   => [
						'type'        => 'string',
						'required'    => false,
						'description' => 'Search term for user login/email',
					],
					'page'     => [
						'type'        => 'integer',
						'required'    => false,
						'description' => 'Current page number',
					],
					'per_page' => [
						'type'        => 'integer',
						'required'    => false,
						'description' => 'Number of users per page',
					],
				],
			]);

			register_rest_route($namespace, 'bulk-action', [
				'methods'             => 'POST',
				'callback'            => [$this, 'bulk_action'],
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
			$group   = basename($req->get_route(), '_options');
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
			$meta_query = [
				'relation' => 'OR',
				[
					'key'     => WPSTORM_CLEAN_ADMIN_META_LAST_LOGIN,
					'value'   => $threshold_gmt,
					'compare' => '<',
					'type'    => 'DATETIME',
				],
				[
					'relation' => 'AND',
					[
						'key'     => WPSTORM_CLEAN_ADMIN_META_LAST_LOGIN,
						'compare' => 'NOT EXISTS',
					],
					// We'll filter by registered date after query since WP_User_Query can't compare user_registered in meta_query
				]
			];

			$args = [
				'number'  => $per_page * 3,
				'offset'  => 0,
				'search'      => $search_term ? '*' . $search_term . '*' : '',
				'search_columns' => ['user_login', 'user_email', 'user_nicename', 'display_name'],
				'orderby'     => 'ID',
				'order'       => 'ASC',
				'fields'      => 'all_with_meta',
				'meta_query'  => $meta_query,
			];

			$q = new WP_User_Query($args);
			$exclude_roles_option = Options::get_option_item('generals', 'exclude_roles');
			$exclude_roles = array_map(
				fn($role) => isset($role['value']) ? strtolower($role['value']) : '',
				is_array($exclude_roles_option) ? $exclude_roles_option : []
			);

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

					if (! $is_inactive) continue;

					$total++;

					$items[] = [
						'id'           => (int)$user->ID,
						'username'     => $user->user_login,
						'email'        => $user->user_email,
						'roles'        => $user->roles,
						'last_login'   => $last_login ?: null,
						'registered'   => gmdate('Y-m-d H:i:s', strtotime($user->user_registered)),
					];
				}
			}

			// Pagination slice
			$items = array_slice($items, $offset, $per_page);

			return [
				'total' => $total,
				'page'  => $paged,
				'per_page' => $per_page,
				'items' => $items,
			];
		}

		public function bulk_action($req)
		{
			$params = $req->get_json_params() ?: [];
			$ids    = array_map('intval', (array)($params['user_ids'] ?? []));
			$action = in_array($params['action'] ?? '', ['deactivate', 'delete'], true) ? $params['action'] : null;

			if (!$ids || !$action) {
				return new WP_Error('wsca_bad_request', 'Missing user_ids or invalid action.', ['status' => 400]);
			}

			$exclude_roles = array_map('strtolower', Options::get_option_item('generals', 'exclude_roles') ?: []);
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
			$wpdb->insert(Database::get_table_name('login_logs'), [
				'created_at' => current_time('mysql', true),
				'user_id'    => $user_id,
				'action'     => sanitize_key($action),
				'actor_id'   => $actor_id ?: null,
				'notes'      => $notes ? wp_kses_post($notes) : null,
			], ['%s', '%d', '%s', '%d', '%s']);
		}
	}

	Routes::get_instance();
}
