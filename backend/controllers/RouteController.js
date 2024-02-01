const Race = require('../models/Race');
const Ruta = require('../models/Route'); // Make sure to adjust the correct path to the model

// Controller to create a new route record
exports.createRoute = async (req, res) => {
  try {
    const newRoute = new Ruta(req.body);
    await newRoute.save();
    res.status(201).json({ success: true, data: newRoute });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to get all routes
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Ruta.find();
    res.status(200).json({ success: true, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to get a route by its ID
exports.getRouteById = async (req, res) => {
  try {
    const route = await Ruta.findById(req.params._id);
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }
    res.status(200).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to update a route by its ID
exports.updateRoute = async (req, res) => {
  try {
    const route = await Ruta.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }
    res.status(200).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to delete a route by its ID
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Ruta.findByIdAndDelete(req.params._id);
    if (!route) {
      return res.status(404).json({ success: false, error: 'Route not found' });
    }

    
    const race = await Race.findOne({ route: req.params._id });
    if (race) {
      race.route = undefined; // or you can use null if undefined doesn't work
      await race.save();
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
