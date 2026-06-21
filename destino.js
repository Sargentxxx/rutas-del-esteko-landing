/**
 * destino.js — Lógica de la Página de Detalle de Destino
 * Rutas del Esteko · Antigravity Regiment
 * 
 * Carga datos del destino desde Firebase (o LocalStorage como fallback),
 * renderiza la galería con lightbox y configura el parallax del hero.
 */

// ============================================================
// CONFIGURACIÓN FIREBASE (misma que script.js)
// ============================================================
const firebaseConfig = {
    apiKey: "AIzaSyAxSpYY8iZXcLylJStFx2GD3Ejyzq_wy_U",
    authDomain: "rutas-del-esteko-landing.firebaseapp.com",
    projectId: "rutas-del-esteko-landing",
    storageBucket: "rutas-del-esteko-landing.firebasestorage.app",
    messagingSenderId: "583115096942",
    appId: "1:583115096942:web:62193426a24fdd0e19377f"
};

let firestoreDb = null;

try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        firestoreDb = firebase.firestore();
    }
} catch (e) {
    console.warn("[destino.js] No se pudo inicializar Firebase en el detalle.", e);
}

// Datos por defecto completos (espejo de script.js para fallback offline)
const DEFAULT_DESTINATIONS_DETAIL = [
    {
        id: "default-mdp",
        name: "Mar del Plata Mágica",
        category: "verano",
        duration: "7 Noches / 10 Días",
        description: "Salidas durante la temporada de verano desde la Terminal de Ómnibus en unidades premium de la empresa San Felipe (habilitación CNRT). Estadía de 7 noches en departamentos céntricos equipados, cercanos a los principales atractivos y playas.",
        long_description: "Mar del Plata, la Perla del Atlántico, te espera con sus playas doradas, su vida nocturna inigualable y sus rincones turísticos para todos los gustos. Con Rutas del Esteko viajás con la tranquilidad de saber que cada detalle está planificado: salida desde la Terminal de Ómnibus de Santiago del Estero en unidades premium San Felipe con habilitación CNRT, coordinadores permanentes y departamentos céntricos y equipados a pasos de los mejores atractivos.\n\nIncluye coordinación permanente durante toda la estadía, asistencia ante cualquier eventualidad y la posibilidad de contratar excursiones opcionales como el Aquarium, la Catedral del Mar, el Casino, paseos en barco y mucho más. Una experiencia familiar y segura que ya disfrutaron miles de estekenses.",
        image_url: "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1920&q=90",
        gallery_images: [
            "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80"
        ],
        price_info: "Temporada de Verano",
        whatsapp_text: "Hola! Me interesa el viaje a Mar del Plata",
        services: [
            "Micros de San Felipe con CNRT",
            "Deptos. Céntricos Equipados",
            "Coordinación Permanente y Excursiones"
        ],
        cost: 90000
    },
    {
        id: "default-camboriu",
        name: "Balneario Camboriú",
        category: "verano",
        duration: "7 Noches / 11 Días",
        description: "Salidas en enero y febrero desde la Terminal de Ómnibus a bordo de unidades de última generación de la empresa San Felipe con habilitación CNRT internacional.",
        long_description: "Balneario Camboriú, Brasil, es uno de los destinos turísticos más impresionantes de América del Sur. Con su costanera, el teleférico panorámico, el parque acuático, las excursiones a Bombinhas y el imperdible paseo pirata, garantiza una experiencia única para toda la familia.\n\nViajamos en unidades de última generación de San Felipe con habilitación CNRT internacional, un lujo de confort para 11 días de aventura. Nos alojamos en departamentos céntricos equipados a metros del mar y la peatonal, disponibles para 2 a 7 personas. Coordinadores permanentes te acompañan durante todo el viaje.",
        image_url: "https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&w=1920&q=90",
        gallery_images: [
            "https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
        ],
        price_info: "Salidas Enero y Febrero",
        whatsapp_text: "Hola! Me interesa el viaje a Camboriu",
        services: [
            "Micros San Felipe CNRT Internac.",
            "Deptos. Céntricos (2 a 7 personas)",
            "Excursiones Opc.: Pirata, Teleférico, Bombinhas"
        ],
        cost: 160000
    },
    {
        id: "default-sanrafael",
        name: "San Rafael - Mendoza",
        category: "invierno",
        duration: "3 Noches / 5 Días",
        description: "Salidas en vacaciones de julio desde la Terminal de Ómnibus a bordo de unidades de la empresa San Felipe con habilitación CNRT.",
        long_description: "San Rafael en invierno es una experiencia única: montañas nevadas, bodegas con degustación, circuitos de aventura y la calidez de la gente mendocina. Viajamos en vacaciones de julio con micros San Felipe (CNRT), alojándonos en cabañas equipadas (para 2 a 6 personas) en complejo con parque y juegos.\n\nEl paquete incluye media pensión completa con menús espectaculares y cenas de 3 pasos. Además, visitamos las mundialmente reconocidas bodegas de San Rafael, la fábrica de chocolates, Las Leñas y el Dique Valle Grande Reyunos. Un viaje que combina gastronomía, naturaleza y aventura.",
        image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1920&q=90",
        gallery_images: [
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
        ],
        price_info: "Salidas en Julio (Invierno)",
        whatsapp_text: "Hola! Me interesa el viaje a San Rafael",
        services: [
            "Micros San Felipe (CNRT)",
            "Cabañas con Media Pensión Completa",
            "Visitas: Bodegas, Chocolate, Leñas, Reyunos"
        ],
        cost: 98000
    },
    {
        id: "default-cataratas",
        name: "Cataratas Arg. + Brasileras",
        category: "invierno",
        duration: "3 Noches / 6 Días",
        description: "Salidas en invierno a bordo de unidades premium de la empresa San Felipe (CNRT habilitación internacional).",
        long_description: "Las Cataratas del Iguazú son una de las Siete Maravillas Naturales del Mundo y una experiencia que te cambia la vida. Con Rutas del Esteko descubrís ambos lados: el lado argentino con la imponente Garganta del Diablo, y el lado brasilero con su panorámica incomparable.\n\nViajamos en micros premium San Felipe con habilitación CNRT internacional, alojándonos en un hotel en Foz do Iguaçu con piscina y áreas verdes. El paquete incluye desayuno y cena buffet durante toda la estadía. Excursiones incluidas: compras en Ciudad del Este, Hito de las Tres Fronteras, Cataratas lado argentino y brasilero.",
        image_url: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1920&q=90",
        gallery_images: [
            "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1543158181-e6f9f6712055?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1564767655658-4e4f5e9c0a70?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=1200&q=80"
        ],
        price_info: "Salidas Temporada de Invierno",
        whatsapp_text: "Hola! Me interesa el viaje a Cataratas",
        services: [
            "Micros San Felipe CNRT Internac.",
            "Hotel c/ Piscina (Desayuno y Cena Buffet)",
            "Excursiones: Compras CDE, Hito, Cataratas Arg/Bra"
        ],
        cost: 92000
    }
];

// ============================================================
// ESTADO DEL LIGHTBOX
// ============================================================
let galleryImages = [];
let lightboxIndex = 0;

// ============================================================
// PUNTO DE ENTRADA
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    const destId = getDestinationIdFromURL();

    if (!destId) {
        renderError("No se especificó un destino.", "Por favor volvé al listado de destinos y seleccioná uno.");
        return;
    }

    // Aplicar config global (logo, etc.) desde caché
    applyGlobalConfig();

    // Cargar datos del destino
    const dest = await loadDestinationById(destId);

    if (!dest) {
        renderError(
            "Destino no encontrado",
            "No encontramos información para este destino. Por favor volvé al listado.",
            true
        );
        return;
    }

    // Renderizar toda la página
    renderDestinationPage(dest);

    // Paralaje suave del hero
    initHeroParallax();

    // Scroll progress bar
    initScrollProgress();

    // Ejecutar animaciones de entrada dinámicas
    animateDestPageEntrance();
});

// ============================================================
// HELPER: Leer ?id= de la URL
// ============================================================
function getDestinationIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || null;
}

// ============================================================
// CARGAR DESTINO POR ID
// ============================================================
async function loadDestinationById(id) {
    // 1. Intentar Firebase Firestore
    if (firestoreDb) {
        try {
            const doc = await firestoreDb.collection('landing_destinations').doc(id).get();
            if (doc.exists) {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            }
        } catch (e) {
            console.warn("[destino.js] Error consultando Firestore:", e);
        }
    }

    // 2. Intentar LocalStorage (caché del array completo)
    try {
        const cached = JSON.parse(localStorage.getItem('esteko_landing_destinations') || '[]');
        const found = cached.find(d => d.id === id);
        if (found) return found;
    } catch (e) { /* ignorar */ }

    // 3. Fallback a datos por defecto hardcodeados
    return DEFAULT_DESTINATIONS_DETAIL.find(d => d.id === id) || null;
}

// ============================================================
// APLICAR CONFIGURACIÓN GLOBAL (logo, whatsapp, etc.)
// ============================================================
function applyGlobalConfig() {
    try {
        const config = JSON.parse(localStorage.getItem('esteko_landing_config') || '{}');

        if (config.logo_header_url) {
            const el = document.querySelector('.navbar-logo-img');
            if (el) el.src = config.logo_header_url;
        }
        if (config.logo_footer_url) {
            const el = document.getElementById('dest-footer-logo');
            if (el) el.src = config.logo_footer_url;
        }

        // Redes sociales en footer
        if (config.instagram) {
            document.querySelectorAll('a[aria-label="Instagram"]').forEach(a => a.href = config.instagram);
        }
        if (config.facebook) {
            document.querySelectorAll('a[aria-label="Facebook"]').forEach(a => a.href = config.facebook);
        }
        if (config.tiktok) {
            document.querySelectorAll('a[aria-label="TikTok"]').forEach(a => a.href = config.tiktok);
        }
    } catch (e) { /* ignorar */ }
}

// ============================================================
// RENDERIZAR PÁGINA COMPLETA
// ============================================================
function renderDestinationPage(dest) {
    const phone = getWhatsappPhone();
    const waText = encodeURIComponent(dest.whatsapp_text || `Hola! Me interesa el viaje a ${dest.name}`);
    const waUrl  = `https://wa.me/54${phone}?text=${waText}`;

    // --- SEO / Título ---
    document.title = `${dest.name} | Rutas del Esteko`;
    setMeta('page-meta-desc', `Conocé todos los detalles del viaje a ${dest.name} con Rutas del Esteko. ${dest.duration}. ${dest.price_info}.`);
    setMeta('page-og-title', `${dest.name} | Rutas del Esteko`, true);

    // --- HERO ---
    const heroBg = document.getElementById('dest-hero-bg');
    if (heroBg) {
        heroBg.style.backgroundImage = `url('${dest.image_url || ''}')`;
    }

    // Badge de categoría
    const badgeEl = document.getElementById('dest-hero-badge');
    if (badgeEl) {
        const badgeLabel = { verano: '☀️ Verano', invierno: '❄️ Invierno', mas: '🌿 Escapada' };
        badgeEl.textContent = badgeLabel[dest.category] || dest.category;
        const badgeColors = { verano: 'var(--primary)', invierno: 'var(--accent)', mas: 'var(--secondary)' };
        badgeEl.style.background = badgeColors[dest.category] || 'var(--primary)';
    }

    setText('dest-hero-title', dest.name);
    setText('dest-breadcrumb-name', dest.name);

    const durationSpan = document.querySelector('#dest-hero-duration span');
    if (durationSpan) durationSpan.textContent = dest.duration;

    const seasonSpan = document.querySelector('#dest-hero-season span');
    if (seasonSpan) seasonSpan.textContent = dest.price_info;

    // --- WhatsApp links ---
    document.querySelectorAll('#dest-header-wa, #dest-cta-wa').forEach(el => {
        el.href = waUrl;
    });

    // --- CTA SIDEBAR ---
    setText('dest-cta-name', dest.name);

    const ctaBadge = document.getElementById('dest-cta-badge');
    if (ctaBadge) {
        const seasonText = { verano: '☀️ Temporada de Verano', invierno: '❄️ Temporada de Invierno', mas: '🌿 Escapada' };
        ctaBadge.querySelector('span').textContent = seasonText[dest.category] || dest.price_info;
        const icon = ctaBadge.querySelector('i');
        if (icon) {
            icon.className = dest.category === 'invierno' ? 'fa-solid fa-snowflake' : 
                             dest.category === 'mas'      ? 'fa-solid fa-leaf'      :
                                                            'fa-solid fa-sun';
        }
    }

    const ctaDuration = document.querySelector('#dest-cta-duration span');
    if (ctaDuration) ctaDuration.textContent = dest.duration;

    setText('dest-cta-price-info', dest.price_info);

    // Servicios en sidebar CTA
    const ctaServices = document.getElementById('dest-cta-services');
    if (ctaServices && dest.services) {
        ctaServices.innerHTML = dest.services.map(s =>
            `<li><i class="fa-solid fa-check"></i> ${s}</li>`
        ).join('');
    }

    // --- DESCRIPCIÓN LARGA ---
    const longDescEl = document.getElementById('dest-long-desc');
    if (longDescEl) {
        const rawText = dest.long_description || dest.description || '';
        const paras = rawText.split('\n\n').filter(p => p.trim());
        longDescEl.innerHTML = paras.map(p => `<p>${p.trim()}</p>`).join('');
    }

    // --- SERVICIOS (columna izquierda) ---
    const servicesList = document.getElementById('dest-services-list');
    if (servicesList && dest.services) {
        servicesList.innerHTML = dest.services.map(s =>
            `<li><i class="fa-solid fa-circle-check"></i> <span>${s}</span></li>`
        ).join('');
    }

    // --- GALERÍA ---
    const galleryImages_raw = dest.gallery_images || (dest.image_url ? [dest.image_url] : []);
    galleryImages = galleryImages_raw.filter(Boolean);
    renderGallery(galleryImages);

    // Inicializar lightbox
    initLightbox();
}

// ============================================================
// RENDERIZAR GALERÍA
// ============================================================
function renderGallery(images) {
    const grid = document.getElementById('dest-gallery-grid');
    if (!grid) return;

    if (!images || images.length === 0) {
        const block = document.getElementById('dest-gallery-block');
        if (block) block.style.display = 'none';
        return;
    }

    grid.innerHTML = '';

    const MAX_VISIBLE = 6;
    const visibleImages = images.slice(0, MAX_VISIBLE);

    visibleImages.forEach((imgUrl, idx) => {
        const item = document.createElement('div');
        item.className = 'dest-gallery-item';
        item.setAttribute('data-index', idx);
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `Ver foto ${idx + 1}`);

        const img = document.createElement('img');
        img.src = imgUrl;
        img.alt = `Foto ${idx + 1}`;
        img.loading = idx === 0 ? 'eager' : 'lazy';

        // Si es la última y hay más imágenes ocultas
        if (idx === MAX_VISIBLE - 1 && images.length > MAX_VISIBLE) {
            const moreOverlay = document.createElement('div');
            moreOverlay.className = 'dest-gallery-more';
            moreOverlay.innerHTML = `<span>+${images.length - MAX_VISIBLE}</span><small>más fotos</small>`;
            item.appendChild(img);
            item.appendChild(moreOverlay);
        } else {
            item.appendChild(img);
        }

        item.addEventListener('click', () => openLightbox(idx));
        item.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(idx); });

        grid.appendChild(item);
    });
}

// ============================================================
// LIGHTBOX
// ============================================================
function initLightbox() {
    const lb      = document.getElementById('dest-lightbox');
    const closeBtn= document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    if (!lb) return;

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', () => navigateLightbox(-1));
    nextBtn?.addEventListener('click', () => navigateLightbox(1));

    lb.addEventListener('click', e => {
        if (e.target === lb) closeLightbox();
    });

    document.addEventListener('keydown', e => {
        if (lb.style.display === 'none') return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index) {
    const lb = document.getElementById('dest-lightbox');
    if (!lb || !galleryImages.length) return;
    lightboxIndex = index;
    updateLightboxImage();
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('dest-lightbox');
    if (lb) lb.style.display = 'none';
    document.body.style.overflow = '';
}

function navigateLightbox(dir) {
    lightboxIndex = (lightboxIndex + dir + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const img     = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    if (img) img.src = galleryImages[lightboxIndex];
    if (counter) counter.textContent = `${lightboxIndex + 1} / ${galleryImages.length}`;
}

// ============================================================
// PARALLAX HERO (efecto suave al scroll)
// ============================================================
function initHeroParallax() {
    const heroBg = document.getElementById('dest-hero-bg');
    if (!heroBg) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return; // Skip parallax en mobile

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = document.getElementById('dest-hero')?.offsetHeight || 600;
        if (scrollY > heroHeight) return;
        const offset = scrollY * 0.35;
        heroBg.style.transform = `translateY(${offset}px) scale(1.06)`;
    }, { passive: true });
}

// ============================================================
// SCROLL PROGRESS BAR
// ============================================================
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const scrollTop  = window.scrollY;
        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        const percent    = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width  = percent + '%';
    }, { passive: true });
}

// ============================================================
// RENDER ERROR STATE
// ============================================================
function renderError(title, msg, showBack = true) {
    const main = document.getElementById('dest-main');
    if (!main) return;

    document.title = 'Destino no encontrado | Rutas del Esteko';

    main.innerHTML = `
        <div class="dest-error" style="grid-column: 1 / -1;">
            <i class="fa-solid fa-map-pin"></i>
            <h2>${title}</h2>
            <p>${msg}</p>
            ${showBack ? `<a href="index.html#temporadas" class="btn btn-primary" style="margin-top:28px; display:inline-flex; gap:8px;">
                <i class="fa-solid fa-arrow-left"></i> Ver todos los destinos
            </a>` : ''}
        </div>
    `;

    // Ocultar hero
    const hero = document.getElementById('dest-hero');
    if (hero) hero.style.display = 'none';
}

// ============================================================
// HELPERS
// ============================================================
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setMeta(id, content, isOg = false) {
    const el = document.getElementById(id);
    if (el) el.setAttribute('content', content);
}

function getWhatsappPhone() {
    try {
        const config = JSON.parse(localStorage.getItem('esteko_landing_config') || '{}');
        return config.whatsapp || '3855962089';
    } catch (e) {
        return '3855962089';
    }
}

// ============================================================
// ANIMATIONS & TYPEWRITER UTILS
// ============================================================
function runTypewriter(element, text, speed = 30) {
    if (!element) return;
    if (element.typewriterInterval) {
        clearInterval(element.typewriterInterval);
    }
    element.innerHTML = '<span class="typing-text"></span><span class="typing-cursor">|</span>';
    const textSpan = element.querySelector('.typing-text');
    const cursorSpan = element.querySelector('.typing-cursor');
    let index = 0;
    element.typewriterInterval = setInterval(() => {
        if (index < text.length) {
            textSpan.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(element.typewriterInterval);
            element.typewriterInterval = null;
            if (typeof gsap !== 'undefined') {
                gsap.to(cursorSpan, {
                    opacity: 0,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete: () => {
                        cursorSpan.remove();
                    }
                });
            } else {
                cursorSpan.remove();
            }
        }
    }, speed);
}

function triggerTypewriter(element, speed = 30) {
    if (!element) return;
    let text = element.dataset.originalText;
    if (!text) {
        text = element.textContent.trim();
        element.dataset.originalText = text;
    }
    runTypewriter(element, text, speed);
}

function animateDestPageEntrance() {
    const heroTitle = document.getElementById('dest-hero-title');
    if (heroTitle) {
        gsap.set(heroTitle, { opacity: 1, y: 0, animation: 'none' });
        triggerTypewriter(heroTitle, 25);
    }

    const leftCol = document.querySelector('.dest-info-col');
    const rightCol = document.querySelector('.dest-cta-col');
    if (leftCol && rightCol) {
        gsap.fromTo(leftCol,
            { opacity: 0, x: -80 },
            { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.1 }
        );
        gsap.fromTo(rightCol,
            { opacity: 0, x: 80 },
            { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.1 }
        );
    }

    const galleryItems = document.querySelectorAll('.dest-gallery-item');
    if (galleryItems.length > 0) {
        gsap.fromTo(galleryItems,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", delay: 0.4 }
        );
    }
}
