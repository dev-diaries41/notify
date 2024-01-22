import TelegramBot from 'node-telegram-bot-api';
import nodemailer from 'nodemailer';
import {z} from 'zod';

// Define a custom check for nodemailer.Transporter instances
const isTransporter = (value) => value instanceof nodemailer.Transporter;

// Define a custom check for TelegramBot instances
const isTelegramBot = (value) => value instanceof TelegramBot;

// Define the NotifyConfig schema with all objects optional
export const NOTIFY_SCHEMA = z.object({
    emailConfig: z.object({
      transporter: z.custom(isTransporter).optional(),
      host: z.string(),
      user: z.string(),
      pass: z.string(),
      port: z.number().optional(),
      secure: z.boolean().optional(),
      recipient: z.string(),
    }).refine((data) => !!data.transporter || (data.host && data.user && data.pass && data.recipient), {
      message: 'Invalid emailConfig. Either provide a transporter or specify host, user, pass, and recipient.',
      path: ['emailConfig'],
    }).optional(),
    telegramConfig: z.object({
      bot: z.custom(isTelegramBot).optional(),
      token: z.string(),
      options: z.object({
        polling: z.boolean().optional(),
      }).optional(),
      telegramChannelId: z.string(),
    }).refine((data) => !!data.bot || (data.token && data.telegramChannelId), {
      message: 'Invalid telegramConfig. Either provide a bot or specify token and telegramChannelId.',
      path: ['telegramConfig'],
    }).optional(),
    discordConfig: z.object({
      webhookUrl: z.string(),
    }).optional(),
  }).refine((data) => !!data.emailConfig || !!data.telegramConfig || !!data.discordConfig, {
    message: 'At least one of emailConfig, telegramConfig, or discordConfig must be provided.',
  });


