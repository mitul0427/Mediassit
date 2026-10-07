import React, { useState } from 'react';
import axios from 'axios';

const STEPS = [
    {
        id: 'genres',
        title: 'Favorite Genres',
        options: ["Action", "Adventure", "Comedy", "Crime", "Drama", "Sci-Fi", "Thriller", "Romance", "Horror", "Fantasy"]
    },
    {
        id: 'indianMovies',
        title: 'Top Indian Movies',
        options: ["Baahubali", "RRR", "Dangal", "KGF", "Pushpa", "Kantara", "3 Idiots", "Lagaan", "PK", "Drishyam"]
    },
    {
        id: 'hollywoodMovies',
        title: 'Top Hollywood Movies',
        options: ["Inception", "Avatar", "The Dark Knight", "Interstellar", "Avengers: Endgame", "Titanic", "The Godfather", "Pulp Fiction", "The Matrix", "Joker"]
    },
    {
        id: 'songs',
        title: 'Popular Songs (2015-2025)',
        options: ["Naatu Naatu", "Kesariya", "Believer", "Shape of You", "Despacito", "Blinding Lights", "Perfect", "Senorita", "Tum Hi Ho", "Jai Ho"]
    },
    {
        id: 'directors',
        title: 'Best Directors',
        options: ["S.S. Rajamouli", "Christopher Nolan", "Steven Spielberg", "Martin Scorsese", "Quentin Tarantino", "James Cameron", "Rajkumar Hirani", "Sukumar", "Prashanth Neel", "Mani Ratnam"]
    }
];

const PreferenceSurvey = ({ onClose, onSave }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [preferences, setPreferences] = useState({
        genres: [],
        indianMovies: [],
        hollywoodMovies: [],
        songs: [],
        directors: []
    });

    const step = STEPS[currentStep];
    const currentKey = step.id;

    const toggleOption = (option) => {
        const currentList = preferences[currentKey];
        if (currentList.includes(option)) {
            setPreferences({ ...preferences, [currentKey]: currentList.filter(i => i !== option) });
        } else {
            setPreferences({ ...preferences, [currentKey]: [...currentList, option] });
        }
    };

    const handleNext = async () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit
            try {
                const token = localStorage.getItem('token');
                await axios.post('/api/preferences', {
                    favoriteGenres: preferences.genres,
                    favoriteIndianMovies: preferences.indianMovies,
                    favoriteHollywoodMovies: preferences.hollywoodMovies,
                    favoriteSongs: preferences.songs,
                    favoriteDirectors: preferences.directors
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onSave(preferences.genres); // Pass back genres for immediate UI update if needed
                onClose();
            } catch (error) {
                console.error('Error saving preferences:', error);
            }
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="card" style={{ padding: '40px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Step {currentStep + 1} of {STEPS.length}</h2>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{step.title}</span>
                </div>

                <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Pick your favorites (Select at least 1)</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                    {step.options.map(option => (
                        <button
                            key={option}
                            onClick={() => toggleOption(option)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '25px',
                                border: '1px solid var(--primary)',
                                backgroundColor: preferences[currentKey].includes(option) ? 'var(--primary)' : 'transparent',
                                color: preferences[currentKey].includes(option) ? 'white' : 'var(--text-primary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.9rem'
                            }}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {currentStep > 0 ? (
                        <button onClick={() => setCurrentStep(currentStep - 1)} className="btn" style={{ backgroundColor: '#333', color: 'white' }}>Back</button>
                    ) : (
                        <div></div>
                    )}
                    <button
                        onClick={handleNext}
                        className="btn btn-primary"
                        disabled={preferences[currentKey].length === 0}
                        style={{ opacity: preferences[currentKey].length === 0 ? 0.5 : 1 }}
                    >
                        {currentStep === STEPS.length - 1 ? 'Finish & Save' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreferenceSurvey;
