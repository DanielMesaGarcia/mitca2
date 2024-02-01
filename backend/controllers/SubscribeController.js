const Subscription = require('../models/Subscription');
const webPush = require('web-push');

exports.create= async (req, res, next) => {
  const newSubscription = await Subscription.create ({...req.body});
  // return res.send ('hallo');
  const options = {
    vapidDetails: {
      subject: 'mailto:myemail@example.com',
      publicKey: process.env.PUBLIC_KEY,
      privateKey: process.env.PRIVATE_KEY,
    },
  };
  try {
    const res2 = await webPush.sendNotification (
      newSubscription,
      JSON.stringify ({
        title: 'Hello from server',
        description: 'this message is coming from the server',
        image: 'https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg',
      }),
      options
    );
    res.sendStatus(200)
  } catch (error) {
    console.log (error);
    res.sendStatus (500);
  }
}