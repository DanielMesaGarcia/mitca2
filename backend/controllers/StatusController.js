const Race = require('../models/Race');
const Status = require('../models/Status'); // Make sure to adjust the correct path to the model

// Controller to create a new status
exports.createStatus = async (req, res) => {
  try {
    const newStatus = new Status(req.body);
    await newStatus.save();
    res.status(201).json({ success: true, data: newStatus });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to get all statuses
exports.getStatuses = async (req, res) => {
  try {
    const statuses = await Status.find();
    res.status(200).json({ success: true, data: statuses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to get a status by its ID
exports.getStatusById = async (req, res) => {
  try {
    const status = await Status.findById(req.params._id);
    if (!status) {
      return res.status(404).json({ success: false, error: 'Status not found' });
    }
    res.status(200).json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to update a status by its ID
exports.updateStatus = async (req, res) => {
  try {
    const status = await Status.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!status) {
      return res.status(404).json({ success: false, error: 'Status not found' });
    }
    res.status(200).json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to delete a status by its ID
exports.deleteStatus = async (req, res) => {
  try {
    const status = await Status.findByIdAndDelete(req.params._id);
    if (!status) {
      return res.status(404).json({ success: false, error: 'Status not found' });
    }

    const race = await Race.findOne({ status: req.params._id });
    if (race) {
      race.status = undefined; // or you can use null if undefined doesn't work
      await race.save();
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
