<?php

namespace StormCleanAdmin\Includes\Services\Sms\Presets;

class IPPanelBrands
{
  public static function all(): array
  {
    return [
      'farazsms' => [
        'label' => 'FarazSMS',
        'endpoints' => [
          'send'   => 'http://ippanel.com/api/select',
          'select' => 'http://ippanel.com/api/select',
        ],
        'defaults' => [
          'sender' => '3000505',
        ],
      ]
    ];
  }

  public static function get(string $brand): ?array
  {
    return self::all()[$brand] ?? null;
  }
}
