// public/js/api.js

// Base URLs
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const SUPABASE_URL = 'https://djnedeefklvtxzdeolrp.supabase.co'; // Replace with your Supabase URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqbmVkZWVma2x2dHh6ZGVvbHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MTczMDYsImV4cCI6MjA2MzE5MzMwNn0.HBfzInSjWLZnii8ALY_MaTVs-i9EHAvQEgJgGhsmfjU'; // Replace with your Supabase key
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your TMDB API key
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const supabaseClient = require('@supabase/supabase-js')
const supabase = supabaseClient.createClient (SUPABASE_URL, SUPABASE_KEY)

let a = supabase.from('movies').select();
print(a);
print("hello");

// API Endpoints
const API_ENDPOINTS = {
    popularMovies: `${TMDB_BASE_URL}/movie/popular`,
    trendingMovies: `${TMDB_BASE_URL}/trending/movie/week`,
    movieDetails: `${TMDB_BASE_URL}/movie`,
    searchMovies: `${TMDB_BASE_URL}/search/movie`,
    genres: `${TMDB_BASE_URL}/genre/movie/list`,
    discover: `${TMDB_BASE_URL}/discover/movie`,
    favorites: `${SUPABASE_URL}/rest/v1/favorites`,
    ratings: `${SUPABASE_URL}/rest/v1/ratings`,
    technologies: '/api/technologies', // Our custom API endpoint
    statistics: '/api/statistics', // Our custom API endpoint
};

// Fetch function with error handling
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Get popular movies
async function getPopularMovies(page = 1) {
    const url = `${API_ENDPOINTS.popularMovies}?api_key=${TMDB_API_KEY}&page=${page}`;
    return await fetchData(url);
}

// Get trending movies
async function getTrendingMovies() {
    const url = `${API_ENDPOINTS.trendingMovies}?api_key=${TMDB_API_KEY}`;
    return await fetchData(url);
}

// Get movie details
async function getMovieDetails(movieId) {
    const url = `${API_ENDPOINTS.movieDetails}/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,reviews`;
    return await fetchData(url);
}

// Search movies
async function searchMovies(query, page = 1) {
    const url = `${API_ENDPOINTS.searchMovies}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
    return await fetchData(url);
}

// Get movie genres
async function getGenres() {
    const url = `${API_ENDPOINTS.genres}?api_key=${TMDB_API_KEY}`;
    return await fetchData(url);
}

// Discover movies by filters
async function discoverMovies(options = {}) {
    const { page = 1, sortBy = 'popularity.desc', year = '', genreId = '' } = options;
    let url = `${API_ENDPOINTS.discover}?api_key=${TMDB_API_KEY}&page=${page}&sort_by=${sortBy}`;
    
    if (year) {
        url += `&primary_release_year=${year}`;
    }
    
    if (genreId) {
        url += `&with_genres=${genreId}`;
    }
    
    return await fetchData(url);
}

// Get movie poster URL
function getImageUrl(path, size = 'w500') {
    if (!path) return 'public/images/no-poster.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// Add movie to favorites (Supabase)
async function addToFavorites(movieData) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify(movieData)
    };
    
    return await fetchData(API_ENDPOINTS.favorites, options);
}

// Get user favorites (Supabase)
async function getFavorites() {
    const options = {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    };
    
    return await fetchData(API_ENDPOINTS.favorites, options);
}

// Rate a movie (Supabase)
async function rateMovie(ratingData) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify(ratingData)
    };
    
    return await fetchData(API_ENDPOINTS.ratings, options);
}

// Get technologies
async function getTechnologies() {
    return await fetchData(API_ENDPOINTS.technologies);
}

// Get movie statistics
async function getMovieStatistics() {
    return await fetchData(API_ENDPOINTS.statistics);
}

// Format date to readable format
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format runtime to hours and minutes
function formatRuntime(minutes) {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
}

// Export all functions
window.movieApi = {
    getPopularMovies,
    getTrendingMovies,
    getMovieDetails,
    searchMovies,
    getGenres,
    discoverMovies,
    getImageUrl,
    addToFavorites,
    getFavorites,
    rateMovie,
    getTechnologies,
    getMovieStatistics,
    formatDate,
    formatRuntime
};