const express = require('express');
const routeRouter = express.Router();
const RouteController = require('../controllers/RouteController');

routeRouter.route('/')
  .post(RouteController.createRoute)
  .get(RouteController.getRoutes);

routeRouter.route('/:_id')
  .get(RouteController.getRouteById)
  .put(RouteController.updateRoute)
  .delete(RouteController.deleteRoute);

module.exports = routeRouter;
