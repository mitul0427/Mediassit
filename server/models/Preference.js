const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    favoriteGenres: [{
        type: String
    }],
    favoriteIndianMovies: [{
        type: String
    }],
    favoriteHollywoodMovies: [{
        type: String
    }],
    favoriteSongs: [{
        type: String
    }],
    favoriteDirectors: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Preference', preferenceSchema);
