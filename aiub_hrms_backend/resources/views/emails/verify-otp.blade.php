<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; background: #f7f9fc; margin: 0; padding: 40px 20px; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,30,64,0.08); overflow: hidden; }
        .header { background: linear-gradient(135deg, #003366, #001e40); padding: 32px 40px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; }
        .header p { color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px; }
        .body { padding: 40px; }
        .greeting { font-size: 16px; color: #191c1e; margin-bottom: 16px; }
        .otp-box { background: #f2f4f7; border: 2px dashed #c3c6d1; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
        .otp-label { font-size: 11px; font-weight: 700; color: #43474f; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
        .otp-code { font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #001e40; }
        .note { font-size: 13px; color: #43474f; line-height: 1.6; }
        .footer { padding: 20px 40px; border-top: 1px solid #e0e3e6; font-size: 12px; color: #737780; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>AIUB HRMS</h1>
            <p>American International University-Bangladesh</p>
        </div>
        <div class="body">
            <p class="greeting">Hello, <strong>{{ $userName }}</strong>!</p>
            <p class="note">Your email verification code is:</p>
            <div class="otp-box">
                <div class="otp-label">Verification Code</div>
                <div class="otp-code">{{ $otp }}</div>
            </div>
            <p class="note">This code will expire in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
        <div class="footer">© {{ date('Y') }} AIUB HRMS. All rights reserved.</div>
    </div>
</body>
</html>
