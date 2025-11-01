# Email Configuration Setup

The application uses SMTP to send verification and password reset emails. Here's how to configure it:

## For Gmail

1. **Enable 2-Factor Authentication** on your Google account (required for App Passwords)

2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "CampusConnect" as the app name
   - Click "Generate"
   - Copy the 16-character password (no spaces)

3. **Add to your `.env` file**:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=xxxx xxxx xxxx xxxx
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   FRONTEND_URL=http://localhost:5173
   ```

## For Other Email Providers

### Outlook/Hotmail:
```env
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Custom SMTP:
```env
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-password
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
```

## Development Mode (No Email)

If you don't configure email, the application will:
- Still allow registration/login
- Print verification/reset links to the console
- Return links in API responses (only in development/localhost)

The links will be in the format:
- Verification: `http://localhost:5173/verify-email?token=...`
- Password Reset: `http://localhost:5173/reset-password?token=...`

## Testing Without Email

1. Register a new user
2. Check the backend console output for the verification link
3. Or check the API response if running on localhost

