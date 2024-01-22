import { NOTIFICATIONS_CONFIG } from "./src/constants/notifications.js";
import { Notify } from "./src/utils/notify.js";

const notify = new Notify(NOTIFICATIONS_CONFIG)

//Example usage:


// async function testNotifications(){
// //Email Notification:
// const emailOptions = {
//     text: 'Content of the email notification.',
//     // optionally include 'subject, from and to' fields
//     // the default from and to is based on your initial config - if omitted email will not be sent
//     // a default subject is also configured
//   };
  
//   const emailResult = await notify.email(emailOptions);
//   console.log(emailResult);
  
//   //Telegram Notification:
//   const telegramMessage = 'Content of the Telegram notification.';
//   const telegramResult = await notify.telegram(telegramMessage);
//   console.log(telegramResult);
  
//   //Discord Notification:
//   const discordMessage = 'Content of the Discord notification.';
//   const discordResult = await notify.discord(discordMessage);
//   console.log(discordResult);
  
//   //All:
//   const messageToAllChannels = 'Content of the notification sent to all channels.';
//   const allChannelsResult = await notify.all(messageToAllChannels);
//   console.log(allChannelsResult);
  
// }

// testNotifications()
