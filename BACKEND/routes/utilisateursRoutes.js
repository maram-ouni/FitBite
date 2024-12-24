// const express = require('express');

// const router = express.Router();

// const utilisateurController = require('../controllers/utilisateursController');

 

// router.post('/utilisateur', utilisateurController.createUtilisateur);

 

// module.exports = router;

const express = require('express');

const {

    inscrireUtilisateur,

    connecterUtilisateur,

    getProfilUtilisateur ,

    getUserInfo,

    modifierUtilisateur,

    addFavorite,

} = require('../controllers/utilisateursController');

const authMiddleware = require('../middlewares/authMiddleware');

 

const router = express.Router();

 

// // Routes publiques

// /**

//  * @swagger

//  * /api/auth/inscrire:

//  *   post:

//  *     summary: Inscription d'un utilisateur

//  *     description: Permet d'inscrire un utilisateur en fournissant un email et un mot de passe

//  *     requestBody:

//  *       required: true

//  *       content:

//  *         application/json:

//  *           schema:

//  *             type: object

//  *             properties:

//  *               email:

//  *                 type: string

//  *                 example: "exemple@gmail.com"

//  *               motDePasse:

//  *                 type: string

//  *                 example: "password123"

//  *     responses:

//  *       201:

//  *         description: Inscription réussie

//  *       400:

//  *         description: L'utilisateur existe déjà

//  *       500:

//  *         description: Erreur serveur

//  */

 

/**

 * @swagger

 * /api/auth/inscrire:

 *   post:

 *     summary: Inscription d'un utilisateur

 *     description: Permet d'inscrire un utilisateur en fournissant un email et un mot de passe.

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             properties:

 *               email:

 *                 type: string

 *                 example: "exemple@gmail.com"

 *               motDePasse:

 *                 type: string

 *                 example: "password123"

 *     responses:

 *       201:

 *         description: Inscription réussie

 *         content:

 *           application/json:

 *             schema:

 *               type: object

 *               properties:

 *                 message:

 *                   type: string

 *                   example: "Inscription réussie."

 *                 utilisateurId:

 *                   type: string

 *                   example: "603d2149e2c3f4f87c097d1b"

 *       400:

 *         description: L'utilisateur existe déjà

 *         content:

 *           application/json:

 *             schema:

 *               type: object

 *               properties:

 *                 message:

 *                   type: string

 *                   example: "Utilisateur déjà existant."

 *       500:

 *         description: Erreur serveur

 *         content:

 *           application/json:

 *             schema:

 *               type: object

 *               properties:

 *                 message:

 *                   type: string

 *                   example: "Erreur serveur: [message d'erreur spécifique]."

 */

router.post('/inscrire', inscrireUtilisateur);

 

/**

 * @swagger

 * /api/auth/connexion:

 *   post:

 *     summary: Connexion d'un utilisateur

 *     description: Permet de connecter un utilisateur avec son email et mot de passe

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             properties:

 *               email:

 *                 type: string

 *                 example: "exemple@gmail.com"

 *               motDePasse:

 *                 type: string

 *                 example: "password123"

 *     responses:

 *       200:

 *         description: Connexion réussie

 *       400:

 *         description: Mot de passe incorrect

 *       404:

 *         description: Utilisateur non trouvé

 *       500:

 *         description: Erreur serveur

 */

router.post('/connecter', connecterUtilisateur);






// Routes protégées

// router.get('/profil', authMiddleware, getProfilUtilisateur);

/**

 * @swagger

 * /api/utilisateurs/profile/{id}:

 *   get:

 *     summary: Récupérer les informations du profil de l'utilisateur

 *     tags: [Utilisateurs]

 *     description: Permet de récupérer les informations d'un utilisateur connecté, comme son nom, prénom, et âge

 *     parameters:

 *       - in: path

 *         name: id

 *         schema:

 *           type: string

 *         required: true

 *         description: ID de l'utilisateur

 *     responses:

 *       200:

 *         description: Informations du profil récupérées avec succès

 *         content:

 *           application/json:

 *             schema:

 *               type: object

 *               properties:

 *                 email:

 *                   type: string

 *                   example: "exemple@gmail.com"

 *                 nom:

 *                   type: string

 *                   example: "Dupont"

 *                 prenom:

 *                   type: string

 *                   example: "Jean"

 *                 age:

 *                   type: integer

 *                   example: 25

 *       401:

 *         description: Utilisateur non authentifié

 *       500:

 *         description: Erreur serveur

 */




router.get('/profile/:id', getUserInfo);

 

// // Routes protégées

// router.get('/profil', authMiddleware, getProfilUtilisateur);

 

/**

 * @swagger

 * /api/utilisateurs/{id}:

 *   put:

 *     summary: Modifier les informations d'un utilisateur

 *     description: Met à jour les informations d'un utilisateur existant (nom, prénom, âge, photo).

 *     tags:

 *       - Utilisateurs

 *     parameters:

 *       - name: id

 *         in: path

 *         required: true

 *         description: ID de l'utilisateur à mettre à jour

 *         schema:

 *           type: string

 *     requestBody:

 *       required: true

 *       content:

 *         application/json:

 *           schema:

 *             type: object

 *             properties:

 *               nom:

 *                 type: string

 *                 example: "Dupont"

 *               prenom:

 *                 type: string

 *                 example: "Jean"

 *               age:

 *                 type: integer

 *                 example: 30

 *               photo:

 *                 type: string

 *                 example: "base64string"

 *     responses:

 *       200:

 *         description: Informations utilisateur mises à jour avec succès.

 *       404:

 *         description: Utilisateur non trouvé.

 *       500:

 *         description: Erreur du serveur.

 */

router.put('/:id',modifierUtilisateur);

 

/**

* @swagger

* /api/utilisateur/favorites:

*   post:

*     summary: Ajouter une recette aux favoris de l'utilisateur

*     tags: [Utilisateur]

*     requestBody:

*       required: true

*       content:

*         application/json:

*           schema:

*             type: object

*             properties:

*               recetteId:

*                 type: string

*                 description: ID de la recette à ajouter aux favoris

*     responses:

*       200:

*         description: Recette ajoutée aux favoris avec succès

*       404:

*         description: Utilisateur ou recette non trouvé

*       500:

*         description: Erreur lors de l'ajout aux favoris

*/

router.post('/favorites', addFavorite);

 

module.exports = router;

