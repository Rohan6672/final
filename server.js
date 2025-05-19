// server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Supabase client

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/movies', (req, res) => {
    res.sendFile(path.join(__dirname, 'movies.html'));
});

// API Routes

// GET /api/technologies
app.get('/api/technologies', (req, res) => {
    // This is a mock API endpoint that would normally fetch from a database
    const technologies = [
        {
            name: 'HTML5',
            icon: '/public/images/icons/html5.svg'
        },
        {
            name: 'CSS3',
            icon: '/public/images/icons/css3.svg'
        },
        {
            name: 'JavaScript',
            icon: '/public/images/icons/javascript.svg'
        },
        {
            name: 'Node.js',
            icon: '/public/images/icons/nodejs.svg'
        },
        {
            name: 'Express',
            icon: '/public/images/icons/express.svg'
        },
        {
            name: 'Supabase',
            icon: '/public/images/icons/supabase.svg'
        },
        {
            name: 'Chart.js',
            icon: '/public/images/icons/chartjs.svg'
        },
        {
            name: 'Swiper',
            icon: '/public/images/icons/swiper.svg'
        }
    ];
    
    res.json(technologies);
});

// GET /api/statistics
app.get('/api/statistics', (req, res) => {
    // This is a mock API endpoint that would normally fetch from a database
    const statistics = {
        genres: [
            { name: 'Action', average_rating: 7.2 },
            { name: 'Adventure', average_rating: 7.5 },
            { name: 'Animation', average_rating: 7.8 },
            { name: 'Comedy', average_rating: 6.9 },
            { name: 'Crime', average_rating: 7.4 },
            { name: 'Documentary', average_rating: 8.1 },
            { name: 'Drama', average_rating: 7.6 },
            { name: 'Family', average_rating: 7.0 },
            { name: 'Fantasy', average_rating: 7.3 },
            { name: 'Horror', average_rating: 6.5 }
        ]
    };
    
    res.json(statistics);
});

// GET /api/favorites
app.get('/api/favorites', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .order('date_added', { ascending: false });
        
        if (error) throw error;
        
        res.json(data);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

// POST /api/favorites
app.post('/api/favorites', async (req, res) => {
    try {
        const { movie_id, title, poster_path } = req.body;
        
        // Validate required fields
        if (!movie_id || !title) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Insert into Supabase
        const { data, error } = await supabase
            .from('favorites')
            .insert([
                {
                    movie_id,
                    title,
                    poster_path,
                    date_added: new Date()
                }
            ])
            .select();
        
        if (error) throw error;
        
        res.status(201).json({
            success: true,
            message: 'Movie added to favorites',
            id: data[0].id
        });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Failed to add movie to favorites' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const SUPABASE_URL = 'https://djnedeefklvtxzdeolrp.supabase.co'; // Replace with your Supabase URL
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqbmVkZWVma2x2dHh6ZGVvbHJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MTczMDYsImV4cCI6MjA2MzE5MzMwNn0.HBfzInSjWLZnii8ALY_MaTVs-i9EHAvQEgJgGhsmfjU'; // Replace with your Supabase key
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your TMDB API key
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const supabaseClient = require('@supabase/supabase-js')
const supabase = supabaseClient.createClient (SUPABASE_URL, SUPABASE_KEY)
supabase
  .from('movies')
  .select('*')
  .then(({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(data);
  });