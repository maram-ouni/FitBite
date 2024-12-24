const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const Utilisateur = require('../models/User');

const Recette = require('../models/recettes');

exports.inscrireUtilisateur = async (req, res) => {

    const email = req.body.email;

    const motDePasse = req.body.motDePasse;

 

    try {

        // Vérifier si l'utilisateur existe déjà

        const utilisateurExistant = await Utilisateur.findOne({ email });

        if (utilisateurExistant) {

            return res.status(400).json({ message: 'Utilisateur déjà existant.' });

        }

 

        // Hachage du mot de passe

        const hash = await bcrypt.hash(motDePasse, 10);

        const nouvelUtilisateur = new Utilisateur({

            email,

            motDePasse: hash,

        });

 

        // Sauvegarder le nouvel utilisateur dans la base de données

        const utilisateurEnregistre = await nouvelUtilisateur.save();

 

        // Retourner un message de succès avec l'ID de l'utilisateur

        res.status(201).json({

            message: 'Inscription réussie.',

            utilisateurId: utilisateurEnregistre._id, // Retourner l'ID

        });

    } catch (error) {

        res.status(500).json({ message: 'Erreur serveur: ' + error.message });

    }

};

// Inscription

// exports.inscrireUtilisateur = async (req, res) => {

//     const email= req.body.email;

//     const motDePasse = req.body.motDePasse;

 

//     try {

//         // Vérifier si l'utilisateur existe déjà

//         const utilisateurExistant = await Utilisateur.findOne({ email });

//         if (utilisateurExistant) {

//             return res.status(400).json({ message: 'Utilisateur déjà existant.' });

//         }

 

//         // Hachage du mot de passe

//         const hash = await bcrypt.hash(motDePasse, 10);

//         const nouvelUtilisateur = new Utilisateur({

//             email,

//             motDePasse: hash,

//         });

 

//         await nouvelUtilisateur.save();

//         res.status(201).json({ message: 'Inscription réussie.' });

//     } catch (error) {

//         res.status(500).json({ message: 'Erreur serveur: ' + error.message });

//     }

// };

 

// Connexion

exports.connecterUtilisateur = async (req, res) => {

    const { email, motDePasse } = req.body;

 

    try {

        const utilisateur = await Utilisateur.findOne({ email });

        if (!utilisateur) {

            return res.status(404).json({ message: 'Utilisateur non trouvé.' });

        }

 

        const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

        if (!isMatch) {

            return res.status(400).json({ message: 'Mot de passe incorrect.' });

        }

 

        const token = jwt.sign({ id: utilisateur._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, utilisateur });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

};

 

// Profil utilisateur

// exports.getProfilUtilisateur = async (req, res) => {

//     try {

//         const utilisateur = await Utilisateur.findById(req.utilisateur.id).select('-motDePasse');

//         res.status(200).json(utilisateur);

//     } catch (error) {

//         res.status(500).json({ message: error.message });

//     }

// };

 

exports.getUserInfo = async (req, res) => {

    try {

        // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête (par exemple)

        const userId = req.params.id;

 

        // Trouver l'utilisateur dans la base de données

        const user = await Utilisateur.findById(userId);  // Sélectionner uniquement nom, prenom, age

 

        if (!user) {

            return res.status(404).json({ message: 'Utilisateur non trouvé' });

        }

 

        // Retourner les informations de l'utilisateur

        res.json(user);

    } catch (error) {

        res.status(500).json({ message: 'Erreur du serveur', error: error.message });

    }

};

 

// Modifier les informations de l'utilisateur

exports.modifierUtilisateur = async (req, res) => {

    const userId = req.params.id;  // Récupérer l'ID de l'utilisateur à partir des paramètres

    const { nom, prenom, age, photo } = req.body;  // Récupérer les nouvelles informations de l'utilisateur

 

    try {

        // Vérifier si l'utilisateur existe

        const utilisateur = await Utilisateur.findById(userId);

        if (!utilisateur) {

            return res.status(404).json({ message: 'Utilisateur non trouvé' });

        }

 

        // Mettre à jour les informations de l'utilisateur

        if (nom) utilisateur.nom = nom;

        if (prenom) utilisateur.prenom = prenom;

        if (age) utilisateur.age = age;

        if (photo) utilisateur.photo = photo;  // Si une photo est fournie, on la met à jour

 

        // Sauvegarder les modifications

        await utilisateur.save();

 

        // Retourner une réponse de succès

        res.status(200).json({ message: 'Informations utilisateur mises à jour avec succès.' });

    } catch (error) {

        res.status(500).json({ message: 'Erreur du serveur', error: error.message });

    }

};

 

exports.addFavorite = async (req, res) => {

    try {

      // Assurez-vous que l'utilisateur est authentifié et que son ID est disponible

      const utilisateurId = req.user._id;  // Supposant que req.user vient d'un middleware d'authentification

      const { recetteId } = req.body;

 

      // Vérifier si la recette existe

      const recette = await Recette.findById(recetteId);

      if (!recette) {

        return res.status(404).send({ message: 'Recette non trouvée' });

      }

 

      // Trouver l'utilisateur dans la base de données

      const utilisateur = await Utilisateur.findById(utilisateurId);

      if (!utilisateur) {

        return res.status(404).send({ message: 'Utilisateur non trouvé' });

      }

 

      // Vérifier si la recette est déjà dans les favoris

      if (utilisateur.favorites.includes(recetteId)) {

        // La recette est déjà un favori, on peut la retirer

        utilisateur.favorites = utilisateur.favorites.filter(favId => !favId.equals(recetteId));

      } else {

        // La recette n'est pas encore un favori, on l'ajoute

        utilisateur.favorites.push(recetteId);

      }

 

      // Sauvegarder l'utilisateur avec la mise à jour des favoris

      await utilisateur.save();

 

      // Retourner la liste des favoris de l'utilisateur mise à jour

      res.status(200).send(utilisateur.favorites);

    } catch (error) {

      console.error(error);

      res.status(500).send({ message: 'Erreur lors de l\'ajout ou suppression de la recette des favoris' });

    }

  };