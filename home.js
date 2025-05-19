// public/js/home.js
import { animate, utils, createDraggable, createSpring } from 'animejs';
document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    const featuredMoviesContainer = document.getElementById('featured-movies-container');
    const trendingContainer = document.getElementById('trending-container');
    const ratingsChart = document.getElementById('ratings-chart');
    const newsletterForm = document.getElementById('newsletter-form');
    
    // Initialize Swiper
    let swiper;
    
    // Load featured movies
    async function loadFeaturedMovies() {
        try {
            const { results } = await window.movieApi.getPopularMovies();
            
            // Display the first 10 popular movies
            const featuredMovies = results.slice(0, 10);
            
            featuredMoviesContainer.innerHTML = '';
            
            featuredMovies.forEach(movie => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                
                slide.innerHTML = `
                    <div class="movie-card" data-id="${movie.id}">
                        <img src="${window.movieApi.getImageUrl(movie.poster_path)}" alt="${movie.title}" class="movie-poster">
                        <div class="movie-info">
                            <h3 class="movie-title">${movie.title}</h3>
                            <div class="movie-rating">
                                <i class="fas fa-star"></i>
                                <span>${movie.vote_average.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                `;
                
                featuredMoviesContainer.appendChild(slide);
            });
            
            // Initialize Swiper
            swiper = new Swiper('.swiper-container', {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                centeredSlides: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                }
            });
            
            // Add click event to movie cards
            document.querySelectorAll('.movie-card').forEach(card => {
                card.addEventListener('click', () => {
                    const movieId = card.dataset.id;
                    window.location.href = `movies.html?id=${movieId}`;
                });
            });
            
        } catch (error) {
            console.error('Error loading featured movies:', error);
            featuredMoviesContainer.innerHTML = '<p>Failed to load featured movies. Please try again later.</p>';
        }
    }
    
    // Load trending movies
    async function loadTrendingMovies() {
        try {
            const { results } = await window.movieApi.getTrendingMovies();
            
            // Display the first 8 trending movies
            const trendingMovies = results.slice(0, 8);
            
            trendingContainer.innerHTML = '';
            
            trendingMovies.forEach(movie => {
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
                
                trendingContainer.appendChild(movieCard);
            });
            
            // Add click event to movie cards
            document.querySelectorAll('.movie-card').forEach(card => {
                card.addEventListener('click', () => {
                    const movieId = card.dataset.id;
                    window.location.href = `movies.html?id=${movieId}`;
                });
            });
            
        } catch (error) {
            console.error('Error loading trending movies:', error);
            trendingContainer.innerHTML = '<p>Failed to load trending movies. Please try again later.</p>';
        }
    }
    
    // Load movie statistics chart
    async function loadStatisticsChart() {
        try {
            const data = await window.movieApi.getMovieStatistics();
            
            // Create a chart using Chart.js
            const ctx = ratingsChart.getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.genres.map(genre => genre.name),
                    datasets: [{
                        label: 'Average Rating',
                        data: data.genres.map(genre => genre.average_rating),
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
                            max: 10,
                            title: {
                                display: true,
                                text: 'Average Rating (0-10)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Genre'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Rating: ${context.raw.toFixed(1)}/10`;
                                }
                            }
                        }
                    }
                }
            });
            
        } catch (error) {
            console.error('Error loading statistics chart:', error);
            document.querySelector('.chart-container').innerHTML = '<p>Failed to load statistics chart. Please try again later.</p>';
        }
    }
    
    // Handle newsletter form submission
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
    
    // Initialize page
    loadFeaturedMovies();
    loadTrendingMovies();
    loadStatisticsChart();

    

    const [ $logo ] = utils.$('.logo.js');
    const [ $button ] = utils.$('button');
    let rotations = 0;

    // Created a bounce animation loop
    animate('#titleimg', {
    scale: [
        { to: 1.25, ease: 'inOut(3)', duration: 200 },
        { to: 1, ease: createSpring({ stiffness: 300 }) }
    ],
    loop: true,
    loopDelay: 250,
    });

    // Make the logo draggable around its center
    createDraggable('#titleimg', {
    container: [0, 0, 0, 0],
    releaseEase: createSpring({ stiffness: 200 })
    });

});