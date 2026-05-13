<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmailVerificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $otp, public string $userName) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Verify Your AIUB HRMS Email');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.verify-otp', with: [
            'otp' => $this->otp,
            'userName' => $this->userName,
        ]);
    }
}
