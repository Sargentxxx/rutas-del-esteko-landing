/**
 * Rutas del Esteko - Landing Page Interactive Operations (SPA Version)
 * Author: Antigravity Regiment (Agent 00 - General Commander)
 * Powered by: DeepSeek Strategy Design
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. MOBILE MENU TOGGLE DRAWER
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = mobileToggle.querySelector('i');
    
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        
        // Dynamic icon rotation
        if (isOpen) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
            document.body.style.overflow = 'hidden'; // Prevents body scrolling when menu is open
        } else {
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    });

    // Close menu function
    function closeMobileMenu() {
        navMenu.classList.remove('open');
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
        document.body.style.overflow = '';
    }

    // ==========================================================================
    // 2. SPA ROUTER & VIEW SWITCHER (Tabs Navigation)
    // ==========================================================================
    const spaViews = document.querySelectorAll('.spa-view');
    const navLinks = document.querySelectorAll('.nav-menu a, .footer-links a');

    function switchView(hash) {
        // Default to 'inicio' if no hash or empty hash
        const viewId = hash.replace('#', '') || 'inicio';
        const targetViewElement = document.getElementById('view-' + viewId);

        if (targetViewElement) {
            // Hide all views
            spaViews.forEach(view => {
                view.classList.remove('active-view');
            });

            // Show active view
            targetViewElement.classList.add('active-view');

            // Update active state in nav menu
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + viewId) {
                    link.classList.add('active');
                }
            });

            // Scroll window to top smoothly/instantly
            window.scrollTo({ top: 0, behavior: 'instant' });

            // Close mobile navigation drawer
            closeMobileMenu();
        }
    }

    // Intercept clicks on all hash links (e.g. #inicio, #nosotros)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const hash = href;
                
                // Update URL hash
                history.pushState(null, null, hash);
                
                // Switch SPA View
                switchView(hash);
            }
        }
    });

    // Support back/forward button navigation & page load hashes
    window.addEventListener('popstate', () => {
        switchView(window.location.hash);
    });

    // Initial load view selection
    switchView(window.location.hash);

    // ==========================================================================
    // 3. STICKY HEADER SCROLL EFFECT
    // ==========================================================================
    const mainHeader = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        // Sticky Header Shrinking on Scroll
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // 4. DYNAMIC TRIP FILTERING (Tab Navigation in Destinos)
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const destinationCards = document.querySelectorAll('.destination-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active status from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            destinationCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Beautiful micro-animation transition for filtered cards
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // Waits for transition out to finish
                }
            });
        });
    });

    // ==========================================================================
    // 5. INTERACTIVE PAYMENT INSTALMENTS CALCULATOR
    // ==========================================================================
    const simDestiny = document.getElementById('sim-destiny');
    const simInstallments = document.getElementById('sim-installments');
    const simTotalVal = document.getElementById('sim-total-val');
    const simSeñaVal = document.getElementById('sim-seña-val');
    const simInstallVal = document.getElementById('sim-install-val');

    function calculateSim() {
        const total = parseInt(simDestiny.value, 10);
        const installments = parseInt(simInstallments.value, 10);
        
        // Recommended sign-in / seña (approx 20% rounded to thousands)
        const señaValRaw = total * 0.20;
        const seña = Math.ceil(señaValRaw / 1000) * 1000;
        
        // Quota is the remainder divided by the amount of months
        const remainder = total - seña;
        const installmentQuote = Math.round(remainder / installments);

        // Render beautifully with Argentine Peso formatting
        simTotalVal.textContent = `$${total.toLocaleString('es-AR')} ARS`;
        simSeñaVal.textContent = `$${seña.toLocaleString('es-AR')} ARS`;
        simInstallVal.textContent = `$${installmentQuote.toLocaleString('es-AR')} ARS`;
    }

    // Trigger calculation when selectors change
    if (simDestiny && simInstallments) {
        simDestiny.addEventListener('change', calculateSim);
        simInstallments.addEventListener('change', calculateSim);
        // Initial run
        calculateSim();
    }

    // ==========================================================================
    // 6. LEAD CAPTURE FORM / NEWSLETTER & LOCALSTORAGE PERSISTENCE
    // ==========================================================================
    const leadForm = document.getElementById('lead-form');
    const leadSuccessMsg = document.getElementById('lead-success-msg');
    const successUserName = document.getElementById('success-user-name');
    const btnResetForm = document.getElementById('btn-reset-form');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop page reload

            const name = document.getElementById('lead-name').value.trim();
            const phone = document.getElementById('lead-phone').value.trim();
            const email = document.getElementById('lead-email').value.trim();
            const destiny = document.getElementById('lead-destiny-select').value;

            // Structured Lead object
            const leadData = {
                name,
                phone,
                email,
                destiny,
                registeredAt: new Date().toISOString()
            };

            // Save locally to simulate client data registry
            let leads = JSON.parse(localStorage.getItem('esteko_leads') || '[]');
            leads.push(leadData);
            localStorage.setItem('esteko_leads', JSON.stringify(leads));

            // Display personalized visually striking success confirmation card
            if (successUserName) successUserName.textContent = name;
            leadForm.style.display = 'none';
            if (leadSuccessMsg) leadSuccessMsg.style.display = 'block';
        });
    }

    if (btnResetForm) {
        btnResetForm.addEventListener('click', () => {
            // Reset and show form back
            leadForm.reset();
            if (leadSuccessMsg) leadSuccessMsg.style.display = 'none';
            leadForm.style.display = 'block';
        });
    }

    // ==========================================================================
    // 7. MARQUEE EFFECT BUFFER
    // ==========================================================================
    // Marquee effect double buffer to avoid empty white space gaps in scrolling strip
    const marqueeText = document.querySelector('.marquee-text');
    if (marqueeText) {
        const doubleContent = marqueeText.innerHTML + " &nbsp;•&nbsp; " + marqueeText.innerHTML;
        marqueeText.innerHTML = doubleContent;
    }
});
