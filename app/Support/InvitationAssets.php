<?php

namespace App\Support;

use Illuminate\Support\Facades\Vite;

final class InvitationAssets
{
    public const COVER_IMAGE_SOURCE = 'resources/images/theme-special03/couple.jpg';

    public const FAVICON_SOURCE = 'resources/images/theme-special03/couple.jpg';

    public const SHARE_IMAGE_SOURCE = 'resources/images/share/undangan-mutia-restu.jpg';

    private const STYLE_SOURCE = 'resources/css/undangan/style.css';

    private const COMPAT_STYLE_SOURCE = 'resources/css/undangan/compat.css';

    public static function coverImageUrl(): string
    {
        return Vite::asset(self::COVER_IMAGE_SOURCE);
    }

    public static function faviconUrl(): string
    {
        return Vite::asset(self::FAVICON_SOURCE);
    }

    public static function shareImageUrl(): string
    {
        return Vite::asset(self::SHARE_IMAGE_SOURCE);
    }

    /** @return array{style: string, compat: string} */
    public static function styleUrls(): array
    {
        return [
            'style' => Vite::asset(self::STYLE_SOURCE),
            'compat' => Vite::asset(self::COMPAT_STYLE_SOURCE),
        ];
    }
}
