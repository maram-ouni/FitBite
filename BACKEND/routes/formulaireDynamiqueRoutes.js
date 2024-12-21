// const express = require('express');
// const { sauvegarderFormulaire } = require('../controllers/formulaireDynamiqueController');

// const router = express.Router();

// router.post('/sauvegarder', sauvegarderFormulaire);

// module.exports = router;
// routes/formulaireDynamiqueRoutes.js
// const express = require('express');
// const {
//   createFormulaire,
//   getFormulaires,
//   getFormulaireById,
//   updateFormulaire,
//   deleteFormulaire
// } = require('../controllers/formulaireDynamiqueController');

// const router = express.Router();

// router.post('/', createFormulaire); // Créer un formulaire dynamique
// router.get('/', getFormulaires); // Obtenir tous les formulaires dynamiques
// router.get('/:id', getFormulaireById); // Obtenir un formulaire dynamique par ID
// router.put('/:id', updateFormulaire); // Mettre à jour un formulaire dynamique
// router.delete('/:id', deleteFormulaire); // Supprimer un formulaire dynamique

// module.exports = router;

const express = require('express');
const router = express.Router();
const formulaireDynamiqueController = require('../controllers/formulaireDynamiqueController');

/**
 * @swagger
 * tags:
 *   name: FormulaireDynamique
 *   description: API pour gérer les formulaires dynamiques
 */

/**
 * @swagger
 * /api/formulaireDynamique:
 *   post:
 *     summary: Créer un nouveau formulaire dynamique
 *     tags: [FormulaireDynamique]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trimestre:
 *                 type: number
 *                 example: 2
 *               poidsActuel:
 *                 type: number
 *                 example: 75.5
 *               taille:
 *                 type: number
 *                 example: 170
 *               recommandations:
 *                 type: string
 *                 example: "Réduire le sel et boire plus d'eau"
 *               ActivitePhysique:
 *                 type: string
 *                 example: "Natation, course à pied"
 *               utilisateur:
 *                 type: string
 *                 example: "63a32a0a0e1f9a31bc2c7c57"
 *     responses:
 *       201:
 *         description: Formulaire créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post('/', formulaireDynamiqueController.createFormulaire);

/**
 * @swagger
 * /api/formulaireDynamique:
 *   get:
 *     summary: Obtenir tous les formulaires dynamiques
 *     tags: [FormulaireDynamique]
 *     responses:
 *       200:
 *         description: Liste des formulaires dynamiques
 *       500:
 *         description: Erreur serveur
 */
router.get('/', formulaireDynamiqueController.getFormulaires);

/**
 * @swagger
 * /api/formulaireDynamique/{id}:
 *   get:
 *     summary: Obtenir un formulaire dynamique par ID
 *     tags: [FormulaireDynamique]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du formulaire
 *     responses:
 *       200:
 *         description: Détails du formulaire
 *       404:
 *         description: Formulaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', formulaireDynamiqueController.getFormulaireById);

/**
 * @swagger
 * /api/formulaireDynamique/{id}:
 *   put:
 *     summary: Mettre à jour un formulaire dynamique
 *     tags: [FormulaireDynamique]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du formulaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trimestre:
 *                 type: number
 *                 example: 3
 *               poidsActuel:
 *                 type: number
 *                 example: 72
 *               taille:
 *                 type: number
 *                 example: 170
 *               recommandations:
 *                 type: string
 *                 example: "Réduire le sel et boire plus d'eau"
 *               ActivitePhysique:
 *                 type: string
 *                 example: "Natation, course à pied"
 *     responses:
 *       200:
 *         description: Formulaire mis à jour
 *       404:
 *         description: Formulaire non trouvé
 *       400:
 *         description: Erreur de validation
 */
router.put('/:id', formulaireDynamiqueController.updateFormulaire);

/**
 * @swagger
 * /api/formulaireDynamique/{id}:
 *   delete:
 *     summary: Supprimer un formulaire dynamique
 *     tags: [FormulaireDynamique]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du formulaire
 *     responses:
 *       200:
 *         description: Formulaire supprimé
 *       404:
 *         description: Formulaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', formulaireDynamiqueController.deleteFormulaire);

/**
 * @swagger
 * /api/formulaireDynamique/user/{userId}:
 *   get:
 *     summary: Obtenir le trimestre pour un utilisateur
 *     tags: [FormulaireDynamique]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Trimestre de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 trimestre:
 *                   type: string
 *                   example: '1er trimestre'
 *       404:
 *         description: Formulaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/user/:userId', formulaireDynamiqueController.getTrimestreByUser);



module.exports = router;




