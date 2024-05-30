# Notify

## Table of Contents
1. [Overview](#overview)
2. [How To Install](#how-to-install)
3. [How To Use](#how-to-use)

## Introduction
<a name="overview"></a>
The `notify` module is a notification utility that allows you to send messages via Telegram and Discord. It provides a simple API for broadcasting messages to multiple recipients on these platforms.

## How To Install
<a name="how-to-install"></a>

To install the `notify` module, follow these steps:

**Clone the repository:**
Enter the following command in your terminal:

```bash
git clone 'https://github.com/dev-diaries41/notify.git'
```

Change into the cloned repository directory:

```bash
cd notify
```

Install the required dependencies using npm:

```bash
npm install
```

## How To Use
<a name="how-to-use"></a>
You can get your Telegram bot token from the `Bot Father` Telegram channel. You can get your Discord webhook URL from within Discord.

### Examples

Example of sending a Telegram notification:

```typescript
import { Notify } from './notify';
import { NotifyConfig } from './constants/types';

// Your Telegram bot token from Bot Father
const config: NotifyConfig = {
  telegramConfig: {
    token: 'YOUR_TELEGRAM_BOT_TOKEN'
  }
};

// Initialize Notify instance
const notify = new Notify(config);

// Send a message
const chatId = 'TELEGRAM_CHAT_ID'; // Replace with the actual chat ID
const message = 'Hello, this is a test message for Telegram!';
notify.telegram(chatId, message)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
```

Example of sending a Discord notification:

```typescript
import { Notify } from './notify';
import { NotifyConfig } from './constants/types';

// Your Telegram bot token from Bot Father
const config: NotifyConfig = {
  telegramConfig: {
    token: 'YOUR_TELEGRAM_BOT_TOKEN'
  }
};

// Initialize Notify instance (the telegram config is still needed because Notify extends TelegramBot class)
const notify = new Notify(config);

// Send a message
const webhookUrl = 'YOUR_DISCORD_WEBHOOK_URL'; // Replace with the actual webhook URL
const message = 'Hello, this is a test message for Discord!';
notify.discord(webhookUrl, message)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
```

Example of sending a broadcast notification:

```typescript
import { Notify } from './notify';
import { NotifyConfig, Recipient } from './constants/types';

// Your Telegram bot token from Bot Father
const telegramConfig: NotifyConfig = {
  telegramConfig: {
    token: 'YOUR_TELEGRAM_BOT_TOKEN'
  }
};

// Initialize Notify instance
const notify = new Notify(telegramConfig);

// Define recipients
const recipients: Recipient[] = [
  { telegramChatId: 'TELEGRAM_CHAT_ID_1' },
  { discordWebhookUrl: 'DISCORD_WEBHOOK_URL_1' }
  // Add more recipients as needed
];

// Message to be broadcasted
const message = 'Hello, this is a broadcast message!';

// Send broadcast message
notify.broadcast(recipients, message)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.error(error);
  });
```

### Notes:
- Replace `'YOUR_TELEGRAM_BOT_TOKEN'`, `'TELEGRAM_CHAT_ID'`, and `'YOUR_DISCORD_WEBHOOK_URL'` with your actual credentials.

This documentation provides a basic overview and usage examples for the `Notify` class, making it easier for users to integrate and use it in their projects.