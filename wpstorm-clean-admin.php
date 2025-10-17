<?php

/**
 * Plugin Name: WpstormCleanAdmin
 * Plugin URI: https://wpstorm.ir
 * Description: A modern WordPress plugin for managing inactive users, monitoring site activity, and keeping your WordPress site optimized and secure with smart automation tools.
 * Version: 1.0.0
 * Author: esradev
 * Author URI: https://wpstorm.ir
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: wpstorm-clean-admin
 * Domain Path: /languages/
 * Requires at least: 5.0
 * Tested up to: 6.8
 * Requires PHP: 7.4
 */

namespace WpstormCleanAdmin;

if (! defined('ABSPATH')) {
	exit;
}
if (! class_exists('WpstormCleanAdmin')) {
	class WpstormCleanAdmin
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
			if (get_option('wpstorm_clean_admin_activated')) {
				delete_option('wpstorm_clean_admin_activated');
				wp_safe_redirect(WPSTORM_CLEAN_ADMIN_LINK);
				exit;
			}
		}

		public function define_constants(): void
		{
			define('WPSTORM_CLEAN_ADMIN_VERSION', '1.0.0');
			define('WPSTORM_CLEAN_ADMIN_FILE', __FILE__);
			define('WPSTORM_CLEAN_ADMIN_DIR_PATH', plugin_dir_path(__FILE__));
			define('WPSTORM_CLEAN_ADMIN_SLUG', 'wpstorm_clean_admin_settings');
			define('WPSTORM_CLEAN_ADMIN_BASE', plugin_basename(__FILE__));
			define('WPSTORM_CLEAN_ADMIN_LINK', admin_url('admin.php?page=' . WPSTORM_CLEAN_ADMIN_SLUG));
			define('WPSTORM_CLEAN_ADMIN_WEB_MAIN', 'https://wpstorm.ir/');
			define('WPSTORM_CLEAN_ADMIN_WEB_MAIN_DOC', WPSTORM_CLEAN_ADMIN_WEB_MAIN . 'clean-admin/');
			define('WPSTORM_CLEAN_ADMIN_ASSETS_URL', plugin_dir_url(__FILE__) . 'assets/');
			define('WPSTORM_CLEAN_ADMIN_CRON_HOOK', 'wsca_check_inactive_users_cron');
			define('WPSTORM_CLEAN_ADMIN_META_LAST_LOGIN', 'wsca_last_login');
		}

		public function require_files(): void
		{
			require_once WPSTORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Activator.php';
			require_once WPSTORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/I18n.php';
			require_once WPSTORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Assets.php';
			require_once WPSTORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Routes.php';
			require_once WPSTORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Settings.php';
			require_once WPSTORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Database.php';
			require_once WPSTORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Deactivator.php';
			require_once WPSTORM_CLEAN_ADMIN_DIR_PATH . 'includes/Core/Options.php';

			require_once WPSTORM_CLEAN_ADMIN_DIR_PATH . 'includes/Modules/Tracker.php';
		}
	}

	WpstormCleanAdmin::get_instance();
}
