<?php

namespace WpstormCleanAdmin\Includes\Modules;

use WpstormCleanAdmin\Includes\Core\Options;
use WpstormCleanAdmin\Includes\Core\Routes;

if (! defined('ABSPATH')) {
    exit;
}

if (! class_exists('Tracker')) {

    class Tracker
    {
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
            add_action('wp_login', [$this, 'track_last_login'], 10, 1);

            // Cron Cleanup
            add_action(WPSTORM_CLEAN_ADMIN_CRON_HOOK, [$this, 'cron_cleanup']);
        }

        public function track_last_login($user)
        {
            update_user_meta($user->ID, WPSTORM_CLEAN_ADMIN_META_LAST_LOGIN, current_time('mysql', true));
        }

        public function cron_cleanup()
        {
            $list = Routes::get_instance()->get_inactive_users(new class {
                // TODO: Learn how this works
                // tiny fake request object to reuse logic
                public function get_param($k)
                {
                    return null;
                }
            });

            if (!is_array($list) || empty($list['items'])) return;

            $actor = null; // cron
            foreach ($list['items'] as $row) {
                $uid = (int)$row['id'];
                $user = get_userdata($uid);
                if (!$user) continue;

                $exclude_roles_option = Options::get_option_item('generals', 'exclude_roles');
                $exclude_roles = array_map(
                    fn($role) => isset($role['value']) ? strtolower($role['value']) : '',
                    is_array($exclude_roles_option) ? $exclude_roles_option : []
                );

                if (array_intersect(array_map('strtolower', $user->roles), array_map('strtolower', $exclude_roles))) {
                    continue;
                }

                if (Options::get_option_item('generals', 'action', 'value') === 'deactivate') {
                    $user_obj = new \WP_User($uid);
                    $user_obj->set_role('inactive');
                    Routes::get_instance()->log_action($uid, 'cron_deactivate', $actor, 'Scheduled cleanup');
                } else {
                    require_once ABSPATH . 'wp-admin/includes/user.php';
                    if (wp_delete_user($uid)) {
                        Routes::get_instance()->log_action($uid, 'cron_delete', $actor, 'Scheduled cleanup');
                    }
                }
            }
        }
    }

    Tracker::get_instance();
}
