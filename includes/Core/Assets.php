<?php

namespace StormCleanAdmin\Includes\Core;

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
            self::$current_link = esc_url_raw(
                (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') .
                    "://" . (isset($_SERVER['HTTP_HOST']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_HOST'])) : '') .
                    (isset($_SERVER['REQUEST_URI']) ? sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI'])) : '')
            );
            add_action('admin_enqueue_scripts', [$this, 'admin_enqueue_scripts']);
            add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        }

        public function admin_enqueue_scripts()
        {
            wp_enqueue_style('storm-clean-admin-admin-extra-styles', STORM_CLEAN_ADMIN_ASSETS_URL . 'css/admin-extra-styles.css', [], STORM_CLEAN_ADMIN_VERSION, 'all');
            //Load TailwindCss styles just for storm-clean-admin dashboard.
            if (false !== strpos(self::$current_link, home_url('/wp-admin/admin.php?page=' . STORM_CLEAN_ADMIN_SLUG))) {
                wp_enqueue_style('storm-clean-admin-admin-style', STORM_CLEAN_ADMIN_ASSETS_URL . 'build/index.css', [], STORM_CLEAN_ADMIN_VERSION, 'all');


                wp_enqueue_script(
                    'storm-clean-admin-settings-script',
                    STORM_CLEAN_ADMIN_ASSETS_URL . 'build/index.js',
                    [
                        'wp-element',
                        'wp-i18n',
                        'react-jsx-runtime'
                    ],
                    STORM_CLEAN_ADMIN_VERSION,
                    true
                );
                wp_register_script('storm-clean-admin-settings-script', STORM_CLEAN_ADMIN_ASSETS_URL . 'build/index.js', ['wp-element', 'wp-i18n', 'react-jsx-runtime'], STORM_CLEAN_ADMIN_VERSION, true);
                wp_set_script_translations('storm-clean-admin-settings-script', 'storm-clean-admin', STORM_CLEAN_ADMIN_DIR_PATH . 'languages');
                wp_localize_script(
                    'storm-clean-admin-settings-script',
                    'stormCleanAdminJsObject',
                    [
                        'rootapiurl'     => esc_url_raw(rest_url()),
                        'nonce'          => wp_create_nonce('wp_rest'),
                        'ajax_url'       => admin_url('admin-ajax.php'),
                        'src_assets_url' => plugins_url('assets', STORM_CLEAN_ADMIN_BASE),
                        'plugin_version' => STORM_CLEAN_ADMIN_VERSION
                    ]
                );
            }

            // Check if we are on the plugins.php page
            $current_screen = get_current_screen();
            if ($current_screen && $current_screen->id === 'plugins') {
                wp_enqueue_style('storm-clean-admin-plugins-styles', STORM_CLEAN_ADMIN_ASSETS_URL . 'css/plugins-page-links.css', [], STORM_CLEAN_ADMIN_VERSION, 'all');
            }
        }

        public function enqueue_scripts()
        {
            wp_enqueue_style('storm-clean-admin-frontend-styles', STORM_CLEAN_ADMIN_ASSETS_URL . 'css/frontend-styles.css', [], STORM_CLEAN_ADMIN_VERSION, 'all');
        }
    }

    Assets::get_instance();
}
