const Race = require('../models/Race'); // Make sure to adjust the correct path to the model
const Route = require('../models/Route');
const Status = require('../models/Status');
const fs = require('fs');
const path = require('path');
// Controller to create a new race
exports.createRace = async (req, res) => {
  try {
    const newRace = new Race(req.body);
    newRace.filename = '';
  if (req.file) {
    newRace.filename = req.file.filename;
  }
    await newRace.save();
    res.status(201).json({ success: true, data: newRace });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to get all races
exports.getRaces = async (req, res) => {
  try {
    const races = await Race.find().populate('route').populate('status').populate('runners').populate('sponsors');
    res.status(200).json({ success: true, data: races });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// Controller to get a race by its ID
exports.getRaceById = async (req, res) => {
  try {
    const race = await Race.findById(req.params._id).populate('route').populate('status').populate('runners').populate('sponsors');
    if (!race) {
      return res.status(404).json({ success: false, error: 'Race not found' });
    }
    res.status(200).json({ success: true, data: race });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to update a race by its ID
exports.updateRace = async (req, res) => {
  try {
    const race = await Race.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
      runValidators: true,
    }).populate('route').populate('status').populate('runners').populate('sponsors');
    if (!race) {
      return res.status(404).json({ success: false, error: 'Race not found' });
    }
    res.status(200).json({ success: true, data: race });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};




exports.patchRace = async (req, res) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    const race = await Race.findOne({ _id: _id });

    if (!race) {
      return res.status(404).json({ success: false, error: 'Race not found' });
    }

    // Si la actualización incluye el operador $push
    if ('$push' in updates) {
      await Race.updateOne({ _id: _id }, updates);
    } else {
      // Actualizar otros campos usando el enfoque anterior
      Object.keys(updates).forEach((key) => {
        race[key] = updates[key];
      });

      await race.save();
    }
    const race2 = await Race.findOne({ _id: _id }).populate('sponsors').populate('runners');
    res.status(200).json({ success: true, data: race2 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



exports.deleteRace = async (req, res) => {
  try {
    const race = await Race.findByIdAndDelete(req.params._id);
    if (!race) {
      return res.status(404).json({ success: false, error: 'Race not found' });
    }

    // Delete associated Route and Status
    await Route.findOneAndDelete({ _id: race.route });
    await Status.findOneAndDelete({ _id: race.status });

    const imagePath = path.join(__dirname, '..', 'public', 'images', race.filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }


    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateRunners = async (req, res) => {
  try {
    const raceId = req.body.id;
    const race = await Race.findById(raceId);

    if (!race) {
      return res.status(404).json({ success: false, error: 'Carrera no encontrada' });
    }

    const runnerBuffer = req.body.runnerBuffer;
    const starter = req.body.starter;

    // Filtra los corredores que NO están en el runnerBuffer y estaban en starter
    race.runners = race.runners.filter(runner => !runnerBuffer.includes(runner) && !starter.includes(runner));

    // Agrega los nuevos corredores
    race.runners = race.runners.concat(runnerBuffer);

    // Guarda la carrera actualizada en la base de datos
    await race.save();
    const race2 = await Race.findById(raceId).populate('runners');
    res.status(200).json({ success: true, data: race2 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.deleteSponsorFromRace = async (req, res) => {
  try {
    const raceId = req.params._id;
    const sponsorId = req.body.userSponsorId; // Lee el parámetro del cuerpo

    const race = await Race.findByIdAndUpdate(
      raceId,
      { $pull: { sponsors: sponsorId } },
      { new: true }
    ).populate('sponsors');

    if (!race) {
      return res.status(404).json({ success: false, error: 'Race not found' });
    }

    res.status(200).json({ success: true, data: race });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

