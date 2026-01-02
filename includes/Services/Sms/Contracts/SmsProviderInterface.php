<?php

namespace StormCleanAdmin\Includes\Services\Sms\Contracts;

use StormCleanAdmin\Includes\Services\Sms\DTO\SmsResult;

interface SmsProviderInterface
{
  public function id(): string;

  public function label(): string;

  public function configure(array $settings): void;

  public function is_configured(): bool;

  public function send(
    array|string $to,
    string $message,
    array $options = []
  ): SmsResult;

  public function get_credit(): ?float;

  public function supports_patterns(): bool;

  public function send_pattern(
    string $pattern,
    string $to,
    array $variables = []
  ): SmsResult;
}
