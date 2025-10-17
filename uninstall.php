<?php

/**
 * Fired when the plugin is uninstalled.
 *
 * @package WpstormCleanAdmin
 */

// If uninstall not called from WordPress, then exit.
if (! defined('WP_UNINSTALL_PLUGIN')) {
  exit;
}

// Delete plugin options
delete_option('wpstorm_clean_admin_version');
delete_option('wpstorm_clean_admin_activated');
delete_option('wpstorm_clean_admin_generals_options');

// Remove scheduled cron hooks
wp_clear_scheduled_hook('wsca_check_inactive_users_cron');

// Remove custom user role
remove_role('inactive');

// Optionally remove custom user meta (uncomment if you want to clean user meta)
// Note: This will remove tracking data. Consider keeping it for data retention.
/*
delete_metadata('user', 0, 'wsca_last_login', '', true);
*/

// Optionally remove custom database tables (uncomment to remove on uninstall)
// Note: This permanently deletes all login logs. Only enable if you're sure.
/*
global $wpdb;
$table_name = $wpdb->prefix . 'wpstorm_clean_admin_login_logs';
$wpdb->query("DROP TABLE IF EXISTS {$table_name}");
*/

// Clear any cached data
wp_cache_flush();
