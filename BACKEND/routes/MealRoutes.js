const express = require('express');
const router = express.Router();
const MealController = require('../controllers/MealController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Meal:
 *       type: object
 *       required:
 *         - mealType
 *         - userId
 *         - items
 *       properties:
 *         mealType:
 *           type: string
 *           enum: ["Breakfast", "Lunch", "Dinner", "Snack"]
 *           description: The type of meal
 *         userId:
 *           type: string
 *           description: The ID of the user
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *                 description: The ID of the item
 *               name:
 *                 type: string
 *                 description: The name of the item
 *               count:
 *                 type: number
 *                 description: The count of the item
 *               calories:
 *                 type: number
 *                 description: The calories of the item
 *         totalCalories:
 *           type: number
 *           description: The total calories of the meal
 */

/**
 * @swagger
 * /api/meals:
 *   post:
 *     summary: Create a new meal
 *     tags: [Meals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meal'
 *     responses:
 *       201:
 *         description: The meal was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 *       500:
 *         description: Some server error
 */
router.post('/meals', MealController.createMeal);

/**
 * @swagger
 * /api/meals/user/{userId}:
 *   get:
 *     summary: Get all meals for a user
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: The list of the meals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meal'
 *       500:
 *         description: Some server error
 */
router.get('/meals/user/:userId', MealController.getMealsByUser);

/**
 * @swagger
 * /api/meals/{id}:
 *   get:
 *     summary: Get a single meal
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the meal
 *     responses:
 *       200:
 *         description: The meal description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 *       404:
 *         description: The meal was not found
 *       500:
 *         description: Some server error
 */
router.get('/meals/:id', MealController.getMealById);

/**
 * @swagger
 * /api/meals/{id}/items:
 *   patch:
 *     summary: Update meal items
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the meal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     count:
 *                       type: number
 *                     calories:
 *                       type: number
 *     responses:
 *       200:
 *         description: The meal was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 *       404:
 *         description: The meal was not found
 *       500:
 *         description: Some server error
 */
router.patch('/meals/:id/items', MealController.updateMealItems);

/**
 * @swagger
 * /api/meals/{id}:
 *   delete:
 *     summary: Delete a meal
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the meal
 *     responses:
 *       200:
 *         description: The meal was deleted
 *       404:
 *         description: The meal was not found
 *       500:
 *         description: Some server error
 */
router.delete('/meals/:id', MealController.deleteMeal);

module.exports = router;