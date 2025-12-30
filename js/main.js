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
});
