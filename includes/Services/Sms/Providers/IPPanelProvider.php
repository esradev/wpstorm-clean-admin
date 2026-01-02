<?php

namespace StormCleanAdmin\Includes\Services\Sms\Providers;

use StormCleanAdmin\Includes\Services\Sms\Contracts\SmsProviderInterface;
use StormCleanAdmin\Includes\Services\Sms\DTO\SmsResult;

if (! defined('ABSPATH')) {
  exit;
}

class IPPanelProvider implements SmsProviderInterface
{
  private array $config = [];

  public function id(): string
  {
    return 'ippanel';
  }

  public function label(): string
  {
    return 'IPPanel';
  }

  public function configure(array $config): void
  {
    $this->config = $config;
  }

  public function is_configured(): bool
  {
    return ! empty($this->config['username'])
      && ! empty($this->config['password']);
  }

  protected function auth(): array
  {
    return [
      'uname' => $this->config['username'],
      'pass'  => $this->config['password'],
    ];
  }

  public function send(array|string $to, string $message, array $options = []): SmsResult
  {
    $body = array_merge($this->auth(), [
      'op'      => 'send',
      'from'    => $options['sender'] ?? $this->config['sender'] ?? '',
      'to'      => (array) $to,
      'message' => $message,
      'time'    => '',
    ]);

    $response = wp_remote_post(
      $this->config['endpoint_send'],
      [
        'headers' => ['Content-Type' => 'application/json'],
        'body'    => wp_json_encode($body),
      ]
    );

    if (is_wp_error($response)) {
      return new SmsResult(false, $response->get_error_message());
    }

    return new SmsResult(true, 'SMS sent');
  }

  public function get_credit(): ?float
  {
    $body = array_merge($this->auth(), ['op' => 'credit']);

    $response = wp_remote_post(
      $this->config['endpoint_select'],
      [
        'headers' => ['Content-Type' => 'application/json'],
        'body'    => wp_json_encode($body),
      ]
    );

    if (is_wp_error($response)) {
      return null;
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);

    if (! isset($data[1])) {
      return null;
    }

    return (float) preg_replace('/[^0-9]/', '', $data[1]);
  }

  public function supports_patterns(): bool
  {
    return true;
  }

  public function send_pattern(string $pattern, string $to, array $variables = []): SmsResult
  {
    $body = [
      'user'        => $this->config['username'],
      'pass'        => $this->config['password'],
      'fromNum'     => $this->config['sender'],
      'op'          => 'pattern',
      'patternCode' => $pattern,
      'toNum'       => $to,
      'inputData'   => [$variables],
    ];

    $response = wp_remote_post(
      $this->config['endpoint_select'],
      [
        'headers' => ['Content-Type' => 'application/json'],
        'body'    => wp_json_encode($body),
      ]
    );

    if (is_wp_error($response)) {
      return new SmsResult(false, $response->get_error_message());
    }

    return new SmsResult(true, 'Pattern SMS sent');
  }
}
