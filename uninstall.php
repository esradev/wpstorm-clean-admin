<?php
// If uninstall not called from WordPress, then exit.
if (! defined('WP_UNINSTALL_PLUGIN')) {
  exit;
}

// Delete plugin options
delete_option('storm_clean_admin_version');
delete_option('storm_clean_admin_activated');
delete_option('storm_clean_admin_generals_options');

// Remove scheduled cron hooks
wp_clear_scheduled_hook('wsca_check_inactive_users_cron');

// Remove custom user role
remove_role('inactive');

wp_cache_flush();
