const tmdbService = require('./services/tmdb');

const test = async () => {
    console.log('Searching for "Avatar"...');
    const results = await tmdbService.searchMovies('Avatar');
    console.log(`Found ${results.length} results.`);
    if (results.length > 0) {
        console.log('First result:', results[0].title);
        console.log('Fetching details for ID:', results[0].id);
        const details = await tmdbService.getMovieDetails(results[0].id);
        console.log('Details fetched:', details.title);
    }
};

test();
