const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const axios = require('axios');

dotenv.config();

const verifyPosters = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        const movies = await Movie.find({});
        console.log(`Found ${movies.length} movies.`);

        for (const movie of movies) {
            console.log(`Checking poster for: ${movie.title}`);
            console.log(`URL: ${movie.posterUrl}`);
            try {
                const res = await axios.head(movie.posterUrl);
                console.log(`Status: ${res.status} OK`);
            } catch (error) {
                console.error(`FAILED: ${error.message}`);
            }
            console.log('---');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
    }
};

verifyPosters();
