const Sponsor = require('../models/Sponsor'); // Make sure to adjust the correct path to the model

// Controller to create a new sponsor
exports.createSponsor = async (req, res) => {
  try {
    const newSponsor = new Sponsor(req.body);
    await newSponsor.save();
    res.status(201).json({ success: true, data: newSponsor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to get all sponsors
exports.getSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find();
    res.status(200).json({ success: true, data: sponsors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to get a sponsor by its ID
exports.getSponsorById = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params._id);
    if (!sponsor) {
      return res.status(404).json({ success: false, error: 'Sponsor not found' });
    }
    res.status(200).json({ success: true, data: sponsor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to update a sponsor by its ID
exports.updateSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!sponsor) {
      return res.status(404).json({ success: false, error: 'Sponsor not found' });
    }
    res.status(200).json({ success: true, data: sponsor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to delete a sponsor by its ID
exports.deleteSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params._id);
    if (!sponsor) {
      return res.status(404).json({ success: false, error: 'Sponsor not found' });
    }
    await Race.updateMany(
      { sponsors: sponsor._id },
      { $pull: { sponsors: sponsor._id } }
    );
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteSponsorCRUD = async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params._id);
    if (!sponsor) {
      return res.status(404).json({ success: false, error: 'Sponsor not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};