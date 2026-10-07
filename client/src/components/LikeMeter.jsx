import React from 'react';

const LikeMeter = ({ movie, userPreferences }) => {
    if (!userPreferences || !movie) return null;

    // Scoring Logic
    let score = 30; // Base score

    // 1. Genre Match (30%)
    const hasGenreMatch = movie.genre?.some(g => userPreferences.favoriteGenres.some(fg => fg.toLowerCase() === g.toLowerCase()));
    if (hasGenreMatch) score += 30;

    // 2. Director Match (20%)
    // Check if any crew member with job 'Director' is in favoriteDirectors
    const director = movie.crew?.find(c => c.job === 'Director')?.name;
    const hasDirectorMatch = director && userPreferences.favoriteDirectors?.some(d => d.toLowerCase() === director.toLowerCase());
    if (hasDirectorMatch) score += 20;

    // 3. Movie Match (20%)
    // Check if the movie title itself is in favorites (Indian or Hollywood)
    const allFavMovies = [...(userPreferences.favoriteIndianMovies || []), ...(userPreferences.favoriteHollywoodMovies || [])];
    const hasMovieMatch = allFavMovies.some(m => m.toLowerCase() === movie.title.toLowerCase());

    // OR if similar movies match favorites
    const hasSimilarMatch = movie.similarMovies?.some(sim => allFavMovies.some(fav => fav.toLowerCase() === sim.title.toLowerCase()));

    if (hasMovieMatch || hasSimilarMatch) score += 20;

    // Cap at 100
    if (score > 100) score = 100;

    let color = 'red';
    if (score >= 80) color = '#46d369'; // Green
    else if (score >= 50) color = 'orange';

    return (
        <div className="card" style={{ padding: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(255,255,255,0.05)' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#444"
                        strokeWidth="4"
                    />
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={color}
                        strokeWidth="4"
                        strokeDasharray={`${score}, 100`}
                    />
                </svg>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    fontSize: '1.2rem', fontWeight: 'bold', color: 'white'
                }}>
                    {score}%
                </div>
            </div>

            <div>
                <h3 style={{ margin: '0 0 5px 0', color: 'var(--primary)' }}>Like Meter</h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {hasDirectorMatch && <div style={{ color: '#46d369' }}>✓ Director Match ({director})</div>}
                    {hasGenreMatch && <div style={{ color: '#46d369' }}>✓ Genre Match</div>}
                    {(hasMovieMatch || hasSimilarMatch) && <div style={{ color: '#46d369' }}>✓ Movie Vibe Match</div>}
                    {!hasDirectorMatch && !hasGenreMatch && !hasMovieMatch && !hasSimilarMatch &&
                        <div>Based on general popularity</div>
                    }
                </div>
            </div>
        </div>
    );
};

export default LikeMeter;
