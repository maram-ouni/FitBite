// Importations nécessaires
const express = require('express');
const {
  creerRecette,
  getRecettes,
  getRecetteParId,
  supprimerRecette,
  mettreAJourRecette,
  updateFavoriteStatus
} = require('../controllers/recettesController');
const router = express.Router();

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Recette:
//  *       type: object
//  *       required:
//  *         - nom
//  *         - tempsPreparation
//  *         - instructions
//  *       properties:
//  *         id:
//  *           type: string
//  *           description: ID unique de la recette
//  *         categorie:
//  *           type: string
//  *           description: Catégorie de la recette (facultatif)
//  *         image:
//  *           type: string
//  *           description: URL de l'image de la recette (facultatif)
//  *         nom:
//  *           type: string
//  *           description: Nom de la recette
//  *         description:
//  *           type: string
//  *           description: Description de la recette
//  *         tempsPreparation:
//  *           type: number
//  *           description: Temps de préparation en minutes
//  *         calories:
//  *           type: number
//  *           description: Nombre de calories (facultatif)
//  *         ingredients:
//  *           type: array
//  *           items:
//  *             type: object
//  *             properties:
//  *               ingredient:
//  *                 type: string
//  *                 description: ID de l'ingrédient (référence ObjectId)
//  *               unite: 
//  *                 type: string
//  *                 description: Unité de mesure de l'ingrédient (ex: g, ml, c. à soupe)          
//  * 
//  *                quantite:
//  *                 type: number
//  *                 description: Quantité de l'ingrédient
//  *            
//  *         instructions:
//  *           type: [string]
//  *           description: Instructions pour préparer la recette
//  *         favorite:
//  *            type: boolean
//  *            description: Si la recette est favorite
//  *         createdAt:
//  *           type: string
//  *           format: date-time
//  *           description: Date de création de la recette
//  *         updatedAt:
//  *           type: string
//  *           format: date-time
//  *           description: Date de dernière mise à jour de la recette
//  */

/**
* @swagger
* /api/recettes:
*   post:
*     summary: Créer une nouvelle recette
*     tags: [Recettes]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Recette'
*     responses:
*       201:
*         description: Recette créée avec succès
*       400:
*         description: Erreur lors de la création de la recette
*/
router.post('/', creerRecette);

/**
 * @swagger
 * /api/recettes:
 *   get:
 *     summary: Récupérer toutes les recettes
 *     tags: [Recettes]
 *     responses:
 *       200:
 *         description: Liste de toutes les recettes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recette'
 *       500:
 *         description: Erreur lors de la récupération des recettes
 */
router.get('/', getRecettes);

/**
 * @swagger
 * /api/recettes/{id}:
 *   get:
 *     summary: Récupérer une recette par ID
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la recette
 *     responses:
 *       200:
 *         description: Détails de la recette
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recette'
 *       404:
 *         description: Recette non trouvée
 */
router.get('/:id', getRecetteParId);

/**
 * @swagger
 * /api/recettes/{id}:
 *   delete:
 *     summary: Supprimer une recette
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'identifiant de la recette à supprimer
 *     responses:
 *       200:
 *         description: Recette supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recette supprimée avec succès
 *       404:
 *         description: Recette non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recette non trouvée
 *       500:
 *         description: Erreur lors de la suppression de la recette
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la suppression de la recette
 */
router.delete('/:id', supprimerRecette);

/**
 * @swagger
 * /api/recettes/{id}:
 *   put:
 *     summary: Mettre à jour une recette
 *     tags: [Recettes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la recette à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recette'
 *     responses:
 *       200:
 *         description: Recette mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recette'
 *       404:
 *         description: Recette non trouvée
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur lors de la mise à jour de la recette
 */
router.put('/:id', mettreAJourRecette);
module.exports = router;
