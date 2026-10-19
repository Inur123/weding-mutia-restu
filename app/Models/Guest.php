<?php

namespace App\Models;

use Database\Factories\GuestFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Guest extends Model
{
    /** @use HasFactory<GuestFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'name',
        'slug',
    ];

    protected static function booted(): void
    {
        static::creating(function (Guest $guest): void {
            if (empty($guest->slug)) {
                $guest->slug = static::generateUniqueSlug($guest->name);
            }
        });
    }

    public static function generateUniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $count = 2;

        while (static::query()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$count}";
            $count++;
        }

        return $slug;
    }

    public function getInvitationUrl(): string
    {
        return route('undangan', [
            'to' => $this->slug,
        ]);
    }

    public function getShareMessage(): string
    {
        return "Kepada Yth.\nBapak/Ibu/Saudara/i\n*{$this->name}*\n\n"
            ."---\n\n"
            ."Assalamualaikum Warahmatullahi Wabarakatuh\n\n"
            ."Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i, teman sekaligus rekan, untuk menghadiri pernikahan kami pada Kamis 19 November 2026.\n\n"
            ."Berikut link undangan kami, untuk info lengkap dari acara, bisa kunjungi :\n\n"
            .$this->getInvitationUrl()."\n\n"
            ."Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\n\n"
            ."Wassalamualaikum Warahmatullahi Wabarakatuh\n\n"
            ."Terima Kasih\n\n"
            ."Hormat kami,\n"
            .'Mutiara & Restu';
    }

    public function getWhatsappShareUrl(): string
    {
        $encodedMessage = rawurlencode($this->getShareMessage());

        return "https://api.whatsapp.com/send?text={$encodedMessage}";
    }
}
