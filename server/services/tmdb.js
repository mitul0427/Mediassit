require('dotenv').config();
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const searchMovies = async (query) => {
    try {
        console.log(`Searching TMDB for: ${query}`);
        const response = await axios.get(`${BASE_URL}/search/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                query: query,
                language: 'en-US',
                page: 1,
                include_adult: false
            }
        });
        console.log(`TMDB Response Results: ${response.data.results.length}`);
        return response.data.results;
    } catch (error) {
        console.error('Error searching TMDB:', error.message);
        if (error.response) console.error('TMDB Error Data:', error.response.data);
        return [];
    }
};

const getMovieDetails = async (tmdbId) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${tmdbId}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
                append_to_response: 'credits,release_dates,similar'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching TMDB details:', error.message);
        return null;
    }
};

const getMovieReviews = async (tmdbId) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${tmdbId}/reviews`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
                page: 1
            }
        });
        return response.data.results.map(review => ({
            id: review.id,
            author: review.author,
            content: review.content,
            rating: review.author_details.rating,
            createdAt: review.created_at,
            source: 'TMDB'
        }));
    } catch (error) {
        console.error('Error fetching TMDB reviews:', error.message);
        return [];
    }
};

// Helper to map TMDB format to our Movie model format
const mapTmdbToMovie = (tmdbMovie) => {
    // Extract Certification (prefer IN, then US)
    let certification = 'U'; // Default
    if (tmdbMovie.release_dates && tmdbMovie.release_dates.results) {
        const inRelease = tmdbMovie.release_dates.results.find(r => r.iso_3166_1 === 'IN');
        const usRelease = tmdbMovie.release_dates.results.find(r => r.iso_3166_1 === 'US');
        const release = inRelease || usRelease;
        if (release && release.release_dates.length > 0) {
            certification = release.release_dates[0].certification || 'U';
        }
    }

    // Extract Cast (Top 10)
    const cast = tmdbMovie.credits ? tmdbMovie.credits.cast.slice(0, 10).map(c => ({
        name: c.name,
        role: c.character,
        imageUrl: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null
    })) : [];

    // Extract Crew (Director, Writer)
    const crew = tmdbMovie.credits ? tmdbMovie.credits.crew
        .filter(c => c.job === 'Director' || c.job === 'Writer' || c.job === 'Screenplay' || c.job === 'Music')
        .slice(0, 5)
        .map(c => ({
            name: c.name,
            job: c.job,
            imageUrl: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null
        })) : [];

    // Extract Similar Movies (Top 5)
    const similarMovies = tmdbMovie.similar ? tmdbMovie.similar.results.slice(0, 5).map(m => ({
        tmdbId: m.id.toString(),
        title: m.title,
        posterUrl: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : null
    })) : [];

    return {
        title: tmdbMovie.title,
        description: tmdbMovie.overview,
        releaseDate: tmdbMovie.release_date ? new Date(tmdbMovie.release_date) : new Date(),
        posterUrl: tmdbMovie.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
            : 'https://via.placeholder.com/300x450?text=No+Poster',
        language: tmdbMovie.original_language === 'en' ? 'English' : tmdbMovie.original_language,
        genre: tmdbMovie.genres ? tmdbMovie.genres.map(g => g.name) : [],
        tmdbId: tmdbMovie.id.toString(),
        certification,
        cast,
        crew,
        similarMovies
    };
};

module.exports = {
    searchMovies,
    getMovieDetails,
    getMovieReviews,
    mapTmdbToMovie
};
