const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    posterUrl: {
        type: String,
        default: 'https://via.placeholder.com/300x450?text=No+Poster'
    },
    language: {
        type: String,
        required: true
    },
    genre: [{
        type: String
    }],
    tmdbId: {
        type: String,
        unique: true,
        sparse: true
    },
    cast: [{
        name: String,
        role: String,
        imageUrl: String
    }],
    crew: [{
        name: String,
        job: String,
        imageUrl: String
    }],
    certification: String,
    similarMovies: [{
        tmdbId: String,
        title: String,
        posterUrl: String
    }]
});

module.exports = mongoose.model('Movie', movieSchema);

