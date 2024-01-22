import dotenv from 'dotenv'

dotenv.config()

export const NOTIFICATIONS_CONFIG = {
    emailConfig: {
      host: process.env.SMTP_HOST || 'smtp.office365.com',
      user: process.env.HOST_USER_EMAIL || '',
      pass: process.env.HOST_USER_PASS||'',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Boolean(process.env.SMTP_SECURE) || false,
      recipient: process.env.RECEIVING_EMAIL || '',

    },
    telegramConfig: {
      token: process.env.TELEGRAM_BOT_TOKEN || '',
      options: { polling: false },
      telegramChannelId: process.env.TELEGRAM_CHANNEL_ID || '',
    },
    discordConfig: {
      webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',
    },
  }

  // Error messages for Notify class
  const IGNORE_ERROR_MESSAGE = ' (Ignore if you intentionally omitted the corresponding config)'
  export const NOTIFY_ERROR_MESSAGES = {
    TOKEN_NOT_PROVIDED: 'TOKEN_NOT_PROVIDED: Failed to create telegram bot' + IGNORE_ERROR_MESSAGE,
    INVALID_TELEGRAM_BOT: 'INVALID_TELEGRAM_BOT: Invalid telegram bot, did you provide a token?' + IGNORE_ERROR_MESSAGE,
    CHANNEL_ID_MISSING: 'CHANNEL_ID_MISSING: Invalid channel Id, message not sent.' + IGNORE_ERROR_MESSAGE,
    MISSING_TRANSPORTER_CREDENTIALS: 'MISSING_TRANSPORTER_CREDENTIALS: Missing credentials, host, user, and pass are required' + IGNORE_ERROR_MESSAGE,
    INVALID_TRANSPORTER: 'INVALID_TRANSPORTER: Invalid transporter, check your email configuration ' + IGNORE_ERROR_MESSAGE,
    MISSING_EMAIL_OPTIONS: 'MISSING_EMAIL_OPTIONS: Missing credentials, from, to, and text are required' + IGNORE_ERROR_MESSAGE,
    MESSAGE_MISSING: 'MESSAGE_MISSING: Missing message parameter, no message to send.',
    EMAIL_NOT_SENT: 'EMAIL_NOT_SENT: try checking your email config if the issue persists',
    INVALID_DISCORD_WEBHOOK: 'INVALID_DISCORD_WEBHOOK: check your discordConfig properties and env variables' + IGNORE_ERROR_MESSAGE,
    INVALID_CONFIGURATION: 'INVALID_CONFIGURATION: At least one of `emailConfig`, `discordConfig`, or `telegramConfig` is required.',
  };

  export const NOTEE_ALERT_TAG = 'Notee Alert 🤖:'