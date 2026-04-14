/**
 * Vinyl Vibes | Record Store & Listening Experience
 * Main Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initStickyHeader();
    initRTL();
    initTheme();
    initAnimations();
    initBackToTop();
    initActiveNav();
    initCart();
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
    const themeBtns = document.querySelectorAll('.theme-toggle-btn');
    if (!themeBtns.length) return;

    // Check saved state
    const currentTheme = localStorage.getItem('siteTheme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        updateAllThemeIcons('light');
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('siteTheme', isLight ? 'light' : 'dark');
            updateAllThemeIcons(isLight ? 'light' : 'dark');
        });
    });
}

function updateAllThemeIcons(theme) {
    const icons = document.querySelectorAll('.theme-toggle-btn i');
    icons.forEach(icon => {
        icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    });
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

/**
 * Cart Functionality
 */
function initCart() {
    let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
    updateCartUI(cartCount);

    // Create Toast if it doesn't exist
    if (!document.getElementById('cart-toast')) {
        const toast = document.createElement('div');
        toast.id = 'cart-toast';
        toast.innerHTML = `
            <i class="bi bi-check-circle-fill"></i>
            <div>
                <strong class="d-block">Added to Collection</strong>
                <span class="small opacity-75">Record added to your basket</span>
            </div>
        `;
        document.body.appendChild(toast);
    }

    // Add event listeners to all cart buttons
    document.addEventListener('click', (e) => {
        const cartBtn = e.target.closest('button');
        if (cartBtn && cartBtn.querySelector('.bi-cart') && !cartBtn.classList.contains('cart-btn')) {
            cartCount++;
            localStorage.setItem('cartCount', cartCount);
            updateCartUI(cartCount);
            showCartToast();
        }
    });
}

function updateCartUI(count) {
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = count;
        // Also ensure badge is shown if count > 0
        if(count > 0) {
           badge.style.display = 'flex';
        } else {
           badge.style.display = 'none';
        }
    });
}

function showCartToast() {
    const toast = document.getElementById('cart-toast');
    if(toast) {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

/**
 * Password Visibility Toggle
 */
function togglePassword(inputId, el) {
    const input = document.getElementById(inputId);
    const icon = el.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
    }
}


