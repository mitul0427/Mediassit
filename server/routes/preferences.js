const express = require('express');
const router = express.Router();
const Preference = require('../models/Preference');
const auth = require('../middleware/auth');

// Get user preferences
router.get('/', auth, async (req, res) => {
    try {
        const pref = await Preference.findOne({ user: req.user._id });
        res.send(pref || { favoriteGenres: [] });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Save user preferences
router.post('/', auth, async (req, res) => {
    try {
        let pref = await Preference.findOne({ user: req.user._id });

        if (pref) {
            pref.favoriteGenres = req.body.favoriteGenres;
            pref.favoriteIndianMovies = req.body.favoriteIndianMovies;
            pref.favoriteHollywoodMovies = req.body.favoriteHollywoodMovies;
            pref.favoriteSongs = req.body.favoriteSongs;
            pref.favoriteDirectors = req.body.favoriteDirectors;
            await pref.save();
        } else {
            pref = new Preference({
                user: req.user._id,
                favoriteGenres: req.body.favoriteGenres,
                favoriteIndianMovies: req.body.favoriteIndianMovies,
                favoriteHollywoodMovies: req.body.favoriteHollywoodMovies,
                favoriteSongs: req.body.favoriteSongs,
                favoriteDirectors: req.body.favoriteDirectors
            });
            await pref.save();
        }

        res.status(200).send(pref);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
