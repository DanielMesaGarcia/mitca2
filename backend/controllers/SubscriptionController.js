const Subscription = require('../models/Subscription');
const webPush = require('web-push');

exports.create = (req, res) => {
  // TODO: validate req.body
  const subscription = {
    endpoint: req.body.subscription.endpoint,
    expirationTime: req.body.subscription.expirationTime,
    keys: {
      p256dh: req.body.subscription.keys.p256dh,
      auth: req.body.subscription.keys.auth,
    },
    subscriptionName: req.body.subscriptionName
  }

  Subscription.create(subscription).then(async (data) => {
    Subscription.find().then((subscriptionsInDB) => {

      for (let s of subscriptionsInDB) {
        if (s && s.endpoint && s.keys && s.keys.p256dh && s.keys.auth) {
          const subscriptionRecipient = {
            endpoint: s.endpoint,
            expirationTime: s.expirationTime,
            keys: {
              p256dh: s.keys.p256dh,
              auth: s.keys.auth,
            }
          }
          const title = `New Subscription`;
          const description = `${data.subscriptionName} is now subscribed`;
          sendNotification(subscriptionRecipient, title, description);
          return subscriptionRecipient;
        } else {
          console.log("Invalid subscription data:", s);
        }
      }




    }).catch(err => {
      console.log(err);
      res.status(500).send({
        message: err.message || "some error happened"
      })
    });
  }).catch(err => {
    console.log(err);
    res.status(500).send({
      message: err.message || "some error happened"
    })
  })
}

exports.findAll = (req, res) => {
  Subscription.find().then(data => {
    res.send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "some error happened"
    })
  })
}

exports.sendNotificationToSubscriptionName = (req, res) => {
  // TODO: validate req.body
  
  Subscription.find({
    subscriptionName: "Carreras"
  }).then((subscriptionsInDB) => {
    
    subscriptionsInDB.forEach((s) => {
      const subscriptionRecipient = {
        endpoint: s.endpoint,
        expirationTime: s.expirationTime,
        keys: {
          p256dh: s.keys.p256dh,
          auth: s.keys.auth,
        }
      }
      const title = `CARRERA EMPEZADA`;
      const description = req.body.notificationMessage;
      sendNotification(subscriptionRecipient, title, description);
      
    });
    res.send("notification sent");
  }).catch(err => {
    
    res.status(500).send({
      message: err.message || "some error happened"
    });
  });
};


exports.findOne = (req, res) => {
  //TODO:
}

exports.update = (req, res) => {
  //TODO:
}

exports.deleteByEndpoint = (req, res) => {
  // TODO: validate req.body

  Subscription.findOne({
    endpoint: req.body.endpoint
  }).then((subscriptionToDelete) => {
    if (!subscriptionToDelete) {
      res.send("endpoint not found");
      return;
    }

    Subscription.deleteOne({
      _id: subscriptionToDelete._id
    }).then(() => {
      Subscription.find().then((subscriptionsInDB) => {
        subscriptionsInDB.forEach((s) => {
          const subscriptionRecipient = {
            endpoint: s.endpoint,
            expirationTime: s.expirationTime,
            keys: {
              p256dh: s.keys.p256dh,
              auth: s.keys.auth,
            }
          }
          const title = `Subscription to ${subscriptionToDelete.subscriptionName} deleted`;
          const description = "";
          sendNotification(subscriptionRecipient, title, description);
        });
        res.status(200).send("subscription deleted");
      }).catch(err => {
        res.status(500).send({
          message: err.message || "some error happened"
        });
      });
    }).catch(err => {
      res.status(500).send({
        message: err.message || "some error happened"
      });
    });
  }).catch(err => {
    res.status(500).send({
      message: err.message || "some error happened"
    });
  });
};


const sendNotification = async (subscriptionRecipient, title, description) => {
  const options = {
    vapidDetails: {
      subject: 'mailto:myemail@example.com',
      publicKey: process.env.PUBLIC_KEY,
      privateKey: process.env.PRIVATE_KEY,
    },
  };
  try {
    await webPush.sendNotification(
      subscriptionRecipient,
      JSON.stringify({
        title,
        description,
        image: 'https://cdn2.vectorstock.com/i/thumb-large/94/66/emoji-smile-icon-symbol-smiley-face-vector-26119466.jpg',
      }),
      options
    );
  } catch (error) {
    throw (error);
  }
}

