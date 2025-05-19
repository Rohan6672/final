// public/js/movies.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const genreFilter = document.getElementById('genre-filter');
    const yearFilter = document.getElementById('year-filter');
    const sortBy = document.getElementById('sort-by');
    const moviesContainer = document.getElementById('movies-container');
    const pagination = document.getElementById('pagination');
    const modal = document.getElementById('movie-details-modal');
    const movieDetailsContainer = document.getElementById('movie-details-container');
    const ratingStars = document.getElementById('rating-stars');
    const favoriteButton = document.getElementById('favorite-button');
    const closeModal = document.querySelector('.close-modal');
    const newsletterForm = document.getElementById('newsletter-form');
    
    // Current page and search parameters
    let currentPage = 1;
    let totalPages = 1;
    let currentSearchQuery = '';
    let currentGenreId = '';
    let currentYear = '';
    let currentSortBy = 'popularity.desc';
    
    // Initialize page
    init();
    
    // Initialize function
    async function init() {
        // Check if the URL has a movie ID parameter
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        
        if (movieId) {
            // If there's a movie ID, load that movie's details
            await openMovieDetails(movieId);
        } else {
            // Otherwise, load the default movie list
            await loadFilterOptions();
            await loadMovies();
        }
        
        // Add event listeners
        setupEventListeners();
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Search button click
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                currentSearchQuery = searchInput.value.trim();
                currentPage = 1;
                loadMovies();
            });
        }
        
        // Search input enter key
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    currentSearchQuery = searchInput.value.trim();
                    currentPage = 1;
                    loadMovies();
                }
            });
        }
        
        // Genre filter change
        if (genreFilter) {
            genreFilter.addEventListener('change', () => {
                currentGenreId = genreFilter.value;
                currentPage = 1;
                loadMovies();
            });
        }
        
        // Year filter change
        if (yearFilter) {
            yearFilter.addEventListener('change', () => {
                currentYear = yearFilter.value;
                currentPage = 1;
                loadMovies();
            });
        }
        
        // Sort by change
        if (sortBy) {
            sortBy.addEventListener('change', () => {
                currentSortBy = sortBy.value;
                currentPage = 1;
                loadMovies();
            });
        }
        
        // Close modal
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Newsletter form submission
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                
                // Show success message
                newsletterForm.innerHTML = '<p>Thank you for subscribing!</p>';
                
                // In a real application, you would send this to your backend
                console.log('Newsletter subscription:', email);
            });
        }
    }
    
    // Load filter options
    async function loadFilterOptions() {
        try {
            // Load genres
            const { genres } = await window.movieApi.getGenres();
            
            genreFilter.innerHTML = '<option value="">All Genres</option>';
            
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                genreFilter.appendChild(option);
            });
            
            // Generate years (from 2000 to current year)
            const currentYear = new Date().getFullYear();
            yearFilter.innerHTML = '<option value="">All Years</option>';
            
            for (let year = currentYear; year >= 2000; year--) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearFilter.appendChild(option);
            }
            
        } catch (error) {
            console.error('Error loading filter options:', error);
        }
    }
    
    // Load movies based on current filters
    async function loadMovies() {
        console.log("hello");
        try {
            moviesContainer.innerHTML = '<div class="loader"></div>';
            
            let data;
            
            if (currentSearchQuery) {
                // If there's a search query, use the search endpoint
                data = await window.movieApi.searchMovies(currentSearchQuery, currentPage);
            } else {
                // Otherwise, use the discover endpoint with filters
                data = await window.movieApi.discoverMovies({
                    page: currentPage,
                    sortBy: currentSortBy,
                    year: currentYear,
                    genreId: currentGenreId
                });
            }
            
            const { results, total_pages } = data;
            totalPages = total_pages > 100 ? 100 : total_pages; // API limits to 500 pages, but we'll limit to 100
            
            moviesContainer.innerHTML = '';
            
            if (results.length === 0) {
                moviesContainer.innerHTML = '<p>No movies found. Try different search criteria.</p>';
                pagination.innerHTML = '';
                return;
            }
            
            results.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.className = 'movie-card';
                movieCard.dataset.id = movie.id;
                
                movieCard.innerHTML = `
                    <img src="${window.movieApi.getImageUrl(movie.poster_path)}" alt="${movie.title}" class="movie-poster">
                    <div class="movie-info">
                        <h3 class="movie-title">${movie.title}</h3>
                        <div class="movie-rating">
                            <i class="fas fa-star"></i>
                            <span>${movie.vote_average.toFixed(1)}</span>
                        </div>
                    </div>
                `;
                
                moviesContainer.appendChild(movieCard);
            });
            
            // Add click event to movie cards
            document.querySelectorAll('.movie-card').forEach(card => {
                card.addEventListener('click', () => {
                    const movieId = card.dataset.id;
                    openMovieDetails(movieId);
                });
            });
            
            // Update pagination
            updatePagination();
            
        } catch (error) {
            console.error('Error loading movies:', error);
            moviesContainer.innerHTML = '<p>Failed to load movies. Please try again later.</p>';
        }
    }
    
    // Update pagination controls
    function updatePagination() {
        pagination.innerHTML = '';
        
        // Don't show pagination if there's only one page
        if (totalPages <= 1) {
            return;
        }
        
        // Previous button
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.innerHTML = '&laquo; Prev';
            prevButton.addEventListener('click', () => {
                currentPage--;
                loadMovies();
                window.scrollTo(0, 0);
            });
            pagination.appendChild(prevButton);
        }
        
        // Page buttons
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            
            pageButton.addEventListener('click', () => {
                currentPage = i;
                loadMovies();
                window.scrollTo(0, 0);
            });
            
            pagination.appendChild(pageButton);
        }
        
        // Next button
        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.innerHTML = 'Next &raquo;';
            nextButton.addEventListener('click', () => {
                currentPage++;
                loadMovies();
                window.scrollTo(0, 0);
            });
            pagination.appendChild(nextButton);
        }
    }
    
    // Open movie details modal
    async function openMovieDetails(movieId) {
        try {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            movieDetailsContainer.innerHTML = '<div class="loader"></div>';
            
            const movie = await window.movieApi.getMovieDetails(movieId);
            
            // Format the movie details
            const genres = movie.genres.map(genre => genre.name).join(', ');
            const directors = movie.credits.crew
                .filter(crew => crew.job === 'Director')
                .map(director => director.name)
                .join(', ');
            const cast = movie.credits.cast
                .slice(0, 5)
                .map(actor => actor.name)
                .join(', ');
            
            movieDetailsContainer.innerHTML = `
                <div class="movie-poster-container">
                    <img src="${window.movieApi.getImageUrl(movie.poster_path, 'w500')}" alt="${movie.title}" class="movie-poster-large">
                </div>
                <div class="movie-info-detailed">
                    <h3>${movie.title}</h3>
                    <div class="movie-meta">
                        <span>${window.movieApi.formatDate(movie.release_date)}</span>
                        <span>${genres}</span>
                        <span>${window.movieApi.formatRuntime(movie.runtime)}</span>
                    </div>
                    <div class="movie-overview">
                        <h4>Overview</h4>
                        <p>${movie.overview}</p>
                    </div>
                    <div class="movie-details">
                        <p><strong>Director:</strong> ${directors || 'N/A'}</p>
                        <p><strong>Cast:</strong> ${cast || 'N/A'}</p>
                        <p><strong>Rating:</strong> ${movie.vote_average.toFixed(1)}/10 (${movie.vote_count} votes)</p>
                    </div>
                </div>
            `;
            
            // Set up rating stars
            ratingStars.innerHTML = '';
            for (let i = 1; i <= 5; i++) {
                const star = document.createElement('span');
                star.className = 'star';
                star.innerHTML = '★';
                star.dataset.rating = i;
                
                star.addEventListener('click', () => {
                    const rating = parseInt(star.dataset.rating);
                    
                    // Update UI
                    document.querySelectorAll('.star').forEach((s, index) => {
                        if (index < rating) {
                            s.classList.add('active');
                        } else {
                            s.classList.remove('active');
                        }
                    });
                    
                    // Save rating
                    rateMovie(movie.id, rating);
                });
                
                ratingStars.appendChild(star);
            }
            
            // Set up favorite button
            favoriteButton.onclick = () => addToFavorites(movie);
            
            // Set up movie ratings chart
            setupMovieRatingsChart(movie);
            
        } catch (error) {
            console.error('Error loading movie details:', error);
            movieDetailsContainer.innerHTML = '<p>Failed to load movie details. Please try again later.</p>';
        }
    }
    
    function setupMovieRatingsChart(movie) {
        const ctx = document.getElementById('movie-ratings-chart').getContext('2d');
        
        // Create rating distribution
        const ratings = Array(10).fill(0);
        
        // Simulate rating distribution based on vote_average and vote_count
        const voteAverage = movie.vote_average;
        const voteCount = movie.vote_count;
        
        // Calculate peak rating (rounded vote_average)
        const peakRating = Math.round(voteAverage);
        
        // Distribute votes around the peak
        for (let i = 0; i < voteCount; i++) {
            // Normal distribution around the peak rating
            const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const rating = Math.max(1, Math.min(10, peakRating + offset));
            ratings[rating - 1]++;
        }
        
        // Create chart
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
                datasets: [{
                    label: 'Number of Ratings',
                    data: ratings,
                    backgroundColor: 'rgba(1, 180, 228, 0.8)',
                    borderColor: 'rgba(1, 180, 228, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Ratings'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Rating'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Rate a movie
    async function rateMovie(movieId, rating) {
        try {
            // Convert 5-star rating to 10-star rating
            const rating10 = rating * 2;
            
            // Prepare rating data
            const ratingData = {
                movie_id: movieId,
                rating: rating10,
                date: new Date().toISOString()
            };
            
            // Send rating to the API
            await window.movieApi.rateMovie(ratingData);
            
            // Show success message
            showToast('Movie rated successfully!');
            
        } catch (error) {
            console.error('Error rating movie:', error);
            showToast('Failed to rate movie. Please try again later.', 'error');
        }
    }
    
    // Add to favorites
    async function addToFavorites(movie) {
        try {
            // Prepare movie data
            const movieData = {
                movie_id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                date_added: new Date().toISOString()
            };
            
            // Send to the API
            await window.movieApi.addToFavorites(movieData);
            
            // Update button text
            favoriteButton.textContent = 'Added to Favorites';
            favoriteButton.disabled = true;
            
            // Show success message
            showToast('Movie added to favorites!');
            
        } catch (error) {
            console.error('Error adding to favorites:', error);
            showToast('Failed to add to favorites. Please try again later.', 'error');
        }
    }
    
    // Show toast message
    function showToast(message, type = 'success') {
        // Check if toast container exists
        let toastContainer = document.querySelector('.toast-container');
        
        // If not, create it
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('fadeOut');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
});