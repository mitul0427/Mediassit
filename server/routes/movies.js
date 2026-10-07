const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const auth = require('../middleware/auth');
const tmdbService = require('../services/tmdb');

// Search movies (Local + TMDB)
router.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).send({ error: 'Query is required' });

    try {
        // 1. Search Local DB
        const localMovies = await Movie.find({
            title: { $regex: query, $options: 'i' }
        });

        // 2. Search TMDB
        const tmdbResults = await tmdbService.searchMovies(query);

        // 3. Map TMDB results to our format (marking them as 'external')
        const externalMovies = tmdbResults.map(m => ({
            ...tmdbService.mapTmdbToMovie(m),
            _id: `tmdb-${m.id}`, // Temporary ID for frontend
            isExternal: true
        }));

        // 4. Combine (Local takes precedence if we want to dedupe, but for now show both or filter)
        res.send({ local: localMovies, external: externalMovies });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.send(movies);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get single movie (Handle MongoDB ID or TMDB ID import)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if it's a TMDB ID request (prefixed with 'tmdb-')
        if (id.startsWith('tmdb-')) {
            const tmdbId = id.split('-')[1];

            // Check if we already imported it
            let movie = await Movie.findOne({ tmdbId: tmdbId });
            if (movie) return res.send(movie);

            // If not, fetch details from TMDB and save it
            const tmdbData = await tmdbService.getMovieDetails(tmdbId);
            if (!tmdbData) return res.status(404).send({ error: 'Movie not found on TMDB' });

            const newMovieData = tmdbService.mapTmdbToMovie(tmdbData);
            // Map genres if available
            if (tmdbData.genres) {
                newMovieData.genre = tmdbData.genres.map(g => g.name);
            }

            movie = new Movie(newMovieData);
            await movie.save();

            // Fetch reviews for new movie
            const externalReviews = await tmdbService.getMovieReviews(tmdbId);
            const movieObj = movie.toObject();
            movieObj.externalReviews = externalReviews;
            return res.send(movieObj);
        }

        // Normal MongoDB ID
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).send();
        }

        const movieObj = movie.toObject();
        if (movie.tmdbId) {
            const externalReviews = await tmdbService.getMovieReviews(movie.tmdbId);
            movieObj.externalReviews = externalReviews;
        }
        res.send(movieObj);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Create movie (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).send(movie);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
