const mongoose = require('mongoose');

const runnerSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(value) {
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
        validator: function(value) {
          // Expresión regular para validar que el número de teléfono tenga 9 dígitos
          return /^[0-9]{9}$/.test(value);
        },
        message: props => `${props.value} no es un número de teléfono válido.`
      }
    },
    details: { type: String }
  });  

const Runner = mongoose.model('Runner', runnerSchema);
module.exports = Runner;
