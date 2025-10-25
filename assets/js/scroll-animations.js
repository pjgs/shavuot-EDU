// ============================================================================
// SCROLL ANIMATIONS & LAZY LOADING - Optimized Performance
// ============================================================================

/**
 * Lazy load YouTube iframes when they come into view
 */
function initLazyLoadVideos() {
    const videoObserverOptions = {
        root: null,
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0
    };

    const videoObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                const dataSrc = iframe.getAttribute('data-src');
                
                if (dataSrc) {
                    iframe.setAttribute('src', dataSrc);
                    iframe.removeAttribute('data-src');
                    observer.unobserve(iframe);
                    console.log('Video loaded:', dataSrc);
                }
            }
        });
    };

    const videoObserver = new IntersectionObserver(videoObserverCallback, videoObserverOptions);

    // Find all iframes with data-src attribute
    const lazyVideos = document.querySelectorAll('iframe[data-src]');
    lazyVideos.forEach(video => videoObserver.observe(video));

    console.log(`Lazy loading initialized for ${lazyVideos.length} videos`);
}

/**
 * Animate elements on scroll
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Optionally unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Animate sections
    const sections = document.querySelectorAll('section:not(.home-hero)');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Animate video containers
    const videoContainers = document.querySelectorAll('.video-container, .video-gallery-item, .video-gallery-double-item, .video-gallery-triple-item');
    videoContainers.forEach((container, index) => {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        container.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(container);
    });

    console.log(`Scroll animations initialized for ${sections.length} sections and ${videoContainers.length} video containers`);
}

/**
 * Add animate-in styles
 */
function addAnimationStyles() {
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
 * Initialize all animations
 */
function initAllAnimations() {
    addAnimationStyles();
    initScrollAnimations();
    initLazyLoadVideos();
}

// Execute when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
} else {
    initAllAnimations();
}
