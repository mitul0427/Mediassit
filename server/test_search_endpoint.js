const axios = require('axios');

const testSearch = async () => {
    try {
        console.log('Testing search endpoint...');
        // Assuming server is running on localhost:5000
        const res = await axios.get('http://localhost:5000/api/movies/search?query=Avatar');
        console.log('Status:', res.status);
        console.log('Local Results:', res.data.local.length);
        console.log('External Results:', res.data.external.length);
        if (res.data.external.length > 0) {
            console.log('First External:', res.data.external[0].title);
        }
    } catch (error) {
        console.error('Search failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
};

testSearch();
