var express = require('express');
var raceRouter = express.Router();

var RaceController = require('../controllers/RaceController');
//Multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images');
    },
    filename: (req, file, cb) => {
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});

var upload = multer({storage: storage});


// Create endpoint handlers for /races
raceRouter.route('/')
  .post(upload.single('filename'), RaceController.createRace)
  .get(RaceController.getRaces)
  .patch(RaceController.updateRunners);
// Create endpoint handlers for /races/:race_id
raceRouter.route('/:_id')
  .get(RaceController.getRaceById)
  .put(upload.single('filename'), RaceController.updateRace)
  .delete(RaceController.deleteRace)
  .patch(RaceController.patchRace);

  raceRouter.route('/sponsor/:_id').delete(RaceController.deleteSponsorFromRace);
module.exports = raceRouter;