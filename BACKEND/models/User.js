const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
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
    ],
    mealPlanning: [
        {
          mealType: { type: String, required: false }, // e.g., 'BREAKFAST', 'LUNCH'
          items: [
            {
              itemId: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'items.itemType', // Dynamically choose ref model
                required: false
              },
              itemType: { type: String, required: false, enum: ['Ingredient', 'Recette'] }, // Can be either Ingredient or Recette
              name: { type: String, required: false },
              count: { type: Number, required: false },
            }
          ],
        }
      ]
}, { timestamps: true });

module.exports = mongoose.model('Utilisateur', utilisateurSchema);
