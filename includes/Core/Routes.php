<?php

namespace WpstormCleanAdmin\Includes\Core;

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
	}

	Routes::get_instance();
}
