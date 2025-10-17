<?php

namespace WpstormCleanAdmin\Includes\Core;

if (!defined('ABSPATH')) {
    exit;
}
if (!class_exists('I18n')) {

    class I18n
    {

        private static $instance;

        public static function get_instance()
        {
            if (!isset(self::$instance)) {
                self::$instance = new self();
            }

            return self::$instance;
        }

        public function __construct()
        {
            add_filter('load_textdomain_mofile', [$this, 'load_textdomain_mofile'], 999, 2);
        }

        /**
         * Loads the translation MO file for a specific domain.
         *
         * @param string $mofile The path to the MO file.
         * @param string $domain The translation domain.
         */
        public function load_textdomain_mofile($mofile, $domain)
        {
            if ('wpstorm-clean-admin' === $domain) {
                $mofile = WPSTORM_CLEAN_ADMIN_DIR_PATH . 'languages/wpstorm-clean-admin-' . get_locale() . '.mo';
            }

            return $mofile;
        }
    }

    I18n::get_instance();
}
