export interface NotifyConfig {
    telegramConfig: {
        token: string;
        options?: {
            polling?: boolean;
        };
    };
}
export type Recipient = {
    telegramChatId?: string;
    discordWebhookUrl?: string;
};
