# Notify Class Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [How to Install](#how-to-install)
3. [How to Use](#how-to-use)
4. [Troubleshooting](#troubleshooting)

## Introduction
<a name="introduction"></a>

The `Notify` class is a versatile utility designed for sending notifications through various channels, such as email, Telegram, and Discord. It offers developers a straightforward and unified interface, making it easy to seamlessly integrate notification functionality into their applications. The documentation is using module syntax throughout.

Notify is a fundamental aspect of an automated AI task system that I am building by integrating Notify with Langhchain Agents. For more details, refer to the documentation [here].


## How to Install
<a name="how-to-install"></a>

To use the `Notify` class in your project, follow these installation steps:

**Clone repo:**
Enter the following command in your terminal.

```bash
git clone https://github.com/dev-diaries41/notify.git
```

Change into the cloned repository directory:

```bash
cd notify
```

Install the required dependencies using npm:
  
```bash
npm install
```

## How to Use
<a name="how-to-use"></a>


### Initializing the Notify Class:

Create an instance of the `Notify` class by providing a flexible `NOTIFICATIONS_CONFIG` during instantiation. The configuration object may include settings for email, Telegram, and Discord. At least one of `emailConfig`, `discordConfig`, or `telegramConfig` is required.

**Import Notify Class:**
- Import the `Notify` class in the file where you intend to use it:

```javascript
import { Notify } from 'path-to-your-notify-class-file';
```

```javascript
// Example of node.js configuration object using .env variables
const NOTIFICATIONS_CONFIG = {
    emailConfig: {
      host: process.env.SMTP_HOST || 'smtp.office365.com',  // required if emailConfig is provided 
      user: process.env.HOST_USER_EMAIL || '',    // required if emailConfig is provided 
      pass: process.env.HOST_USER_PASS||'',   // required if emailConfig is provided 
      port: Number(process.env.SMTP_PORT) || 587, 
      secure: Boolean(process.env.SMTP_SECURE) || true,
      recipient: process.env.RECEIVING_EMAIL || '',

    },
    telegramConfig: {
      token: process.env.TELEGRAM_BOT_TOKEN || '',    // required if telegramConfig is provided 
      options: { polling: false },
      telegramChannelId: process.env.TELEGRAM_CHANNEL_ID || '',   // required if telegramConfig is provided 
    },
    discordConfig: {
      webhookUrl: process.env.DISCORD_WEBHOOK_URL || '',    // required if discordConfig is provided 
    },
  }

const notify = new Notify(NOTIFICATIONS_CONFIG);
```

### Sending Notifications:

#### Email Notification:

```javascript
const emailOptions = {
  text: 'Content of the email notification.',
  // optionally include 'subject, from and to' fields
  // the default from and to is based on your initial config - if omitted email will not be sent
  // a default subject is also configured
};

const emailResult = await notify.email(emailOptions);
console.log(emailResult);
```

#### Telegram Notification:

```javascript
const telegramMessage = 'Content of the Telegram notification.';
const telegramResult = await notify.telegram(telegramMessage);
console.log(telegramResult);
```

#### Discord Notification:

```javascript
const discordMessage = 'Content of the Discord notification.';
const discordResult = await notify.discord(discordMessage);
console.log(discordResult);
```

#### Sending Notifications to All Channels:

```javascript
const messageToAllChannels = 'Content of the notification sent to all channels.';
const allChannelsResult = await notify.all(messageToAllChannels);
console.log(allChannelsResult);
```

## Integrating with Express

You can easily integrate the `Notify` class into your Express server to handle notifications. Below is an example Express controller that validates incoming notifications and uses the `notify.all` method to send messages to all configured channels.

```javascript
import express from 'express';
import { notify } from '@path-to-notifications-service/notificationService.js';

const app = express();
const port = 3000; // Replace with your desired port number

app.use(express.json());

app.post('/notify', async (req, res) => {
  try {
    const { message } = req.body;
    const result = await notify.all(message);

    return result.success
      ? res.status(200).json(result)
      : res.status(400).json(result);
  } catch (error) {
    console.error(`Error in notify route: ${error.message}`);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

```


## Troubleshooting
<a name="troubleshooting"></a>


### Configuration Issues:

- **Invalid Configuration:**
  - If you encounter an "INVALID_CONFIGURATION" error, ensure that at least one of the email, discord or telegram configurations is provided.

### Notification Issues:

- **Notification Not Sent:**
  - If a notification fails, check the returned result for more information. Common issues include incorrect channel IDs, missing recipient email addresses, or invalid Discord webhooks. Errors can safely be ignore if they error ends with (ignore error if you intentially omitted the corresponding config), this will occur where you have intentionally omitted a given config.

This documentation provides a basic guide on installing, using, configuring, and troubleshooting the `Notify` class.