/**
 * Vinyl Record Store & Listening Bar
 * Main Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initRTL();
    initTheme();
    initAnimations();
    initScrollProgress();
    initBackToTop();
    initActiveNav();
    initOfferModal();
    initShopSearch();
});

/**
 * Sticky Header
 */
function initStickyHeader() {
    const header = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky-active');
        } else {
            header.classList.remove('sticky-active');
        }
    });
}

/**
 * RTL Support
 */
function initRTL() {
    const toggleBtn = document.getElementById('rtlToggle');
    if (!toggleBtn) return;

    // Check saved state
    const currentDir = localStorage.getItem('siteDir') || 'ltr';
    document.documentElement.setAttribute('dir', currentDir);
    updateRTLButton(currentDir);

    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const newDir = document.documentElement.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', newDir);
        localStorage.setItem('siteDir', newDir);
        updateRTLButton(newDir);
        // Refresh animations or layout if needed
    });
}

function updateRTLButton(dir) {
    const btnText = document.getElementById('rtlText');
    if (btnText) {
        btnText.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
    }
}

/**
 * Theme Toggle Support
 */
function initTheme() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;

    // Check saved state
    const currentTheme = localStorage.getItem('siteTheme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        updateThemeIcon('light');
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('siteTheme', isLight ? 'light' : 'dark');
        updateThemeIcon(isLight ? 'light' : 'dark');
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }
}

/**
 * Scroll Animations (Simple Intersection Observer)
 */
function initAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Pop-up Modal Logic
 */
function initOfferModal() {
    // Only show on home page if not shown before in this session
    if (document.body.id === 'home-1' && !sessionStorage.getItem('modalShown')) {
        setTimeout(() => {
            const offerModal = new bootstrap.Modal(document.getElementById('offerModal'));
            offerModal.show();
            sessionStorage.setItem('modalShown', 'true');
        }, 3000);
    }
}

/**
 * Shop Search & Filter
 */
function initShopSearch() {
    const searchInput = document.getElementById('recordSearch');
    const genreFilter = document.getElementById('genreFilter');
    const recordCards = document.querySelectorAll('.record-item');

    if (!searchInput || !recordCards.length) return;

    const filterRecords = () => {
        const query = searchInput.value.toLowerCase();
        const genre = genreFilter.value.toLowerCase();

        recordCards.forEach(card => {
            const title = card.querySelector('.record-title').textContent.toLowerCase();
            const artist = card.querySelector('.record-artist').textContent.toLowerCase();
            const cardGenre = card.dataset.genre.toLowerCase();

            const matchesSearch = title.includes(query) || artist.includes(query);
            const matchesGenre = genre === 'all' || cardGenre === genre;

            if (matchesSearch && matchesGenre) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    };

    searchInput.addEventListener('input', filterRecords);
    genreFilter.addEventListener('change', filterRecords);
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Scroll Progress Bar
 */
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height > 0) {
            const scrolled = (winScroll / height) * 100;
            bar.style.width = scrolled + "%";
        }
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    if (document.body.classList.contains('auth-page')) return;

    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '<i class="bi bi-arrow-up fs-5 fw-bold"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Dynamic Active Nav Highlighting
 */
function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
