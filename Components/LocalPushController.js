import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('LOCAL NOTIFICATION ==>', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

// export const LocalNotification = () => {
//   PushNotification.localNotification({
//     autoCancel: true,
//     bigText:
//       'This is local notification demo in React Native app. Only shown, when expanded.',
//     subText: 'Local Notification Demo',
//     title: 'Local Notification Title',
//     message: 'Expand me to see more',
//     vibrate: true,
//     vibration: 300,
//     playSound: true,
//     soundName: 'default',
//     actions: '["Yes", "No"]',
//   });
// };

export const createChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'HappyDriverPush', // (required)
      channelName: 'My channel', // (required)
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`JEFFERY_PUSH_NOTIFY CreateChannel : '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.getChannels(function (channel_ids) {
    console.log('JEFFERY_PUSH_NOTIFY Available Channels : '+channel_ids); // ['channel_id_1']
  });
};

export const Notify = (title, message) => {
  PushNotification.localNotification({
    channelId: 'HappyDriverPush',
    playSound: true,
    title: title,
    message: message,
    vibrate: true,
    vibration: 300,
    soundName: 'default',
    largeIconUrl:
      'https://drive.google.com/file/d/1icErQveNouoEDsARHQfgiEbwMd58KRlb/view?usp=sharing',
  });
};
