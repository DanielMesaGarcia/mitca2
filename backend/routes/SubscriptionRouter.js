const express = require('express');
const subscriptionsRouter = express.Router();
const SubscriptionsController = require('../controllers/SubscriptionController');


subscriptionsRouter.post("/subscribe", SubscriptionsController.create);

  subscriptionsRouter.post("/sendNotificationToSubscriptionName", SubscriptionsController.sendNotificationToSubscriptionName);
 subscriptionsRouter.post("/deleteByEndpoint", SubscriptionsController.deleteByEndpoint);
 subscriptionsRouter.get("/", SubscriptionsController.findAll);
module.exports =subscriptionsRouter;
