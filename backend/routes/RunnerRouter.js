const express = require('express');
const runnerRouter = express.Router();
const RunnerController = require('../controllers/RunnerController');

runnerRouter.route('/')
  .post(RunnerController.createRunner)
  .get(RunnerController.getRunners);

runnerRouter.route('/:_id')
  .get(RunnerController.getRunnerById)
  .put(RunnerController.updateRunner)
  .delete(RunnerController.deleteRunner);

module.exports = runnerRouter;
