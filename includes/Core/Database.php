<?php

namespace WpstormCleanAdmin\Includes\Core;

if (! defined('ABSPATH')) {
	exit;
}

if (! class_exists('Database')) {

	class Database
	{
		private $charset;

		public $login_logs;

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
			$this->charset                          = $wpdb->get_charset_collate();
			$this->login_logs                       = self::get_table_name('login_logs');
		}

		public function create_login_logs_table()
		{
			$table_exists = $this->table_exists('login_logs');
			if ($table_exists) {
				return;
			}

			$login_logs = "CREATE TABLE " . $this->login_logs . " (
				id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
				created_at DATETIME NOT NULL,
				user_id BIGINT UNSIGNED NOT NULL,
				action VARCHAR(32) NOT NULL,
				actor_id BIGINT UNSIGNED NULL,
				notes TEXT NULL,
				PRIMARY KEY (id),
				KEY user_id (user_id),
				KEY created_at (created_at)
			) $this->charset;";

			require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

			dbDelta($login_logs);
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
			$result = $wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table_name));
			return $result === $table_name;
		}
	}

	Database::get_instance();
	Database::get_instance();
}
