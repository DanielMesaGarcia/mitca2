const express = require('express');
const sponsorRouter = express.Router();
const SponsorController = require('../controllers/SponsorController');

sponsorRouter.route('/')
  .post(SponsorController.createSponsor)
  .get(SponsorController.getSponsors);

sponsorRouter.route('/:_id')
  .get(SponsorController.getSponsorById)
  .put(SponsorController.updateSponsor)
  .delete(SponsorController.deleteSponsor);

  sponsorRouter.route('/CRUD/:_id').delete(SponsorController.deleteSponsorCRUD);

module.exports = sponsorRouter;
