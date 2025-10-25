/**
 * HOME PAGE INTERACTIONS - SHAVUOT EDU
 * Handles all interactive elements on the homepage
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Video player functionality
    initVideoPlayer();
    
    // Animate elements on scroll
    initScrollAnimations();
    
    // Course card interactions
    initCourseCards();
    
    // Stats counter animation
    initStatsCounter();
    
});

/**
 * Initialize smooth scrolling for all anchor links
 */
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize video player functionality
 */
function initVideoPlayer() {
    const playButton = document.querySelector('.play-button');
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    if (playButton && videoPlaceholder) {
        playButton.addEventListener('click', function() {
            // Replace with actual video embed (YouTube, Vimeo, etc.)
            const videoEmbed = `
                <iframe 
                    width="100%" 
                    height="400" 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    style="border-radius: 20px;"
                ></iframe>
            `;
            
            videoPlaceholder.innerHTML = videoEmbed;
        });
    }
}

/**
 * Initialize scroll animations for elements
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe course cards
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });
    
    // Add animate-in class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize course card interactions
 */
function initCourseCards() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        // Add hover effect for mobile
        card.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 300);
        });
        
        // Track clicks on enroll buttons
        const enrollBtn = card.querySelector('.btn-course');
        if (enrollBtn) {
            enrollBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const courseTitle = card.querySelector('.course-title').textContent;
                console.log(`Enrollment clicked for: ${courseTitle}`);
                
                // Show a simple alert (replace with actual enrollment logic)
                alert(`Enrollment process for "${courseTitle}" will be implemented soon!`);
            });
        }
    });
}

/**
 * Initialize stats counter animation
 */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStats();
            }
        });
    }, observerOptions);
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const hasPlus = text.includes('+');
            const hasSlash = text.includes('/');
            
            if (hasSlash) {
                // Handle rating format (e.g., "4.9/5")
                const [rating] = text.split('/');
                animateNumber(stat, 0, parseFloat(rating), 1500, 1, '/5');
            } else {
                // Handle number format (e.g., "15,000+")
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                const suffix = hasPlus ? '+' : '';
                animateNumber(stat, 0, number, 2000, 0, suffix);
            }
        });
    }
    
    function animateNumber(element, start, end, duration, decimals = 0, suffix = '') {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;
            
            if (decimals > 0) {
                element.textContent = current.toFixed(decimals) + suffix;
            } else {
                element.textContent = Math.floor(current).toLocaleString() + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
}

/**
 * Parallax effect disabled to prevent overlap with next section
 */
// window.addEventListener('scroll', function() {
//     const scrolled = window.pageYOffset;
//     const hero = document.querySelector('.home-hero');
//     
//     if (hero && scrolled < window.innerHeight) {
//         hero.style.transform = `translateY(${scrolled * 0.5}px)`;
//     }
// });

/**
 * Handle CTA button clicks
 */
document.querySelectorAll('.btn-primary-large, .btn-outline-large').forEach(button => {
    button.addEventListener('click', function(e) {
        // Skip if it's an anchor link
        if (this.getAttribute('href').startsWith('#')) {
            return;
        }
        
        // Skip if it's a valid external or internal link (not just "#")
        const href = this.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('javascript:')) {
            // Let the browser handle the navigation normally
            return;
        }
        
        e.preventDefault();
        const buttonText = this.textContent.trim();
        console.log(`CTA clicked: ${buttonText}`);
        
        // Add your actual CTA logic here
        alert(`"${buttonText}" functionality will be implemented soon!`);
    });
});

/**
 * Add loading state to buttons
 */
function addButtonLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    // Simulate loading (remove this in production)
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
}

/**
 * Handle "View All Courses" button
 */
const viewAllBtn = document.querySelector('.btn-view-all');
if (viewAllBtn) {
    viewAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('View All Courses clicked');
        
        // Add your navigation logic here
        alert('Courses catalog page will be implemented soon!');
    });
}

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', function(e) {
    // Press 'Escape' to close any modals or overlays
    if (e.key === 'Escape') {
        // Add your modal close logic here
    }
    
    // Press 'Space' on video to play/pause
    if (e.key === ' ' && e.target === document.querySelector('.play-button')) {
        e.preventDefault();
        e.target.click();
    }
});

/**
 * Log page view (for analytics)
 */
console.log('Shavuot EDU Homepage loaded successfully');
console.log('Page load time:', performance.now().toFixed(2) + 'ms');
