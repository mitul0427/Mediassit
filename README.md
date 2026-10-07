# RateMyFlick - Movie Review System

RateMyFlick is a full-stack web application for browsing movies, reading reviews, and getting personalized recommendations based on your favorite genres.

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (Local instance or Atlas URI)

## Project Structure

- `client/`: React frontend (Vite)
- `server/`: Node.js/Express backend

## Setup Instructions

### 1. Database Setup
Ensure your MongoDB instance is running. The default connection string is `mongodb://127.0.0.1:27017/movie-review-system`.

### 2. Backend Setup
1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory with the following content (adjust if needed):
    ```env
    MONGODB_URI=mongodb://127.0.0.1:27017/movie-review-system
    JWT_SECRET=your_jwt_secret_key_here
    TMDB_API_KEY=your_tmdb_api_key_here
    PORT=5000
    ```
4.  Seed the database with initial movies:
    ```bash
    node seed.js
    ```
5.  Start the server:
    ```bash
    node index.js
    ```
    The server will run on `http://localhost:5000`.

### 3. Frontend Setup
1.  Open a new terminal and navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or similar port).

## Features
- **Browse & Search**: Find movies from a local database or TMDB.
- **Movie Details**: View cast, crew, certification, and similar movies.
- **User Accounts**: Register and login to submit reviews.
- **Like Meter**: Get a personalized compatibility score for each movie based on your preferences.
- **Preference Survey**: Set your favorite genres to tune the recommendations.

## Documentation
See `SRS.md` for the Software Requirements Specification.
