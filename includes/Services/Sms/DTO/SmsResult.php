<?php

namespace StormCleanAdmin\Includes\Services\Sms\DTO;

class SmsResult
{
  public function __construct(
    public bool $success,
    public ?string $message = null,
    public array $data = []
  ) {}
}
