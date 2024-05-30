"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notify = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const notifications_1 = require("./constants/notifications");
class Notify extends node_telegram_bot_api_1.default {
    constructor(config) {
        const { telegramConfig } = config || {};
        super(telegramConfig.token, telegramConfig.options = { polling: false });
    }
    async telegram(chatId, message) {
        const result = this.validateTelegramNotification(chatId, message);
        if (!result.success) {
            console.error(result.error);
            return result;
        }
        try {
            const result = await super.sendMessage(chatId, `${notifications_1.NOTEE_ALERT_TAG}\n${message}`);
            // console.log(result)
            return { success: true, message: 'TELEGRAM NOTIFICATION SENT' };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    async discord(webhook, message) {
        const result = this.validateDiscordNotifications(webhook, message);
        if (!result.success) {
            console.error(result.error);
            return result;
        }
        const formatDiscordMsg = (message) => ({ content: `${notifications_1.NOTEE_ALERT_TAG}`, embeds: [{ title: 'New Message', description: message }] });
        try {
            const { status } = await fetch(webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formatDiscordMsg(message)),
            });
            return { success: status === 204, message: 'DISCORD NOTIFICATION SENT' };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    async broadcast(recipients, message) {
        try {
            const broadcastPromises = [];
            recipients.forEach(recipient => {
                if (recipient.telegramChatId) {
                    broadcastPromises.push(this.telegram(recipient.telegramChatId, message));
                }
                else if (recipient.discordWebhookUrl) {
                    broadcastPromises.push(this.discord(recipient.discordWebhookUrl, message));
                }
            });
            const results = await Promise.all(broadcastPromises);
            const messageSent = results.some(result => result?.success);
            return { success: messageSent, message: messageSent ? 'MESSAGE SENT' : 'MESSAGE FAILED', results: results };
        }
        catch (error) {
            return { success: false, error: error };
        }
    }
    validateTelegramNotification(chatId, message) {
        if (!chatId) {
            return { success: false, error: Notify.ERROR_MESSAGES.CHANNEL_ID_MISSING };
        }
        if (!message) {
            return { success: false, error: Notify.ERROR_MESSAGES.MESSAGE_MISSING };
        }
        return { success: true, error: null };
    }
    validateDiscordNotifications(webhookUrl, message) {
        if (!webhookUrl) {
            return { success: false, error: Notify.ERROR_MESSAGES.INVALID_DISCORD_WEBHOOK };
        }
        if (!message) {
            return { success: false, error: Notify.ERROR_MESSAGES.MESSAGE_MISSING };
        }
        return { success: true, error: null };
    }
}
exports.Notify = Notify;
Notify.ERROR_MESSAGES = notifications_1.NOTIFY_ERROR_MESSAGES;
