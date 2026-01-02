<?php

namespace StormCleanAdmin\Includes\Services\Sms;

use StormCleanAdmin\Includes\Services\Sms\Contracts\SmsProviderInterface;
use StormCleanAdmin\Includes\Services\Sms\DTO\SmsResult;
use StormCleanAdmin\Includes\Services\Sms\Providers\NullProvider;

class SmsService
{
  private static ?self $instance = null;

  private SmsProviderInterface $provider;

  private function __construct()
  {
    $this->provider = new NullProvider();
  }

  public static function get_instance(): self
  {
    if (! self::$instance) {
      self::$instance = new self();
    }
    return self::$instance;
  }

  public function set_provider(SmsProviderInterface $provider): void
  {
    $this->provider = $provider;
  }

  public function provider(): SmsProviderInterface
  {
    return $this->provider;
  }

  public function send(
    array|string $to,
    string $message,
    array $options = []
  ): SmsResult {
    return $this->provider->send($to, $message, $options);
  }

  public function send_pattern(
    string $pattern,
    string $to,
    array $variables = []
  ): SmsResult {
    return $this->provider->send_pattern($pattern, $to, $variables);
  }

  public function credit(): ?float
  {
    return $this->provider->get_credit();
  }
}
