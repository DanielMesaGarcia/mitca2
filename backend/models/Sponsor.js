const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(value) {
          // Expresión regular para validar el formato de un CIF español
          return /^[A-HJNP-SUVW][0-9]{8}$/.test(value);
        },
        message: props => `${props.value} no es un CIF válido.`
      }
    },
    companyName: { type: String, required: true },
    typeCompany: { type: String, required: true }
  });  
const Sponsor = mongoose.model('Sponsor', sponsorSchema);
module.exports = Sponsor;
