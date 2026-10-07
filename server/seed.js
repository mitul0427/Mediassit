const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const Review = require('./models/Review');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

// Movies data with language field
const movies = [
    // English movies
    {
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        releaseDate: new Date("2010-07-16"),
        posterUrl: "https://image.tmdb.org/t/p/w500/9gk7admalsqW66PAbbExL0wUy8d.jpg",
        genre: ["Action", "Sci-Fi", "Thriller"],
        language: "English"
    },
    {
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        releaseDate: new Date("2008-07-18"),
        posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        genre: ["Action", "Crime", "Drama"],
        language: "English"
    },
    {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        releaseDate: new Date("2014-11-07"),
        posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniL6C8zEfVbS9fCl7nhdQI.jpg",
        genre: ["Adventure", "Drama", "Sci-Fi"],
        language: "English"
    },
    {
        title: "Pulp Fiction",
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        releaseDate: new Date("1994-10-14"),
        posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        genre: ["Crime", "Drama"],
        language: "English"
    },
    {
        title: "The Matrix",
        description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        releaseDate: new Date("1999-03-31"),
        posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpQUk5H.jpg",
        genre: ["Action", "Sci-Fi"],
        language: "English"
    },
    // Indian language movies
    {
        title: "3 Idiots",
        description: "Two friends embark on a journey to find their long lost friend, learning about life and the pressures of the Indian education system.",
        releaseDate: new Date("2009-12-25"),
        posterUrl: "https://via.placeholder.com/300x450?text=3+Idiots",
        genre: ["Comedy", "Drama"],
        language: "Hindi"
    },
    {
        title: "Baahubali: The Beginning",
        description: "An epic tale of a man who discovers his royal lineage and fights for his kingdom.",
        releaseDate: new Date("2015-07-10"),
        posterUrl: "https://via.placeholder.com/300x450?text=Baahubali+1",
        genre: ["Action", "Adventure", "Drama"],
        language: "Telugu"
    },
    {
        title: "K.G.F: Chapter 1",
        description: "A story about a young man's rise from the streets of Mumbai to become a notorious gangster in the Kolar Gold Fields.",
        releaseDate: new Date("2018-12-21"),
        posterUrl: "https://via.placeholder.com/300x450?text=KGF+1",
        genre: ["Action", "Drama"],
        language: "Kannada"
    },
    {
        title: "Dangal",
        description: "Former wrestler Mahavir Singh Phogat trains his daughters to become world‑class wrestlers.",
        releaseDate: new Date("2016-12-23"),
        posterUrl: "https://via.placeholder.com/300x450?text=Dangal",
        genre: ["Biography", "Drama", "Sport"],
        language: "Hindi"
    },
    {
        title: "RRR",
        description: "Two Indian revolutionaries fight against British colonial rule and a ruthless ruler.",
        releaseDate: new Date("2022-03-25"),
        posterUrl: "https://via.placeholder.com/300x450?text=RRR",
        genre: ["Action", "Drama", "Historical"],
        language: "Telugu"
    }
];

// External reviews (mocked)
const externalReviews = [
    // Inception
    { movieTitle: "Inception", username: "IMDb_Critic", rating: 5, comment: "A mind-bending masterpiece that demands your full attention." },
    { movieTitle: "Inception", username: "RottenTomatoes_Top", rating: 4, comment: "Smart, innovative, and thrilling. Nolan at his best." },
    { movieTitle: "Inception", username: "RogerEbert.com", rating: 4, comment: "The film's structure is a devilishly complex puzzle." },

    // The Dark Knight
    { movieTitle: "The Dark Knight", username: "EmpireMagazine", rating: 5, comment: "Heath Ledger's Joker is iconic. The best superhero movie ever made." },
    { movieTitle: "The Dark Knight", username: "IGN_Movies", rating: 5, comment: "Dark, complex, and unforgettable." },

    // Interstellar
    { movieTitle: "Interstellar", username: "SciFiZone", rating: 4, comment: "Visually stunning but emotionally heavy. A space opera for the ages." },
    { movieTitle: "Interstellar", username: "Space.com", rating: 5, comment: "A beautiful scientific journey." },

    // Pulp Fiction
    { movieTitle: "Pulp Fiction", username: "RollingStone", rating: 5, comment: "Tarantino's dialogue is unmatched. A cult classic." },

    // The Matrix
    { movieTitle: "The Matrix", username: "Wired", rating: 5, comment: "Changed the way we look at sci-fi action forever." },

    // 3 Idiots
    { movieTitle: "3 Idiots", username: "TimesOfIndia", rating: 4, comment: "A hilarious yet thought-provoking take on the education system." },
    { movieTitle: "3 Idiots", username: "BollywoodHungama", rating: 5, comment: "A must-watch entertainer with a strong message." },
    { movieTitle: "3 Idiots", username: "NDTV_Movies", rating: 4, comment: "Aamir Khan shines in this heartwarming comedy." },

    // Baahubali: The Beginning
    { movieTitle: "Baahubali: The Beginning", username: "TheHindu", rating: 4, comment: "Grand, epic, and visually spectacular. A landmark in Indian cinema." },
    { movieTitle: "Baahubali: The Beginning", username: "GreatAndhra", rating: 4, comment: "Rajamouli's vision is breathtaking." },
    { movieTitle: "Baahubali: The Beginning", username: "123Telugu", rating: 4, comment: "A visual feast that keeps you hooked." },

    // K.G.F: Chapter 1
    { movieTitle: "K.G.F: Chapter 1", username: "DeccanHerald", rating: 3, comment: "High on style and action, Yash delivers a power-packed performance." },
    { movieTitle: "K.G.F: Chapter 1", username: "BangaloreMirror", rating: 4, comment: "A gritty, raw, and intense gangster drama." },

    // Dangal
    { movieTitle: "Dangal", username: "FilmCompanion", rating: 5, comment: "An inspiring sports biopic that hits all the right notes." },
    { movieTitle: "Dangal", username: "Rediff", rating: 4, comment: "Aamir Khan transforms himself completely. Powerful storytelling." },

    // RRR
    { movieTitle: "RRR", username: "Variety", rating: 4, comment: "A roar of a film. Action-packed and emotionally charged." },
    { movieTitle: "RRR", username: "HindustanTimes", rating: 5, comment: "Rajamouli does it again. A cinematic spectacle that demands the big screen." },
    { movieTitle: "RRR", username: "Koimoi", rating: 4, comment: "Ram Charan and Jr NTR set the screen on fire." }
];

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('Connected to MongoDB');
        // Clear existing data
        await Movie.deleteMany({});
        await Review.deleteMany({});
        await User.deleteMany({ email: 'bot@external.com' });
        console.log('Cleared existing data');
        // Create Bot User for external reviews
        const hashedPassword = await bcrypt.hash('botpassword', 8);
        const botUser = new User({
            username: 'External_Sources',
            email: 'bot@external.com',
            password: hashedPassword
        });
        await botUser.save();

        // Fetch valid posters and details from TMDB
        const tmdbService = require('./services/tmdb');
        console.log('Fetching full movie details from TMDB...');

        const moviesWithDetails = [];
        for (const movie of movies) {
            try {
                const results = await tmdbService.searchMovies(movie.title);
                if (results && results.length > 0) {
                    // Find exact match or use first result
                    const match = results.find(m => m.title === movie.title) || results[0];

                    // Fetch FULL details including cast, crew, etc.
                    const fullDetails = await tmdbService.getMovieDetails(match.id);
                    if (fullDetails) {
                        const mappedMovie = tmdbService.mapTmdbToMovie(fullDetails);
                        moviesWithDetails.push(mappedMovie);
                        console.log(`Processed: ${movie.title}`);
                    } else {
                        moviesWithDetails.push(movie);
                    }
                } else {
                    moviesWithDetails.push(movie);
                }
            } catch (e) {
                console.error(`Could not fetch details for ${movie.title}:`, e.message);
                moviesWithDetails.push(movie);
            }
        }

        // Insert Movies
        const createdMovies = await Movie.insertMany(moviesWithDetails);
        console.log('Added movies with full details');

        // Insert External Reviews
        const reviewsToInsert = [];
        for (const extReview of externalReviews) {
            const movie = createdMovies.find(m => m.title === extReview.movieTitle);
            if (movie) {
                reviewsToInsert.push({
                    movie: movie._id,
                    user: botUser._id,
                    rating: extReview.rating,
                    comment: `[${extReview.username}] ${extReview.comment}`
                });
            }
        }
        await Review.insertMany(reviewsToInsert);
        console.log('Added external reviews');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error seeding database:', err);
        mongoose.connection.close();
    });
