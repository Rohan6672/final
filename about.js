// public/js/about.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize variables
    const techContainer = document.getElementById('tech-container');
    const newsletterForm = document.getElementById('newsletter-form');
    
    // Load technologies
    async function loadTechnologies() {
        try {
            const technologies = await window.movieApi.getTechnologies();
            
            techContainer.innerHTML = '';
            
            technologies.forEach(tech => {
                const techItem = document.createElement('div');
                techItem.className = 'tech-item';
                
                techItem.innerHTML = `
                    <img src="${tech.icon}" alt="${tech.name}" class="tech-icon">
                    <h4>${tech.name}</h4>
                `;
                
                techContainer.appendChild(techItem);
            });
            
        } catch (error) {
            console.error('Error loading technologies:', error);
            techContainer.innerHTML = '<p>Failed to load technologies. Please try again later.</p>';
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
    loadTechnologies();
});