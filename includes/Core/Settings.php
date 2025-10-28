<?php

namespace StormCleanAdmin\Includes\Core;

if (! defined('ABSPATH')) {
	exit;
}
if (! class_exists('Settings')) {

	class Settings
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

			add_filter('plugin_action_links_' . STORM_CLEAN_ADMIN_BASE, [$this, 'settings_link']);
			add_filter('admin_menu', [$this, 'init_menu'], 999);
			add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
			// Apply page-specific behaviors using current_screen (avoids direct $_GET access).
			add_action('current_screen', [$this, 'maybe_setup_page']);
		}

		/**
		 * Conditionally hooks page-specific behaviors when the current admin screen matches
		 * our plugin page. This avoids relying on $_GET and satisfies nonce verification warnings.
		 */
		public function maybe_setup_page($screen)
		{
			if (! function_exists('get_current_screen')) {
				return;
			}

			$screen_obj = is_object($screen) ? $screen : get_current_screen();
			if (! $screen_obj) {
				return;
			}

			$target_ids = [
				'toplevel_page_' . STORM_CLEAN_ADMIN_SLUG,
				// Some setups may generate this format for submenu screens.
				STORM_CLEAN_ADMIN_SLUG . '_page_' . STORM_CLEAN_ADMIN_SLUG,
			];

			if (in_array($screen_obj->id, $target_ids, true)) {
				add_action('admin_init', [$this, 'hide_all_admin_notices']);
				// Add storm-clean-admin-tw as a class to the body tag.
				add_filter('admin_body_class', function ($classes) {
					return "$classes storm-clean-admin-tw";
				});
			}
		}
		/**
		 * Plugin settings link on all plugins page.
		 *
		 * @since 1.0.0
		 */
		public function settings_link($links)
		{
			$settings_link = '<a href="' . esc_url(STORM_CLEAN_ADMIN_LINK) . '" id="storm-clean-admin-settings-link" class="storm-clean-admin-plugin-link">' . esc_html__('Settings', 'storm-clean-admin') . '</a>';

			$doc_link = '<a href="' . esc_url(STORM_CLEAN_ADMIN_WEB_MAIN_DOC) . '" target="_blank" rel="noopener noreferrer" id="storm-clean-admin-docs-link" class="storm-clean-admin-plugin-link">' . esc_html__('Docs', 'storm-clean-admin') . '</a>';

			array_push($links, $settings_link, $doc_link);

			return $links;
		}

		/**
		 * Initializes the menu for the Storm Clean Admin settings.
		 */
		public function init_menu()
		{
			$new_badge = '<span class="storm-clean-admin-new-section">' . __('new', 'storm-clean-admin') . '</span>';
			add_menu_page(
				__('Storm Clean Admin', 'storm-clean-admin'),
				__('Storm Clean Admin', 'storm-clean-admin'),
				'manage_options',
				STORM_CLEAN_ADMIN_SLUG,
				[$this, 'admin_page'],
				'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clip-rule="evenodd" /></svg>'),
				7
			);
			add_submenu_page(
				STORM_CLEAN_ADMIN_SLUG,
				__('Storm Clean Admin', 'storm-clean-admin'),
				__('Auth', 'storm-clean-admin'),
				'manage_options',
				STORM_CLEAN_ADMIN_SLUG,
				[$this, 'admin_page']
			);
		}

		/**
		 * Init Admin Page.
		 *
		 * @return void
		 */
		public function admin_page()
		{ ?>
			<div class="wrap storm-clean-admin-tw">
				<div id="storm-clean-admin-dashboard" class="storm-clean-admin-tw"></div>
			</div>
<?php
		}

		public function enqueue_admin_assets($hook)
		{
			// Enqueue Custom Fonts
			wp_enqueue_style(
				'storm-clean-admin-fonts',
				STORM_CLEAN_ADMIN_ASSETS_URL . 'fonts/fonts.css',
				[],
				STORM_CLEAN_ADMIN_VERSION
			);

			// Enqueue admin styles
			wp_enqueue_style(
				'storm-clean-admin-style',
				STORM_CLEAN_ADMIN_ASSETS_URL . 'css/admin.css',
				['storm-clean-admin-fonts'],
				STORM_CLEAN_ADMIN_VERSION
			);

			// Optional: RTL support
			if (is_rtl()) {
				wp_style_add_data('storm-clean-admin-style', 'rtl', 'replace');
			}
		}



		function hide_all_admin_notices()
		{
			global $wp_filter;

			// Check if the WP_Admin_Bar exists, as it's not available on all admin pages.
			if (isset($wp_filter['admin_notices'])) {
				// Remove all actions hooked to the 'admin_notices' hook.
				unset($wp_filter['admin_notices']);
			}
		}
	}

	Settings::get_instance();
}
