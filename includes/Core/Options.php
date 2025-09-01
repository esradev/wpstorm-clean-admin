<?php

namespace WpstormCleanAdmin\Includes\Core;

if (! defined('ABSPATH')) {
	exit;
}

if (! class_exists('Options')) {

	class Options
	{
		public static $username;
		public static $password;
		public static $admin_numbers;
		public static $from;

		public static $option_groups;

		private static $instance;

		public static function get_instance()
		{
			if (! isset(self::$instance)) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		public function __construct()
		{

			self::$option_groups = self::get_default_options();
			$this->load_options();
			add_action('init', [$this, 'register_options']);

			self::$username      = self::get_option_item('auth', 'username');
			self::$password      = self::get_option_item('auth', 'password');
			self::$from          = self::get_option_item('auth', 'from', 'value');
			self::$admin_numbers = self::get_option_item('auth', 'admin_numbers');
		}

		public static function get_default_options()
		{
			return [
				'auth'             => [],
			];
		}

		/**
		 * Load the options from the database.
		 */
		private function load_options()
		{
			foreach (self::$option_groups as $group => $options) {
				$option_name   = 'wpstorm_clean_admin_' . $group . '_options';
				$group_options = get_option($option_name);
				if ($group_options) {
					if (! is_array($group_options)) {
						$group_options = json_decode(get_option($option_name), true);
					}
					self::$option_groups[$group] = $group_options;
				}
			}
		}

		/**
		 * Register the options in the database if they don't exist.
		 */
		public function register_options()
		{
			foreach (self::$option_groups as $group => $options) {
				$option_name = 'wpstorm_clean_admin_' . $group . '_options';
				if (! get_option($option_name)) {
					add_option($option_name, wp_json_encode($options));
				}
			}
		}

		/**
		 * Update the options in the database.
		 *
		 * @param string $group The option group.
		 * @param array $options The new options.
		 *
		 * @return bool True if the options were updated, false otherwise.
		 */
		public static function update_options($group, $options)
		{
			if (isset(self::$option_groups[$group])) {
				$option_name = 'wpstorm_clean_admin_' . $group . '_options';

				if ($options) {
					if (is_array($options)) {
						$option_json = $options;
					} else {
						$option_json = wp_json_encode($options);
					}
				}

				return update_option($option_name, $option_json);
			}

			return false;
		}

		/**
		 * Get the options from the database.
		 *
		 * @param string $group The option group.
		 *
		 * @return array|bool The options if found, false otherwise.
		 */
		public static function get_options($group)
		{
			$option_name = 'wpstorm_clean_admin_' . $group . '_options';
			add_option($option_name, wp_json_encode(self::$option_groups[$group]));

			$group_options = get_option($option_name);

			if ($group_options) {
				if (is_array($group_options)) {
					return $group_options;
				} else {
					return json_decode($group_options, true);
				}
			}
		}

		public static function get_option_item($group, $item, $sub_item = null)
		{
			$options = self::get_options($group);
			if (! isset($options[$item])) {
				return null;
			}

			if ($sub_item) {
				return $options[$item][$sub_item] ?? null;
			}

			return $options[$item];
		}
	}

	Options::get_instance();
}
