const Runner = require('../models/Runner'); // Make sure to adjust the correct path to the model
const Race = require('../models/Race');
const User = require('../models/User');
// Controller to create a new runner
exports.createRunner = async (req, res) => {
  try {
    const newRunner = new Runner(req.body);
    await newRunner.save();
    res.status(201).json({ success: true, data: newRunner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to get all runners
exports.getRunners = async (req, res) => {
  try {
    const runners = await Runner.find();
    res.status(200).json({ success: true, data: runners });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to get a runner by their ID
exports.getRunnerById = async (req, res) => {
  try {
    const runner = await Runner.findById(req.params._id);
    if (!runner) {
      return res.status(404).json({ success: false, error: 'Runner not found' });
    }
    res.status(200).json({ success: true, data: runner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to update a runner by their ID
exports.updateRunner = async (req, res) => {
  try {
    const runner = await Runner.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!runner) {
      return res.status(404).json({ success: false, error: 'Runner not found' });
    }
    res.status(200).json({ success: true, data: runner });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to delete a runner by their ID
exports.deleteRunner = async (req, res) => {
  try {
    const runner = await Runner.findByIdAndDelete(req.params._id);
    if (!runner) {
      return res.status(404).json({ success: false, error: 'Runner not found' });
    }
    await Race.updateMany(
      { runners: runner._id },
      { $pull: { runners: runner._id } }
    );
    await User.updateMany(
      { runners: runner._id },
      { $pull: { runners: runner._id } }
    );
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
