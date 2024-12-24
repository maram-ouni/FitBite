const mongoose = require('mongoose');

const formulaireDynamiqueSchema = new mongoose.Schema({
  trimestre: {
    type: Number,
    required: false,
  },
  poidsActuel: {
    type: Number,
    required: false,
  },
  taille: {
    type: Number,
    required: false,
  },
  recommandations: {
    type: String,
    required: false,  // Ce champ peut être optionnel
  },
  ActivitePhysique: {
    type: String,
    required: false,
  },
  regimeSpecial: {
    type: String,
    required: false,  // Ce champ peut être optionnel
  },
  doctorRemarks: {
    type: String,
    required: false,  // Ce champ peut staffer
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: false,  // Utilisateur obligatoire pour lier le formulaire
  }
});

module.exports = mongoose.model('FormulaireDynamique', formulaireDynamiqueSchema);
