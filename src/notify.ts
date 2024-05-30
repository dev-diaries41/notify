import TelegramBot from 'node-telegram-bot-api';
import { NOTIFY_ERROR_MESSAGES, NOTEE_ALERT_TAG } from './constants/notifications';
import { Recipient, NotifyConfig } from './constants/types';

export class Notify extends TelegramBot {
  static ERROR_MESSAGES = NOTIFY_ERROR_MESSAGES;

  constructor(config: NotifyConfig) {
    const { telegramConfig } = config || {};
    super(telegramConfig.token, telegramConfig.options = { polling: false });
  }

  async telegram( chatId: string | number, message: string) {
    const result = this.validateTelegramNotification(chatId, message);

    if (!result.success) {
      console.error(result.error);
      return result;
    }
    try {
      const result = await super.sendMessage(chatId, `${NOTEE_ALERT_TAG}\n${message}`);
      // console.log(result)
      return { success: true, message: 'TELEGRAM NOTIFICATION SENT' };
    } catch (error:any) {
      return { success: false, error: error as Error};
    }
  }


  async discord(webhook: URL | string, message: string) {
    const result = this.validateDiscordNotifications(webhook, message);

    if (!result.success) {
      console.error(result.error);
      return result;
    }

    const formatDiscordMsg = (message: string) => ({content: `${NOTEE_ALERT_TAG}`,embeds: [{ title: 'New Message', description: message }]});

    try {
      const { status } = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatDiscordMsg(message)),
      });

      return { success: status === 204, message: 'DISCORD NOTIFICATION SENT'};
    } catch (error:any) {
      return { success: false, error: error as Error};
    }
  }
  
  async broadcast(recipients: Recipient[], message: string){
    try{
      const broadcastPromises: any[] = [];
      recipients.forEach(recipient => {
        if(recipient.telegramChatId){
          broadcastPromises.push(this.telegram(recipient.telegramChatId, message));
      }
        else if(recipient.discordWebhookUrl){
          broadcastPromises.push(this.discord(recipient.discordWebhookUrl, message));
      }
      })
      const results = await Promise.all(broadcastPromises)
      const messageSent = results.some(result => result?.success)
      return {success: messageSent, message: messageSent? 'MESSAGE SENT' : 'MESSAGE FAILED', results:results}
    }catch(error: any){
      return { success: false, error: error as Error};
    }
  }

  validateTelegramNotification(chatId: string | number, message: string) {
    if (!chatId) {
      return { success: false, error: Notify.ERROR_MESSAGES.CHANNEL_ID_MISSING };
    }
    if (!message) {
      return { success: false, error: Notify.ERROR_MESSAGES.MESSAGE_MISSING };
    }
    return { success: true, error: null};
  }

  validateDiscordNotifications(webhookUrl: URL | string, message: string) {
    if (!webhookUrl) {
      return { success: false, error: Notify.ERROR_MESSAGES.INVALID_DISCORD_WEBHOOK };
    }
    if (!message) {
      return { success: false, error: Notify.ERROR_MESSAGES.MESSAGE_MISSING };
    }
    return { success: true, error: null};
  }
}
