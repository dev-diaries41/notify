import TelegramBot from 'node-telegram-bot-api';
import { Recipient, NotifyConfig } from './constants/types';
export declare class Notify extends TelegramBot {
    static ERROR_MESSAGES: {
        TOKEN_NOT_PROVIDED: string;
        INVALID_TELEGRAM_BOT: string;
        CHANNEL_ID_MISSING: string;
        MESSAGE_MISSING: string;
        INVALID_DISCORD_WEBHOOK: string;
        INVALID_CONFIGURATION: string;
    };
    constructor(config: NotifyConfig);
    telegram(chatId: string | number, message: string): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error: null;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: Error;
        message?: undefined;
    }>;
    discord(webhook: URL | string, message: string): Promise<{
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error: null;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: Error;
        message?: undefined;
    }>;
    broadcast(recipients: Recipient[], message: string): Promise<{
        success: boolean;
        message: string;
        results: any[];
        error?: undefined;
    } | {
        success: boolean;
        error: Error;
        message?: undefined;
        results?: undefined;
    }>;
    validateTelegramNotification(chatId: string | number, message: string): {
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error: null;
    };
    validateDiscordNotifications(webhookUrl: URL | string, message: string): {
        success: boolean;
        error: string;
    } | {
        success: boolean;
        error: null;
    };
}
