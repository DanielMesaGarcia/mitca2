const express = require('express');
const statusRouter = express.Router();
const StatusController = require('../controllers/StatusController');

statusRouter.route('/')
  .post(StatusController.createStatus)
  .get(StatusController.getStatuses);

statusRouter.route('/:_id')
  .get(StatusController.getStatusById)
  .put(StatusController.updateStatus)
  .delete(StatusController.deleteStatus);

module.exports = statusRouter;
