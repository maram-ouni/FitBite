const cron = require('node-cron');
const Meal = require('./models/Meal');

// Schedule a task to run at 00:00 every day
cron.schedule('0 0 * * *', async () => {
    try {
        await Meal.deleteMany({});
        console.log('All meal instances have been deleted');
    } catch (error) {
        console.error('Error deleting meal instances:', error);
    }
});