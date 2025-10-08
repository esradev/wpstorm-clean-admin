<?php

namespace WpstormCleanAdmin\Includes\Core;

if (! defined('ABSPATH')) {
  exit;
}

if (! class_exists('Activator')) {

  class Activator
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
      register_activation_hook(WPSTORM_CLEAN_ADMIN_FILE, [$this, 'plugin_activate']);
    }

    public function plugin_activate(): void
    {
      $stored_version = get_option('wpstorm_clean_admin_version');

      if ($stored_version !== WPSTORM_CLEAN_ADMIN_VERSION) {
        // If the plugin version has changed, update the version option.
        update_option('wpstorm_clean_admin_version', WPSTORM_CLEAN_ADMIN_VERSION);
      }

      add_option('wpstorm_clean_admin_activated', true);

      // Create minimal "Inactive" user role (no caps)
      if (!get_role('inactive')) {
        add_role('inactive', 'Inactive', []);
      }

      $this->create_tables();

      $this->run_crons();
    }

    private function create_tables(): void
    {
      Database::get_instance()->create_login_logs_table();
    }

    private function run_crons()
    {
      if (!wp_next_scheduled(WPSTORM_CLEAN_ADMIN_CRON_HOOK)) {
        $recurrence = Options::get_option_item('generals', 'schedule', 'default') ?? 'daily';
        $recurrence = $this->sanitize_cron_recurrence($recurrence);
        wp_schedule_event(time() + 60, $recurrence, WPSTORM_CLEAN_ADMIN_CRON_HOOK);
      }
    }

    private function sanitize_cron_recurrence(string $r): string
    {
      return in_array($r, ['hourly', 'twicedaily', 'daily'], true) ? $r : 'daily';
    }
  }

  Activator::get_instance();
}
