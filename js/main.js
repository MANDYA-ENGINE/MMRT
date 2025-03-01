document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    const currentLang = localStorage.getItem('language') || 'kn';
    document.documentElement.lang = currentLang;
    document.getElementById('languageSelect').value = currentLang;

    // Language translation functionality
    window.changeLanguage = function(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);
        
        // Reload the page to apply translations
        window.location.reload();
    };

    // Check if user has visited before
    const hasVisited = sessionStorage.getItem('hasVisited');
    const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    
    // Only show logo animation on home page and first visit
    if (isHomePage && !hasVisited) {
        const logoIntro = document.querySelector('.logo-intro-container');
        if (logoIntro) {
            logoIntro.style.display = 'flex';
            setTimeout(() => {
                logoIntro.style.opacity = '0';
                setTimeout(() => {
                    logoIntro.style.display = 'none';
                }, 500);
            }, 2000);
            // Set visited flag
            sessionStorage.setItem('hasVisited', 'true');
        }
    } else {
        // Hide logo container on other pages or subsequent visits
        const logoIntro = document.querySelector('.logo-intro-container');
        if (logoIntro) {
            logoIntro.style.display = 'none';
        }
    }

    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const menuToggle = document.querySelector('.menu-toggle');
    
    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu after clicking
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });
});
