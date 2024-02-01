const User = require('../models/User'); // Make sure to adjust the correct path to the model
const RunnerController = require('../controllers/RunnerController');
const SponsorController = require('../controllers/SponsorController');
const jwt = require('jsonwebtoken');
const Runner = require('../models/Runner');
const Race = require('../models/Race');
const Sponsor = require('../models/Sponsor');

// Create a token for authentication
const createToken = (user) => {
  return jwt.sign({ _id: user._id }, 'your_secret_key');
};

exports.getUserFromToken = async (req, res) => {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(req.body.token, 'your_secret_key');
    // The decoded object will contain the data you stored in the token
    const userId = decoded._id;

    // You can use the userId to retrieve the user data from your database or wherever it is stored
    // Example: const user = getUserById(userId);

    try {
      const user = await User.findById(userId).populate('runners').populate('sponsor');
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } catch (error) {
    // If the token is invalid or expired, handle the error
    return {
      success: false,
      error: 'Invalid token'
    };
  }
};



exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    const token = createToken(newUser);
    res.status(201).json({ success: true, data: newUser, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  const { _id, password } = req.body;

  try {
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    const token = createToken(user);
    res.status(200).json({ success: true, token, role: user.role });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Controller to get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('runners').populate('sponsor');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to get a user by their ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params._id).populate('runners').populate('sponsor');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to update a user by their ID
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Controller to delete a user by their ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Borra todos los runners asociados al usuario
    await Promise.all(user.runners.map(async (runnerId) => {
      try {
        const runner = await Runner.findByIdAndDelete(runnerId);
        await Race.updateMany(
          { runners: runner._id },
          { $pull: { runners: runner._id } }
        );
      } catch (error) {
        console.log(error);
      }
    }));

    // Borra el sponsor asociado al usuario
    if (user.sponsor) {
      try {
        const sponsor = await Sponsor.findByIdAndDelete(user.sponsor);
        await Race.updateMany(
          { sponsors: sponsor._id },
          { $pull: { sponsors: sponsor._id } }
        );
      } catch (error) {
        console.log(error);
      }
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.patchRunner = async (req, res) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findOne({ _id: _id });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Si la actualización incluye el operador $push
    if ('$push' in updates) {
      await User.updateOne({ _id: _id }, updates);
    } else {
      // Actualizar otros campos usando el enfoque anterior
      Object.keys(updates).forEach((key) => {
        user[key] = updates[key];
      });

      await user.save();
    }
    const race2 = await User.findOne({ _id: _id }).populate('runners');
    res.status(200).json({ success: true, data: race2 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createCompany = async (req, res) => {
  try {
    const newSponsor = new Sponsor(req.body.companyData);
    await newSponsor.save();
    const newUser = new User({
      ...req.body.mappedData,
      sponsor: newSponsor._id, // Establecer el campo .sponsor con el _id del patrocinador
      role: 'sponsor',
    });

    await newUser.save();
    const token = createToken(newUser);
    res.status(201).json({ success: true, data: newUser, token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error: error.message });
  }
};