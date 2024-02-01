const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Runner = require('./Runner');
const Sponsor = require('./Sponsor');

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6  // Mínimo 6 caracteres
  },
  DNI: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        // Expresión regular para validar el formato de un DNI español
        return /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(value);
      },
      message: props => `${props.value} no es un DNI válido.`
    }
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Expresión regular para validar que el número de teléfono tenga 9 dígitos
        return /^[0-9]{9}$/.test(value);
      },
      message: props => `${props.value} no es un número de teléfono válido.`
    }
  },

  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'sponsor']
  },
  //para los roles
  runners: [{ type: String, ref: Runner }],
  sponsor: { type: String, ref: Sponsor },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

// Compare the entered password with the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
