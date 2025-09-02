<?php

namespace WpstormCleanAdmin\Includes\Core;

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

			add_filter('plugin_action_links_' . WPSTORM_CLEAN_ADMIN_BASE, [$this, 'settings_link']);
			add_filter('admin_menu', [$this, 'init_menu'], 999);
			add_action('admin_head', [$this, 'admin_head'], 999);
			if (isset($_GET['page']) && $_GET['page'] == WPSTORM_CLEAN_ADMIN_SLUG) {
				add_action('admin_init', [$this, 'hide_all_admin_notices']);
				// Add wpstorm-clean-admin-tw as a class to the body tag.
				add_filter('admin_body_class', function ($classes) {
					return "$classes wpstorm-clean-admin-tw";
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
			$settings_link = '<a href="' . esc_url(WPSTORM_CLEAN_ADMIN_LINK) . '" id="wpstorm-clean-admin-settings-link" class="wpstorm-clean-admin-plugin-link">' . esc_html__('Settings', 'wpstorm-clean-admin') . '</a>';

			$doc_link = '<a href="' . esc_url(WPSTORM_CLEAN_ADMIN_WEB_MAIN_DOC) . '" target="_blank" rel="noopener noreferrer" id="wpstorm-clean-admin-docs-link" class="wpstorm-clean-admin-plugin-link">' . esc_html__('Docs', 'wpstorm-clean-admin') . '</a>';

			array_push($links, $settings_link, $doc_link);

			return $links;
		}

		/**
		 * Initializes the menu for the Wpstorm Clean Admin settings.
		 */
		public function init_menu()
		{
			$new_badge = '<span class="wpstorm-clean-admin-new-section">' . __('new', 'wpstorm-clean-admin') . '</span>';
			add_menu_page(
				__('Wpstorm Clean Admin', 'wpstorm-clean-admin'),
				__('Wpstorm Clean Admin', 'wpstorm-clean-admin'),
				'manage_options',
				WPSTORM_CLEAN_ADMIN_SLUG,
				[$this, 'admin_page'],
				'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clip-rule="evenodd" /></svg>'),
				7
			);
			add_submenu_page(
				WPSTORM_CLEAN_ADMIN_SLUG,
				__('Wpstorm Clean Admin', 'wpstorm-clean-admin'),
				__('Auth', 'wpstorm-clean-admin'),
				'manage_options',
				WPSTORM_CLEAN_ADMIN_SLUG,
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
			<div class="wrap wpstorm-clean-admin-tw">
				<div id="wpstorm-clean-admin-dashboard" class="wpstorm-clean-admin-tw"></div>
			</div>
		<?php
		}

		/**
		 * This method is called when the admin head section is being rendered.
		 * It is used to perform any necessary actions or add any necessary scripts/styles to the admin head.
		 */
		public function admin_head()
		{
			wp_register_style('wpstorm-clean-admin-fonts', WPSTORM_CLEAN_ADMIN_ASSETS_URL . 'fonts/fonts.css', [], WPSTORM_CLEAN_ADMIN_VERSION, 'all');
			wp_enqueue_style('wpstorm-clean-admin-fonts');
		?>
			<style>
				#wpfooter {
					display: none;
				}

				#wpbody-content {
					padding-bottom: 0px !important;
				}
			</style>

			<?php

			if (is_rtl()) {
			?>
				<style>
					tr[data-plugin*='wpstorm-clean-admin/wpstorm-clean-admin.php'] {
						font-family: var(--wpstorm-clean-admin-font-family), Tahoma, Arial, sans-serif;
					}
				</style>
<?php
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
