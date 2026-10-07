const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Get reviews for a movie
router.get('/movie/:movieId', async (req, res) => {
    try {
        const reviews = await Review.find({ movie: req.params.movieId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.send(reviews);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add a review (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const review = new Review({
            ...req.body,
            user: req.user._id
        });
        await review.save();

        // Mock Payment Gateway / Message Queue Logic
        // In a real app, we might push this to a queue for processing or trigger a payment
        console.log('Review submitted. Mock processing...');

        res.status(201).send(review);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
