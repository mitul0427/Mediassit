import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PreferenceSurvey from '../components/PreferenceSurvey';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSurvey, setShowSurvey] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/movies');
                setMovies(res.data);

                // Check preferences if logged in
                if (user) {
                    const token = localStorage.getItem('token');
                    const prefRes = await axios.get('/api/preferences', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (!prefRes.data.favoriteGenres || prefRes.data.favoriteGenres.length === 0) {
                        setShowSurvey(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setSearchResults(null);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(`/api/movies/search?query=${searchQuery}`);
            // Combine local and external results
            setSearchResults([...res.data.local, ...res.data.external]);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    const displayMovies = searchResults || movies;

    return (
        <div className="container">
            {showSurvey && <PreferenceSurvey onClose={() => setShowSurvey(false)} onSave={() => setShowSurvey(false)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '40px 0' }}>
                <h1 style={{ margin: 0 }}>{searchResults ? `Search Results for "${searchQuery}"` : 'Featured Movies'}</h1>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '300px' }}
                    />
                    <button type="submit" className="btn btn-primary">Search</button>
                    {searchResults && (
                        <button
                            type="button"
                            className="btn"
                            onClick={() => { setSearchResults(null); setSearchQuery(''); }}
                            style={{ backgroundColor: '#333', color: 'white' }}
                        >
                            Clear
                        </button>
                    )}
                </form>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '30px'
            }}>
                {displayMovies.map(movie => (
                    <Link to={`/movie/${movie._id}`} key={movie._id} className="card">
                        <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                        />
                        <div style={{ padding: '15px' }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>{movie.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                {new Date(movie.releaseDate).getFullYear()}
                            </p>
                            {movie.isExternal && (
                                <span style={{
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    marginTop: '5px',
                                    display: 'inline-block'
                                }}>
                                    TMDB
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
            {displayMovies.length === 0 && (
                <p style={{ textAlign: 'center', fontSize: '18px', color: 'var(--text-secondary)' }}>No movies found.</p>
            )}
        </div>
    );
};

export default Home;
