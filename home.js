// public/js/home.js
document.addEventListener('DOMContentLoaded', () => {
    const featuredMoviesContainer = document.getElementById('featured-movies-container');
    const trendingContainer = document.getElementById('trending-container');
    const ratingsChart = document.getElementById('ratings-chart');
    const newsletterForm = document.getElementById('newsletter-form');
  
    async function loadFeaturedMovies() {
      try {
        const { results } = await window.movieApi.getPopularMovies();
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
  
        new Swiper('.swiper-container', {
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
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }
        });
      } catch (error) {
        console.error('Error loading featured movies:', error);
        featuredMoviesContainer.innerHTML = '<p>Failed to load featured movies. Please try again later.</p>';
      }
    }
  
    async function loadTrendingMovies() {
      try {
        const { results } = await window.movieApi.getTrendingMovies();
        const trendingMovies = results.slice(0, 8);
        trendingContainer.innerHTML = '';
  
        trendingMovies.forEach(movie => {
          const card = document.createElement('div');
          card.className = 'movie-card';
          card.dataset.id = movie.id;
  
          card.innerHTML = `
            <img src="${window.movieApi.getImageUrl(movie.poster_path)}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
              <h3 class="movie-title">${movie.title}</h3>
              <div class="movie-rating">
                <i class="fas fa-star"></i>
                <span>${movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
          `;
          trendingContainer.appendChild(card);
        });
      } catch (error) {
        console.error('Error loading trending movies:', error);
        trendingContainer.innerHTML = '<p>Failed to load trending movies. Please try again later.</p>';
      }
    }
  
    async function loadStatisticsChart() {
      try {
        const data = await window.movieApi.getMovieStatistics();
        const ctx = ratingsChart.getContext('2d');
  
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.genres.map(g => g.name),
            datasets: [{
              label: 'Average Rating',
              data: data.genres.map(g => g.average_rating),
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
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: ctx => `Rating: ${ctx.raw.toFixed(1)}/10`
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
  
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        newsletterForm.innerHTML = '<p>Thank you for subscribing!</p>';
        console.log('Newsletter subscription:', email);
      });
    }
  
    // ✅ Working Anime.js bounce animation
    anime({
      targets: '#titleimg',
      scale: [
        { value: 1.25, duration: 300, easing: 'easeInOutQuad' },
        { value: 1, duration: 600, easing: 'easeOutBounce' }
      ],
      loop: true,
      direction: 'alternate',
      delay: 300
    });
  
    loadFeaturedMovies();
    loadTrendingMovies();
    loadStatisticsChart();
  });