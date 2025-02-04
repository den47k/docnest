<?php

namespace App\Enums;

enum TeamRole: string
{
    case Owner = 'owner';
    case Admin = 'admin';
    case Member = 'editor';
    case Guest = 'viewer';

    public static function toArray(): array
    {
        return array_values(self::toArray());
    }
}
