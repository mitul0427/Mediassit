import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react';

import LikeMeter from '../components/LikeMeter';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [userPreferences, setUserPreferences] = useState(null);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [movieRes, reviewsRes] = await Promise.all([
                    axios.get(`/api/movies/${id}`),
                    axios.get(`/api/reviews/movie/${id}`)
                ]);
                setMovie(movieRes.data);
                setReviews(reviewsRes.data);

                if (user) {
                    const token = localStorage.getItem('token');
                    const prefRes = await axios.get('/api/preferences', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUserPreferences(prefRes.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/reviews', {
                movie: id,
                ...newReview
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh reviews
            const reviewsRes = await axios.get(`/api/reviews/movie/${id}`);
            setReviews(reviewsRes.data);
            setNewReview({ rating: 5, comment: '' });
        } catch (error) {
            alert('Failed to submit review');
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!movie) return <div className="container">Movie not found</div>;

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        style={{ width: '300px', height: '450px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '30px', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                            <h1 style={{ margin: 0 }}>{movie.title}</h1>
                            {movie.certification && (
                                <span style={{
                                    border: '1px solid var(--text-primary)',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                }}>
                                    {movie.certification}
                                </span>
                            )}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'} • {movie.language} • {movie.genre.join(', ')}
                        </p>

                        {/* Like Meter */}
                        {user && userPreferences && (
                            <div style={{ margin: '20px 0' }}>
                                <LikeMeter movie={movie} userPreferences={userPreferences} />
                            </div>
                        )}

                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>{movie.description}</p>

                        {/* Cast & Crew */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <h3>Cast</h3>
                                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                                    {movie.cast && movie.cast.slice(0, 5).map((actor, idx) => (
                                        <div key={idx} style={{ minWidth: '80px', textAlign: 'center' }}>
                                            <img
                                                src={actor.imageUrl || 'https://via.placeholder.com/80'}
                                                alt={actor.name}
                                                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '5px' }}
                                            />
                                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{actor.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{actor.role}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3>Crew</h3>
                                {movie.crew && movie.crew.slice(0, 3).map((member, idx) => (
                                    <div key={idx} style={{ marginBottom: '5px' }}>
                                        <strong>{member.name}</strong> <span style={{ color: 'var(--text-secondary)' }}>({member.job})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Movies */}
            {movie.similarMovies && movie.similarMovies.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                    <h2>You Might Also Like</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
                        {movie.similarMovies.map(sim => (
                            <div key={sim.tmdbId} className="card" style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/movie/tmdb-${sim.tmdbId}`}>
                                <img
                                    src={sim.posterUrl || 'https://via.placeholder.com/150x225'}
                                    alt={sim.title}
                                    style={{ width: '100%', height: '225px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '10px' }}>
                                    <h4 style={{ margin: '0', fontSize: '0.9rem' }}>{sim.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ marginTop: '40px', maxWidth: '800px' }}>
                <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
                    Reviews ({reviews.length})
                </h2>

                {user && (
                    <div className="card" style={{ padding: '20px', marginBottom: '40px' }}>
                        <h3>Write a Review</h3>
                        <form onSubmit={handleSubmitReview}>
                            <div className="input-group">
                                <label>Rating</label>
                                <select
                                    value={newReview.rating}
                                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                                    style={{ width: '100px', padding: '10px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '4px' }}
                                >
                                    {[5, 4, 3, 2, 1].map(num => (
                                        <option key={num} value={num}>{num} Stars</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Comment</label>
                                <textarea
                                    rows="4"
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit Review</button>
                        </form>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {reviews.map(review => (
                        <div key={review._id} className="card" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                    {review.user.username}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Star size={16} fill="gold" color="gold" />
                                    <span>{review.rating}/5</span>
                                </div>
                            </div>
                            <p style={{ margin: 0, color: '#ddd' }}>{review.comment}</p>
                            <small style={{ color: 'var(--text-secondary)', marginTop: '10px', display: 'block' }}>
                                {new Date(review.createdAt).toLocaleDateString()}
                            </small>
                        </div>
                    ))}
                </div>

                {/* TMDB Reviews */}
                {movie.externalReviews && movie.externalReviews.length > 0 && (
                    <div style={{ marginTop: '40px' }}>
                        <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
                            External Reviews (TMDB)
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {movie.externalReviews.map(review => (
                                <div key={review.id} className="card" style={{ padding: '20px', borderLeft: '4px solid var(--primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                            {review.author}
                                        </span>
                                        {review.rating && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Star size={16} fill="silver" color="silver" />
                                                <span>{review.rating}/10</span>
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}>
                                        {review.content}
                                    </p>
                                    <small style={{ color: 'var(--text-secondary)', marginTop: '10px', display: 'block' }}>
                                        {new Date(review.createdAt).toLocaleDateString()} • via TMDB
                                    </small>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;
