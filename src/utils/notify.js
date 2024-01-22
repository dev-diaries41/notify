import TelegramBot from 'node-telegram-bot-api';
import nodemailer from 'nodemailer';
import {NOTIFICATIONS_CONFIG, NOTIFY_ERROR_MESSAGES, NOTEE_ALERT_TAG } from '../constants/notifications.js';
import { NOTIFY_SCHEMA } from '../constants/schemas.js'; 

class Notify {
  static ERROR_MESSAGES = NOTIFY_ERROR_MESSAGES;

  constructor(config) {
    const validConfig = NOTIFY_SCHEMA.safeParse(config)
    if (!validConfig.success) {
      throw new Error(NOTIFY_ERROR_MESSAGES.INVALID_CONFIGURATION) ;
    }
    const { emailConfig, telegramConfig} = config || {};
    this.transporter = emailConfig?.transporter || this.createTransporter(emailConfig);
    this.telegramBot = telegramConfig?.bot || this.createTelegramBot(telegramConfig);
    this.telegramChannelId = telegramConfig?.telegramChannelId || null;
    this.recipient = emailConfig?.recipient || null;
  }

  // Initialize telegram bot
   createTelegramBot(telegramConfig) {
    try {
      const { token, options = { polling: false } } = telegramConfig || {};

      if (!token) {
        throw new Error(Notify.ERROR_MESSAGES.TOKEN_NOT_PROVIDED);
      }

      return new TelegramBot(token, options);
    } catch (error) {
      console.error('Error creating Telegram bot:', error.message);
      return null;
    }
  }

  // Initialize email transporter
   createTransporter(transporterOptions) {
    try {
      const { host, user, pass, port = 587, secure = false } = transporterOptions || {};

      if (!host || !user || !pass) {
        throw new Error(Notify.ERROR_MESSAGES.MISSING_TRANSPORTER_CREDENTIALS);
      }

      return nodemailer.createTransport({
        host: host,
        port: port,
        secure: secure,
        auth: {
          user: user,
          pass: pass,
        },
      });
    } catch (error) {
      console.error('Error creating transporter:', error.message);
      return null;
    }
  }

   async email(emailOptions){
    const { from, subject = NOTEE_ALERT_TAG, text } = emailOptions || {};
    const result = this.validateEmailNotification(emailOptions);
  
    if (!result.success) {
      console.error(result.error);
      return Promise.resolve({ success: false, error: result.error });
    }
    
    // Promise returning the result of sending the email
    return new Promise((resolve) => {
      const mailOptions = {
        from: from ||  NOTIFICATIONS_CONFIG?.emailConfig?.user,
        to: this.recipient,
        subject: subject,
        text:  `${NOTEE_ALERT_TAG}\n${text}`,
      };
  
      this.transporter?.sendMail(mailOptions, (error, _info) => {
        if (error) {
          resolve({ success: false, message: Notify.ERROR_MESSAGES.EMAIL_NOT_SENT + ` ${error.message}`});
        } else {
          resolve({ success: true, message: 'EMAIL NOTIFICATION SENT' });
        }
      });
    });
  }
  

   async telegram(message) {
    const result = this.validateTelegramNotification(message);

    if (!result.success) {
      console.error(result.error);
      return result;
    }

    try {
      await this.telegramBot?.sendMessage(parseInt(this.telegramChannelId), `${NOTEE_ALERT_TAG}\n${message}`,);
      return { success: true, message: 'TELEGRAM NOTIFICATION SENT' };
    } catch (error) {
      console.error('Error sending Telegram message:', error.message);
      return { success: false, error: error.message };
    }
  }

    validateTelegramNotification(message) {
    //Handle the case where there is no message
    if (!message) {
      return { success: false, error: Notify.ERROR_MESSAGES.MESSAGE_MISSING };
    }
    // Handle the case where the telegram bot is invalid
    if (!this.telegramBot) {
      return { success: false, error: Notify.ERROR_MESSAGES.INVALID_TELEGRAM_BOT };
    }
    // Handle the case where channel/chat id is invalid
    if (!this.telegramChannelId) {
      return { success: false, error: Notify.ERROR_MESSAGES.CHANNEL_ID_MISSING };
    }

    return { success: true, message: 'Telegram notification parameters are valid' };
  }

   validateEmailNotification(emailOptions) {
    const { from =  NOTIFICATIONS_CONFIG?.emailConfig?.user, text } = emailOptions || {};
    
    // Handle the case where the nodemailer transporter is invalid
    if (!this.transporter) {
      return { success: false, error: Notify.ERROR_MESSAGES.INVALID_TRANSPORTER };
    }
    // Handle the case where the email sender 'from' is invalid
    if (!from) {
      return { success: false, error: Notify.ERROR_MESSAGES.MISSING_EMAIL_OPTIONS + ': "from" parameter is required' };
    }
    // Handle the case where the recipient is invalid
    // An error here means the emailConfig is missing or RECIPIENT environment variable not including
    if (!this.recipient) {
      return { success: false, error: Notify.ERROR_MESSAGES.MISSING_EMAIL_OPTIONS + ': "recipient" parameter is required check your env variables' };
    }
    // Handle the case where the message 'text' is invalid
    if (!text) {
      return { success: false, error: Notify.ERROR_MESSAGES.MISSING_EMAIL_OPTIONS + ': "text" parameter is required' };
    }
  
    return { success: true, message: 'Email notification parameters are valid' };
  }

   validateDiscordNotifications(webhookUrl, message){
      // Handle the case where the webhook is invalid
      if (!webhookUrl) {
        return { success: false, error: Notify.ERROR_MESSAGES.INVALID_DISCORD_WEBHOOK };
      }
      // Handle the case where the message is invalid
      if (!message) {
        return { success: false, error: Notify.ERROR_MESSAGES.MESSAGE_MISSING};
      }
      return { success: true, message: 'Discord notification parameters are valid' };
  }

  async discord( message) {
    const webhookUrl = NOTIFICATIONS_CONFIG?.discordConfig?.webhookUrl;
    const result = this.validateDiscordNotifications(webhookUrl, message)

    if (!result.success) {
      console.error(result.error);
      return result;
    }   
    
    const formatDiscrodMsg = (message )=> ({
      content:  `${NOTEE_ALERT_TAG}`,
      embeds: [
        {
          title: 'New Message',
          description: message,
        },
      ],
    })

    try {
      const {status} = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formatDiscrodMsg(message)),
      });
     
      return { success: status === 204, message: status === 204? 'DISCORD NOITFICATION SENT' : 'DISCORD NOITFICATION FAILED' };

    } catch (error) {
      console.error(`Error in discord: ${error}`);
      return { success: false, error: error.message };
    }
  }

  async all (message){
    try{
      const notifyPromises = [this.email({text:message}), this.discord(message), this.telegram(message)];
      const results = await Promise.all(notifyPromises)
      const messageSent = results.some(result => result?.success)
      return {success: messageSent, message: messageSent? 'MESSAGE SENT' : 'MESSAGE FAILED', results:results}
    }catch(error){
      console.error(`Error sending all messages: ${error}`);
      return { success: false, error: error.message };
    }
    
  }
}

export {Notify};
