const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
    mealType: { type: String, enum: ["Breakfast", "Lunch", "Dinner", "Snack"], required: true },
    userId: { type: String, required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
            name: { type: String, required: true },
            count: { type: Number, required: true },
            calories: { type: Number, required: true },
        },
    ],
    totalCalories: { type: Number, default: 0 },
});

module.exports = mongoose.model("Meal", mealSchema);
