<?php

namespace WpstormCleanAdmin\Includes\Core;

if (! defined('ABSPATH')) {
  exit;
}

if (! class_exists('Deactivator')) {

  class Deactivator
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
      register_deactivation_hook(WPSTORM_CLEAN_ADMIN_FILE, [$this, 'deactivate']);
    }

    public function deactivate()
    {
      // Clear scheduled events

      // Clear cron jobs
    }
  }

  Deactivator::get_instance();
}
