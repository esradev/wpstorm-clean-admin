<?php

/**
 * Plugin Name: Storm Clean Admin
 * Description: A modern WordPress plugin for managing inactive users, monitoring site activity, and keeping your WordPress site optimized and secure with smart automation tools, not affiliated with WordPress.org.
 * Version: 1.1.0
 * Author: wpstormdev
 * Author URI: https://wpstorm.ir
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: storm-clean-admin
 * Domain Path: /languages/
 * Requires at least: 5.0
 * Tested up to: 6.8
 * Requires PHP: 7.4
 */

namespace StormCleanAdmin;

if (! defined('ABSPATH')) {
	exit;
}
if (! class_exists('StormCleanAdmin')) {
	class StormCleanAdmin
	{
		private static object $instance;

		public static function get_instance(): object
		{
			if (! isset(self::$instance)) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		public function __construct()
		{

			$this->define_constants();
			$this->require_files();

			add_action('admin_init', [$this, 'redirect_to_settings_page']);
		}

		public function redirect_to_settings_page(): void
		{
			if (get_option('storm_clean_admin_activated')) {
				delete_option('storm_clean_admin_activated');
				wp_safe_redirect(STORM_CLEAN_ADMIN_LINK);
				exit;
			}
		}

		public function define_constants(): void
		{
			define('STORM_CLEAN_ADMIN_VERSION', '1.1.0');
			define('STORM_CLEAN_ADMIN_FILE', __FILE__);
			define('STORM_CLEAN_ADMIN_DIR_PATH', plugin_dir_path(__FILE__));
			define('STORM_CLEAN_ADMIN_SLUG', 'storm_clean_admin_settings');
			define('STORM_CLEAN_ADMIN_BASE', plugin_basename(__FILE__));
			define('STORM_CLEAN_ADMIN_LINK', admin_url('admin.php?page=' . STORM_CLEAN_ADMIN_SLUG));
			define('STORM_CLEAN_ADMIN_WEB_MAIN', 'https://wpstorm.ir/');
			define('STORM_CLEAN_ADMIN_WEB_MAIN_DOC', STORM_CLEAN_ADMIN_WEB_MAIN . 'clean-admin/');
			define('STORM_CLEAN_ADMIN_ASSETS_URL', plugin_dir_url(__FILE__) . 'assets/');
			define('STORM_CLEAN_ADMIN_CRON_HOOK', 'wsca_check_inactive_users_cron');
			define('STORM_CLEAN_ADMIN_META_LAST_LOGIN', 'wsca_last_login');
		}

		public function require_files(): void
		{
			require_once STORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Activator.php';
			require_once STORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/I18n.php';
			require_once STORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Assets.php';
			require_once STORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Routes.php';
			require_once STORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Settings.php';
			require_once STORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Database.php';
			require_once STORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Deactivator.php';
			require_once STORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Options.php';

			require_once STORM_CLEAN_ADMIN_DIR_PATH . 'includes/Modules/Tracker.php';
		}
	}

	StormCleanAdmin::get_instance();
}
