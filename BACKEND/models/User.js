const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    email: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
    nom: { type: String },
    prenom: { type: String },
    age: { type: Number },
    photo: { type: String },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recette' }],
    shoppingList: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },  // Ajoutez un _id unique
            ingredientName: { type: String, required: false },
            quantity: { type: Number, required: false },
            unit: { type: String, required: false },
            supermarcheNom :{ type: String, required: false },
            supermarcheImage :{ type: String },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Utilisateur', utilisateurSchema);
