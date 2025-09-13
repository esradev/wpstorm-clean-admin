<?php

namespace WpstormCleanAdmin\Includes\Core;

if (! defined('ABSPATH')) {
    exit;
}

if (! class_exists('Assets')) {

    class Assets
    {
        private static object $instance;
        private static string $current_link;

        public static function get_instance()
        {
            if (! isset(self::$instance)) {
                self::$instance = new self();
            }

            return self::$instance;
        }

        public function __construct()
        {
            self::$current_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
            add_action('admin_enqueue_scripts', [$this, 'admin_enqueue_scripts']);
            add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        }

        public function admin_enqueue_scripts()
        {
            wp_enqueue_style('wpstorm-clean-admin-admin-extra-styles', WPSTORM_CLEAN_ADMIN_ASSETS_URL . 'css/admin-extra-styles.css', [], WPSTORM_CLEAN_ADMIN_VERSION, 'all');
            //Load TailwindCss styles just for wpstorm-clean-admin dashboard.
            if (false !== strpos(self::$current_link, home_url('/wp-admin/admin.php?page=' . WPSTORM_CLEAN_ADMIN_SLUG))) {
                wp_enqueue_style('wpstorm-clean-admin-admin-style', WPSTORM_CLEAN_ADMIN_ASSETS_URL . 'build/index.css', [], WPSTORM_CLEAN_ADMIN_VERSION, 'all');


                wp_enqueue_script(
                    'wpstorm-clean-admin-settings-script',
                    WPSTORM_CLEAN_ADMIN_ASSETS_URL . 'build/index.js',
                    [
                        'wp-element',
                        'wp-i18n',
                        'react-jsx-runtime'
                    ],
                    WPSTORM_CLEAN_ADMIN_VERSION,
                    true
                );
                wp_set_script_translations('wpstorm-clean-admin-settings-script', 'wpstorm-clean-admin', WPSTORM_CLEAN_ADMIN_DIR_PATH . 'languages');
                wp_localize_script(
                    'wpstorm-clean-admin-settings-script',
                    'wpstormCleanAdminJsObject',
                    [
                        'rootapiurl'     => esc_url_raw(rest_url()),
                        'nonce'          => wp_create_nonce('wp_rest'),
                        'ajax_url'       => admin_url('admin-ajax.php'),
                        'src_assets_url' => plugins_url('assets', WPSTORM_CLEAN_ADMIN_BASE),
                        'plugin_version' => WPSTORM_CLEAN_ADMIN_VERSION
                    ]
                );
            }

            // Check if we are on the plugins.php page
            $current_screen = get_current_screen();
            if ($current_screen && $current_screen->id === 'plugins') {
                wp_enqueue_style('wpstorm-clean-admin-plugins-styles', WPSTORM_CLEAN_ADMIN_ASSETS_URL . 'css/plugins-page-links.css');
            }
        }

        public function enqueue_scripts()
        {
            wp_enqueue_style('wpstorm-clean-admin-frontend-styles', WPSTORM_CLEAN_ADMIN_ASSETS_URL . 'css/frontend-styles.css', [], WPSTORM_CLEAN_ADMIN_VERSION, 'all');
        }
    }

    Assets::get_instance();
}
