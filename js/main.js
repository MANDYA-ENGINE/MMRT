document.addEventListener('DOMContentLoaded', function() {
    // Initialize language from localStorage or default to Kannada
    const savedLang = localStorage.getItem('language') || 'kn';
    let currentLang = savedLang;
    
    // Set initial language
    document.documentElement.lang = currentLang;
    updateLanguage(currentLang);

    // Function to update all text elements with language
    function updateLanguage(lang) {
        const langAttr = `data-lang-${lang}`;
        
        // Update all elements with language data attributes
        document.querySelectorAll('[data-lang-kn], [data-lang-en]').forEach(element => {
            const text = element.getAttribute(langAttr);
            if (text) {
                if (element.tagName === 'TITLE') {
                    document.title = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }

    // Language toggle functionality
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        // Button always shows "English"
        const langText = languageToggle.querySelector('.lang-text');
        if (langText) {
            langText.textContent = 'English';
        }
        
        languageToggle.addEventListener('click', function() {
            currentLang = currentLang === 'kn' ? 'en' : 'kn';
            document.documentElement.lang = currentLang;
            localStorage.setItem('language', currentLang);
            updateLanguage(currentLang);
        });
    }

    // Logo animation handling
    const hasVisited = sessionStorage.getItem('hasVisited');
    const logoAnimationContainer = document.querySelector('.logo-animation-container');
    
    if (logoAnimationContainer) {
        if (hasVisited) {
            // Hide immediately if user has visited before
            logoAnimationContainer.style.display = 'none';
        } else {
            // Show animation on first visit
            logoAnimationContainer.style.display = 'flex';
            
            // Hide after animation completes (2s animation + 1.5s delay = 3.5s total)
            setTimeout(() => {
                logoAnimationContainer.style.opacity = '0';
                setTimeout(() => {
                    logoAnimationContainer.style.display = 'none';
                }, 500);
            }, 3500);
            
            // Mark as visited
            sessionStorage.setItem('hasVisited', 'true');
        }
    }


    // Smooth scroll for any anchor links (if needed in future)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add scroll effect to header (optional enhancement)
    const header = document.querySelector('.minimal-header');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
            
            lastScroll = currentScroll;
        });
    }

    // Lazy loading for images (if browser supports it)
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // Event Image Carousels
    initializeEventCarousels();
});

// Event Carousel Functionality
function initializeEventCarousels() {
    const eventCards = document.querySelectorAll('.event-card[data-event-folder]');
    
    eventCards.forEach(card => {
        const folderName = card.getAttribute('data-event-folder');
        const carouselContainer = card.querySelector('.carousel-container');
        const slidesContainer = card.querySelector('.carousel-slides');
        const prevBtn = card.querySelector('.carousel-prev');
        const nextBtn = card.querySelector('.carousel-next');
        const dotsContainer = card.querySelector('.carousel-dots');
        
        if (!carouselContainer || !slidesContainer) return;
    
        // Image extensions to try
        const extensions = ['jpeg', 'jpg', 'JPG', 'png', 'PNG'];
        const images = [];
        let currentIndex = 0;
        let autoSlideInterval = null;
        
        // Try to load images (1, 2, 3, etc.)
        function loadImages() {
            let imageNum = 1;
            let consecutiveFailures = 0;
            const maxConsecutiveFailures = 3; // Stop after 3 consecutive failures
            const maxAttempts = 30; // Maximum image number to try
            
            function tryLoadImage(num) {
                if (num > maxAttempts || consecutiveFailures >= maxConsecutiveFailures) {
                    // Finished loading
                    if (images.length === 0) {
                        // No images found, use placeholder
                        const placeholder = document.createElement('div');
                        placeholder.className = 'carousel-slide';
                        const img = document.createElement('img');
                        img.src = 'assets/images/pixelcut_4k.png';
                        img.alt = 'Event Image';
                        placeholder.appendChild(img);
                        slidesContainer.appendChild(placeholder);
                        carouselContainer.classList.add('single-image');
        } else {
                        renderCarousel();
                        // Start auto-slide after a short delay
                        setTimeout(() => {
                            if (images.length > 1) {
                                startAutoSlide();
        }
                        }, 500);
                    }
                    return;
                }
                
                let imageFound = false;
                let extIndex = 0;
                
                function tryExtension() {
                    if (extIndex >= extensions.length) {
                        // All extensions tried, move to next number
                        if (!imageFound) {
                            consecutiveFailures++;
                            tryLoadImage(num + 1);
                        }
                        return;
                    }
                    
                    const ext = extensions[extIndex];
                    const imagePath = `assets/images/Events/${encodeURIComponent(folderName)}/${num}.${ext}`;
                    const img = new Image();
                    
                    img.onload = function() {
                        imageFound = true;
                        consecutiveFailures = 0; // Reset failure counter
                        images.push({
                            src: imagePath,
                            num: num
                        });
                        // Try next number
                        tryLoadImage(num + 1);
                    };
                    
                    img.onerror = function() {
                        extIndex++;
                        tryExtension();
                    };
                    
                    img.src = imagePath;
                }
                
                tryExtension();
            }
            
            tryLoadImage(1);
        }
        
        function renderCarousel() {
            slidesContainer.innerHTML = '';
            dotsContainer.innerHTML = '';
            
            if (images.length === 0) return;
            
            const imageElements = [];
            let loadedCount = 0;
            
            // Create slides and load images
            images.forEach((image, index) => {
                const slide = document.createElement('div');
                slide.className = 'carousel-slide';
                const img = document.createElement('img');
                img.src = image.src;
                img.alt = `Event Image ${index + 1}`;
                img.loading = 'lazy';
                
                // Track when image loads to calculate height
                img.onload = function() {
                    loadedCount++;
                    imageElements.push({
                        element: img,
                        height: img.naturalHeight,
                        width: img.naturalWidth
                    });
                    
                    // When all images are loaded, set dynamic height
                    if (loadedCount === images.length) {
                        setCarouselHeight();
                    }
                };
                
                img.onerror = function() {
                    loadedCount++;
                    // If image fails to load, use placeholder dimensions
                    imageElements.push({
                        element: img,
                        height: 300,
                        width: 400
                    });
                    
                    if (loadedCount === images.length) {
                        setCarouselHeight();
                    }
                };
                
                slide.appendChild(img);
                slidesContainer.appendChild(slide);
                
                // Create dot
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                if (index === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to image ${index + 1}`);
                dot.addEventListener('click', () => goToSlide(index));
                dotsContainer.appendChild(dot);
            });
            
            // Hide controls if only one image
            if (images.length === 1) {
                carouselContainer.classList.add('single-image');
            } else {
                carouselContainer.classList.remove('single-image');
            }
            
            updateCarousel();
            
            // Function to set carousel height based on tallest image
            function setCarouselHeight() {
                if (imageElements.length === 0) return;
                
                // Calculate the aspect ratio for each image and find the tallest one when constrained to container width
                const containerWidth = carouselContainer.offsetWidth || slidesContainer.offsetWidth || 400;
                let maxHeight = 0;
                
                imageElements.forEach(imgData => {
                    // Calculate what the height would be if image is scaled to container width
                    const aspectRatio = imgData.width / imgData.height;
                    const scaledHeight = containerWidth / aspectRatio;
                    
                    // Cap at max-height from CSS (responsive: 400px mobile, 500px tablet, 600px desktop)
                    let maxHeight = 400;
                    if (window.innerWidth >= 1024) {
                        maxHeight = 600;
                    } else if (window.innerWidth >= 768) {
                        maxHeight = 500;
                    }
                    const finalHeight = Math.min(scaledHeight, maxHeight);
                    maxHeight = Math.max(maxHeight, finalHeight);
                });
                
                // Set minimum height
                maxHeight = Math.max(maxHeight, 200);
                
                // Apply height to carousel container and slides
                carouselContainer.style.height = maxHeight + 'px';
                const eventCarousel = card.querySelector('.event-image-carousel');
                if (eventCarousel) {
                    eventCarousel.style.height = maxHeight + 'px';
                }
                
                // Set all slides to same height
                const slides = slidesContainer.querySelectorAll('.carousel-slide');
                slides.forEach(slide => {
                    slide.style.height = maxHeight + 'px';
                });
            }
            
            // If images are already loaded (cached), set height immediately
            setTimeout(() => {
                if (loadedCount === images.length) {
                    setCarouselHeight();
                }
            }, 100);
            
            // Also set height on window resize
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    if (loadedCount === images.length) {
                        setCarouselHeight();
                    }
                }, 250);
            });
        }
        
        function updateCarousel() {
            const translateX = -currentIndex * 100;
            slidesContainer.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        function goToSlide(index) {
            if (index < 0 || index >= images.length) return;
            currentIndex = index;
            updateCarousel();
            resetAutoSlide();
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % images.length;
            updateCarousel();
            resetAutoSlide();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateCarousel();
            resetAutoSlide();
        }
        
        function startAutoSlide() {
            if (images.length <= 1) return;
            autoSlideInterval = setInterval(nextSlide, 4000); // Change image every 4 seconds
        }
        
        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }
        
        function resetAutoSlide() {
            stopAutoSlide();
            startAutoSlide();
        }
        
        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        
        // Pause on hover
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                // Swipe left - next
                nextSlide();
            }
            if (touchEndX > touchStartX + 50) {
                // Swipe right - previous
                prevSlide();
            }
        }
        
        // Load images and initialize
        loadImages();
});
}
