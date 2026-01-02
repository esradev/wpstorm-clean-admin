<?php

namespace StormCleanAdmin\Includes\Services\Sms\Exceptions;

use Exception;

if (! defined('ABSPATH')) {
  exit;
}

/**
 * Class SmsException
 *
 * Used to handle all SMS-related errors in WPStorm Hub.
 */
class SmsException extends Exception
{
  /**
   * Optional provider ID that triggered the exception
   *
   * @var string|null
   */
  private ?string $providerId = null;

  /**
   * SmsException constructor.
   *
   * @param string $message
   * @param int $code
   * @param string|null $providerId
   * @param Exception|null $previous
   */
  public function __construct(
    string $message = "",
    int $code = 0,
    ?string $providerId = null,
    ?Exception $previous = null
  ) {
    $this->providerId = $providerId;
    parent::__construct($message, $code, $previous);
  }

  /**
   * Get the provider ID that triggered this exception
   *
   * @return string|null
   */
  public function getProviderId(): ?string
  {
    return $this->providerId;
  }

  /**
   * Check if the exception came from a specific provider
   *
   * @param string $providerId
   * @return bool
   */
  public function isFromProvider(string $providerId): bool
  {
    return $this->providerId === $providerId;
  }
}
