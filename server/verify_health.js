const axios = require('axios');

const checkHealth = async () => {
    try {
        console.log('Checking Server Health...');
        const response = await axios.get('http://localhost:5000/api/movies');
        if (response.status === 200) {
            console.log('Server is RUNNING.');
            console.log(`Movies found: ${response.data.length}`);
            if (response.data.length > 0) {
                const movie = response.data[0];
                console.log('Sample Movie:', movie.title);
                console.log('Cast:', movie.cast ? movie.cast.length : 0);
                console.log('Crew:', movie.crew ? movie.crew.length : 0);
                console.log('Similar:', movie.similarMovies ? movie.similarMovies.length : 0);
            }
        } else {
            console.log('Server returned status:', response.status);
        }
    } catch (error) {
        console.error('Server is NOT running or unreachable:', error.message);
    }
};

checkHealth();
