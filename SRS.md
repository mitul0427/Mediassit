# Software Requirements Specification (SRS)
## Project: RateMyFlick (Movie Review System)

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the software requirements for "RateMyFlick," a web-based movie review and recommendation application. This document covers the functional and non-functional requirements, system architecture, and user interactions.

### 1.2 Scope
RateMyFlick is a full-stack web application that allows users to:
- Browse and search for movies (from a local database and TMDB).
- View detailed movie information (cast, crew, certification, similar movies).
- Register and log in to the system.
- Submit ratings and reviews for movies.
- Set personal preferences (favorite genres, directors, etc.).
- View a personalized "Like Meter" compatibility score for each movie.

## 2. Overall Description

### 2.1 Product Perspective
RateMyFlick is a standalone web application consisting of a React frontend and a Node.js/Express backend, using MongoDB for data storage. It integrates with the The Movie Database (TMDB) API for rich movie data.

### 2.2 User Characteristics
- **Guest Users**: Can browse and search for movies, view details, and read reviews.
- **Registered Users**: Can do everything guests can, plus submit reviews, set preferences, and view personalized Like Meter scores.

## 3. Functional Requirements

### 3.1 User Authentication
- **Registration**: Users can create an account with a username and password.
- **Login**: Users can authenticate using their credentials (JWT-based).
- **Logout**: Users can securely log out of the session.

### 3.2 Movie Management
- **Browse**: Display a list of movies on the home page.
- **Search**: Search for movies by title. Results include local database matches and TMDB results.
- **Details**: View comprehensive movie details:
    - Title, Description, Release Date, Language, Genre.
    - Poster Image (fetched from TMDB).
    - Cast and Crew lists.
    - Certification (e.g., U, UA, A).
    - Similar Movie recommendations.
- **Import**: Automatically import movie details from TMDB into the local database when a user views a movie not yet in the local DB.

### 3.3 Reviews and Ratings
- **View Reviews**: Display a list of reviews for each movie, showing username, rating (1-5 stars), comment, and date.
- **Submit Review**: Authenticated users can submit a review with a star rating and text comment.

### 3.4 User Preferences & Personalization
- **Preference Survey**: New users are prompted to select their favorite genres (e.g., Action, Drama, Sci-Fi).
- **Like Meter**: A visual indicator (0-100%) on the movie details page showing how well a movie matches the user's preferences.
    - **Logic**:
        - **Genre Match**: +30% if movie genre matches user favorites.
        - **Director Match**: +20% if director matches user favorites.
        - **Movie/Similar Match**: +20% if the movie or similar movies match user favorites.
        - **Base Score**: 30%.

## 4. Non-Functional Requirements

### 4.1 Performance
- The application should load the home page within 2 seconds.
- Search results should appear within 1 second.
- "Floating" UI animations should be smooth (60fps).

### 4.2 Security
- Passwords must be hashed (e.g., bcrypt) before storage.
- API endpoints for writing data (reviews, preferences) must be protected via JWT authentication.
- Input validation to prevent injection attacks.

### 4.3 Reliability
- The system should gracefully handle TMDB API failures (e.g., fallback to local data or placeholders).
- "Invalid Date" and other display errors should be handled gracefully.

### 4.4 User Interface
- **Theme**: "Warm & Floating" aesthetic with a confetti/popcorn background.
- **Responsiveness**: The layout should adapt to different screen sizes (desktop, tablet, mobile).
- **Visuals**: High-quality movie posters and glassmorphism effects on cards.

## 5. System Architecture

### 5.1 Technology Stack
- **Frontend**: React (Vite), CSS (Custom "Warm" Theme), Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **External API**: TMDB (The Movie Database) API.

### 5.2 Data Flow
1.  **Client** sends HTTP requests to **Server**.
2.  **Server** checks **Database** for requested data.
3.  If data (movie) is missing, **Server** fetches from **TMDB API**, saves to **Database**, and returns to **Client**.
4.  **Client** renders the UI.

## 6. Future Scope (Phase 2)
- **Rebranding**: Rename fully to "RateMyFlick".
- **Advanced Survey**: Multi-step wizard for detailed preferences (Indian vs Hollywood, specific actors/directors).
- **Social Features**: Follow other users, like reviews.
