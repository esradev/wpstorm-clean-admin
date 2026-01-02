<?php

namespace StormCleanAdmin\Includes\Services\Sms\Providers;

use StormCleanAdmin\Includes\Services\Sms\Contracts\SmsProviderInterface;
use StormCleanAdmin\Includes\Services\Sms\DTO\SmsResult;

if (! defined('ABSPATH')) {
  exit;
}

class NullProvider implements SmsProviderInterface
{
  public function id(): string
  {
    return 'null';
  }

  public function label(): string
  {
    return 'No SMS Provider';
  }

  public function configure(array $settings): void
  {
    // Nothing to configure
  }

  public function is_configured(): bool
  {
    return false;
  }

  public function send(array|string $to, string $message, array $options = []): SmsResult
  {
    // Does nothing, returns safe result
    return new SmsResult(false, 'No provider configured', []);
  }

  public function get_credit(): ?float
  {
    return null;
  }

  public function supports_patterns(): bool
  {
    return false;
  }

  public function send_pattern(string $pattern, string $to, array $variables = []): SmsResult
  {
    return new SmsResult(false, 'No provider configured', []);
  }
}
