export const EXAMPLE_NOTIFICATIONS_CONFIG = {
    telegramConfig: {
      token: process.env.TELEGRAM_BOT_TOKEN || '',
      options: { polling: false },
    },
  }

  // Error messages for Notify class
  const IGNORE_ERROR_MESSAGE = ' (Ignore if you intentionally omitted the corresponding config)';
  export const NOTIFY_ERROR_MESSAGES = {
    TOKEN_NOT_PROVIDED: 'TOKEN_NOT_PROVIDED: Failed to create telegram bot' + IGNORE_ERROR_MESSAGE,
    INVALID_TELEGRAM_BOT: 'INVALID_TELEGRAM_BOT: Invalid telegram bot, did you provide a token?' + IGNORE_ERROR_MESSAGE,
    CHANNEL_ID_MISSING: 'CHANNEL_ID_MISSING: Invalid channel Id, message not sent.' + IGNORE_ERROR_MESSAGE,
    MESSAGE_MISSING: 'MESSAGE_MISSING: Missing message parameter, no message to send.',
    INVALID_DISCORD_WEBHOOK: 'INVALID_DISCORD_WEBHOOK: check your discordConfig properties and env variables' + IGNORE_ERROR_MESSAGE,
    INVALID_CONFIGURATION: 'INVALID_CONFIGURATION: At least one of `emailConfig`, `discordConfig`, or `telegramConfig` is required.',
  };

  export const NOTEE_ALERT_TAG = 'Notee Alert 🤖:'