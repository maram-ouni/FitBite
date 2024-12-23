const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // Importer le modèle utilisateur
const router = express.Router(); // Keep using the router instance instead of app

// Route pour l'inscription (sans vérification par email)
router.post('/inscrire', async (req, res) => {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis' });
  }

  // Vérifier si l'email existe déjà
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Cet email est déjà utilisé' });
  }

  // Créer un nouvel utilisateur avec l'email et mot de passe en clair
  const newUser = new User({
    email,
    motDePasse, // Enregistrer le mot de passe en clair (vous devriez le hacher en production)
  });

  try {
    // Enregistrer l'utilisateur
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error });
  }
});



// Route pour la connexion
router.post('/connexion', async (req, res) => {
  const { email, motDePasse } = req.body;

  // Vérifier si les champs requis sont présents
  if (!email || !motDePasse) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
  }

  try {
    // Rechercher l'utilisateur par email
    const utilisateur = await User.findOne({ email });
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Comparer le mot de passe envoyé avec celui de la base de données
    if (motDePasse !== utilisateur.motDePasse) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }
    
    // Répondre avec les informations de l'utilisateur
    res.status(200).json({
      message: 'Connexion réussie.',
      utilisateur: { id: utilisateur._id, email: utilisateur.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error });
  }
});

router.post('/favorites', async (req, res) => {
  const { recetteId, utilisateurId } = req.body;

  try {
    const utilisateur = await User.findById(utilisateurId);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Logique pour ajouter la recette aux favoris de l'utilisateur
    utilisateur.favorites.push(recetteId);
    await utilisateur.save();

    res.status(200).json({ message: 'Recette ajoutée aux favoris' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout aux favoris', error });
  }
});

router.get('/favorites/:userId/:recipeId', async (req, res) => {
  const { userId, recipeId } = req.params;

  try {
    // Trouver l'utilisateur dans la base de données
    const utilisateur = await User.findById(userId);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si la recetteId existe dans le tableau de favoris
    const isFavorite = utilisateur.favorites.includes(recipeId);

    res.status(200).json({ isFavorite });
  } catch (error) {
    console.error("Erreur lors de la vérification de l'état favori :", error);
    res.status(500).json({
      message: "Erreur lors de la vérification de l'état favori",
      error: error.message,
    });
  }
});


router.delete('/favorites', async (req, res) => {
  const { recetteId, utilisateurId } = req.body;

  try {
    const utilisateur = await User.findById(utilisateurId);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier si la recette est déjà dans les favoris
    const index = utilisateur.favorites.indexOf(recetteId);

    if (index > -1) {
      // Si la recette est dans les favoris, la supprimer
      utilisateur.favorites.splice(index, 1);
      await utilisateur.save();
      return res.status(200).json({ message: 'Recette supprimée des favoris' });
    } else {
      // Si la recette n'est pas dans les favoris
      return res.status(404).json({ message: 'Recette non trouvée dans les favoris' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression des favoris', error });
  }
});

router.get('/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user and populate the favorite recipes
    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the populated recipes
    res.json(user.favorites);
  } catch (error) {
    console.error('Error fetching favorite recipes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/shopping-list/add', async (req, res) => {
  const { userId, ingredientName, quantity, unit, supermarcheNom, supermarcheImage } = req.body;

  try {
    // Trouver l'utilisateur par son ID
    const utilisateur = await User.findById(userId);

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Ajouter l'ingrédient avec les informations du supermarché à la liste de courses de l'utilisateur
    utilisateur.shoppingList.push({
      ingredientName,
      quantity,
      unit,
      supermarcheNom, // Nom du supermarché
      supermarcheImage // Image du supermarché
    });

    await utilisateur.save();

    // Répondre avec la liste de courses mise à jour
    res.status(200).json({
      message: "Ingrédient ajouté à la liste de courses",
      shoppingList: utilisateur.shoppingList,
    });
  } catch (error) {
    console.error('Erreur lors de l’ajout à la liste de courses:', error);
    res.status(500).json({
      message: "Erreur lors de l'ajout à la liste de courses",
      error,
    });
  }
});



router.get('/shopping-list/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Recherchez l'utilisateur et récupérez sa liste de courses
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retournez la liste de courses
    res.json(user.shoppingList);
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    res.status(500).json({ message: 'Server error' });
  }
});








// Route pour ajouter un ingrédient à la liste des courses de l'utilisateur
router.post('/shopping-list/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { ingredientName, quantity, unit, supermarcheNom, supermarcheImage } = req.body;

    // Valider les champs
    if (!ingredientName || !quantity || !unit || !supermarcheNom || !supermarcheImage) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Trouver l'utilisateur
    const utilisateur = await User.findById(userId);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Ajouter l'ingrédient à la liste des courses, y compris les informations du supermarché
    const newIngredient = { ingredientName, quantity, unit, supermarcheNom, supermarcheImage };
    utilisateur.shoppingList.push(newIngredient);

    // Enregistrer l'utilisateur mis à jour
    await utilisateur.save();

    res.status(201).json(newIngredient);
  } catch (error) {
    console.error('Erreur lors de l’ajout de l’ingrédient:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



router.delete('/shopping-list/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('userId reçu:', userId); // Debug: vérifier si l'userId est reçu

    // Rechercher l'utilisateur par son ID
    const utilisateur = await User.findById(userId);

    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vider la liste de courses de l'utilisateur
    utilisateur.shoppingList = [];
    await utilisateur.save();

    // Répondre au client avec succès
    res.status(200).json({ 
      message: 'Liste des courses réinitialisée avec succès',
      shoppingList: utilisateur.shoppingList
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de la liste des courses:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});



router.delete('/shopping-list/:userId/:itemId', async (req, res) => {
  const { userId, itemId } = req.params; // Utilisez itemId à la place de ingredientId

  try {
    // Recherchez l'utilisateur
    const utilisateur = await User.findById(userId);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Supprimez l'ingrédient de la liste de courses en filtrant par _id
    utilisateur.shoppingList = utilisateur.shoppingList.filter(ingredient => ingredient._id.toString() !== itemId); // Utilisez itemId ici
    await utilisateur.save();

    res.status(200).json({
      message: 'Ingrédient supprimé avec succès',
      shoppingList: utilisateur.shoppingList // Retournez la liste mise à jour
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l’ingrédient:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});




// Route pour récupérer un supermarché par son nom
router.get('/supermarches', async (req, res) => {
  const { nom } = req.query;  // Récupérer le nom du supermarché à partir des paramètres de requête

  try {
    // Rechercher un supermarché dans la base de données par nom
    const supermarche = await Supermarche.find({ nom: new RegExp(nom, 'i') }); // Recherche insensible à la casse

    if (supermarche.length === 0) {
      return res.status(404).json({ message: 'Supermarché non trouvé' });
    }

    return res.status(200).json(supermarche); // Retourner les supermarchés trouvés
  } catch (error) {
    console.error('Erreur lors de la récupération du supermarché:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/supermarchess', async (req, res) => {
  try {
    const supermarches = await Supermarche.find(); // Récupérer tous les supermarchés
    if (supermarches.length === 0) {
      return res.status(404).json({ message: 'Aucun supermarché trouvé' });
    }
    res.status(200).json(supermarches); // Retourner la liste des supermarchés
  } catch (error) {
    console.error('Erreur serveur lors de la récupération des supermarchés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


router.post('/meals', async (req, res) => {
  const { userId, mealType, items } = req.body;

  try {
    // Find the user by userId
    const user = await Utilisateur.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the new meal to the user's meal planning
    user.mealPlanning.push({ mealType, items });

    await user.save();

    // Respond with the updated user
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({ message: 'Error creating meal', error });
  }
});

// Route to get meals by user ID
router.get('/meals/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await Utilisateur.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(`user id: ${userId}`);
    // Log items to check itemType and itemId
    console.log(user.mealPlanning);

    await user.populate('mealPlanning.items.itemId');
    res.status(200).json(user.mealPlanning);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ message: 'Error fetching meals', error });
  }
});

// Route to update meal items
router.put('/meals/:userId', async (req, res) => {
  const { userId } = req.params;
  const { mealType, items } = req.body;

  try {
    // Find the user by userId
    const user = await Utilisateur.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the meal planning entry by mealType and update it
    const mealIndex = user.mealPlanning.findIndex(meal => meal.mealType === mealType);
    if (mealIndex === -1) {
      return res.status(404).json({ message: 'Meal type not found' });
    }

    // Update the items of the specified meal
    user.mealPlanning[mealIndex].items = items;

    await user.save();

    // Respond with the updated user
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating meal items:', error);
    res.status(500).json({ message: 'Error updating meal items', error });
  }
});











module.exports = router;

