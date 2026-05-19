/**
 * Rutas del Esteko - Landing Page Interactive Operations
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

    // Close menu when clicking on nav link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
            document.body.style.overflow = '';
        });
    });

    // ==========================================================================
    // 2. STICKY HEADER SCROLL EFFECT & AUTO-ACTIVE NAVIGATION LINKS
    // ==========================================================================
    const mainHeader = document.getElementById('main-header');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        // Sticky Header Shrinking
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }

        // Active Section Tracker
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 160; // Offset for header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 3. DYNAMIC TRIP FILTERING (Tab Navigation)
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
    // 4. INTERACTIVE PAYMENT INSTALMENTS CALCULATOR
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
    simDestiny.addEventListener('change', calculateSim);
    simInstallments.addEventListener('change', calculateSim);
    
    // Initial run
    calculateSim();

    // ==========================================================================
    // 5. LEAD CAPTURE FORM / NEWSLETTER & LOCALSTORAGE PERSISTENCE
    // ==========================================================================
    const leadForm = document.getElementById('lead-form');
    const leadSuccessMsg = document.getElementById('lead-success-msg');
    const successUserName = document.getElementById('success-user-name');
    const btnResetForm = document.getElementById('btn-reset-form');

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
        successUserName.textContent = name;
        leadForm.style.display = 'none';
        leadSuccessMsg.style.display = 'block';
    });

    btnResetForm.addEventListener('click', () => {
        // Reset and show form back
        leadForm.reset();
        leadSuccessMsg.style.display = 'none';
        leadForm.style.display = 'block';
    });

    // ==========================================================================
    // 6. MAP INTERACTIVE PIN CLICK SIMULATION
    // ==========================================================================
    // Marquee effect double buffer to avoid empty white space gaps in scrolling strip
    const marqueeText = document.querySelector('.marquee-text');
    if (marqueeText) {
        const doubleContent = marqueeText.innerHTML + " &nbsp;•&nbsp; " + marqueeText.innerHTML;
        marqueeText.innerHTML = doubleContent;
    }
});
