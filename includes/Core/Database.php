<?php

namespace WpstormCleanAdmin\Includes\Core;

if (! defined('ABSPATH')) {
	exit;
}

if (! class_exists('Database')) {

	class Database
	{
		private $collate;

		public $tracking_codes_table_name;

		private static object $instance;

		public static function get_instance()
		{
			if (! isset(self::$instance)) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Database constructor.
		 * 
		 * @deprecated 3.0.0 use get_table_name() instead to get table names.
		 */
		public function __construct()
		{
			global $wpdb;
			$this->collate                                         = $wpdb->get_charset_collate();
			$this->tracking_codes_table_name                       = $wpdb->prefix . 'payamito_tracking_codes';
		}

		public function create_tracking_codes_table()
		{
			$table_exists = $this->table_exists('tracking_codes');
			if ($table_exists) {
				return;
			}

			$tracking_codes = "CREATE TABLE `$this->tracking_codes_table_name` (
			`id` int(10) NOT NULL AUTO_INCREMENT,
			`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
			`user_id` mediumint(9) NOT NULL,
			`order_id` mediumint(9) NOT NULL,
			`tracking_code` varchar(255) NOT NULL,
			`post_service_provider` varchar(255) NOT NULL,
			`link` varchar(255) NOT NULL,   
			`post_date` date NOT NULL,
        	PRIMARY KEY  (id)
		) $this->collate";

			require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

			dbDelta($tracking_codes);
		}

		/**
		 * Get full table name with correct prefix and _plus suffix.
		 *
		 * @param string $base_name Table name after 'wpstorm_clean_admin_' (e.g., 'tracking_codes')
		 * @return string Full table name (e.g., wp_wpstorm_clean_admin_tracking_codes)
		 */
		public static function get_table_name(string $base_name): string
		{
			global $wpdb;
			return $wpdb->prefix . 'wpstorm_clean_admin_' . $base_name;
		}

		private function table_exists(string $table_name): bool
		{
			global $wpdb;
			$table_name = self::get_table_name($table_name);
			return $wpdb->get_var("SHOW TABLES LIKE '$table_name'") === $table_name;
		}
	}

	Database::get_instance();
}
