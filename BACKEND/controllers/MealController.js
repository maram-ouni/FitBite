const Meal = require('../models/Meal');

const MealController = {
    // Create a new meal
    createMeal: async (req, res) => {
        try {
            const { mealType, userId, items } = req.body;

            // Calculate total calories based on count (matches frontend)
            const totalCalories = items.reduce((sum, item) => sum + (item.calories * item.count), 0);

            console.log('Creating meal with data:', { mealType, userId, items, totalCalories });

            const meal = new Meal({
                mealType,
                userId,
                items,
                totalCalories
            });

            const savedMeal = await meal.save();
            console.log('Meal saved:', savedMeal);
            res.status(201).json(savedMeal);
        } catch (error) {
            console.error('Error creating meal:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Get all meals for a user
    getMealsByUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const meals = await Meal.find({ userId });
            res.status(200).json(meals);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get a single meal
    getMealById: async (req, res) => {
        try {
            const meal = await Meal.findById(req.params.id);
            if (!meal) {
                return res.status(404).json({ message: 'Meal not found' });
            }
            res.status(200).json(meal);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update meal items
    updateMealItems: async (req, res) => {
        try {
            const { items } = req.body;
            const meal = await Meal.findById(req.params.id);

            if (!meal) {
                return res.status(404).json({ message: 'Meal not found' });
            }

            // Merge the existing and new items, ensuring the counts are updated
            const updatedItems = [...meal.items];

            items.forEach(newItem => {
                const existingItemIndex = updatedItems.findIndex(item =>
                    item.itemId === newItem.itemId
                );

                if (existingItemIndex !== -1) {
                    // Update existing item
                    updatedItems[existingItemIndex] = {
                        ...updatedItems[existingItemIndex],
                        count: newItem.count,
                        calories: newItem.calories
                    };
                } else {
                    // Add new item
                    updatedItems.push(newItem);
                }
            });

            meal.items = updatedItems;

            // Recalculate total calories
            meal.totalCalories = updatedItems.reduce((sum, item) =>
                sum + (item.calories), 0
            );

            const updatedMeal = await meal.save();
            console.log('Meal updated:', updatedMeal);
            res.status(200).json(updatedMeal);
        } catch (error) {
            console.error('Error updating meal:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Delete a meal
    deleteMeal: async (req, res) => {
        try {
            const meal = await Meal.findByIdAndDelete(req.params.id);
            if (!meal) {
                return res.status(404).json({ message: 'Meal not found' });
            }
            res.status(200).json({ message: 'Meal deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = MealController;