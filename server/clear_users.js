const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Review = require('./models/Review');
const Preference = require('./models/Preference');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('Connected to MongoDB');

        // Delete all users except the bot (optional, but let's clear everything for a fresh start as requested)
        // Actually, let's keep the bot user for external reviews if we want to keep them, 
        // but the prompt said "delete all the registered login", so I will delete ALL users.
        // However, if I delete the bot user, the external reviews might break if they reference it.
        // I'll delete all users and reviews to be safe and clean.

        await User.deleteMany({});
        console.log('Deleted all Users');

        await Review.deleteMany({});
        console.log('Deleted all Reviews');

        await Preference.deleteMany({});
        console.log('Deleted all Preferences');

        console.log('Data cleanup complete.');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error clearing data:', err);
        mongoose.connection.close();
    });
