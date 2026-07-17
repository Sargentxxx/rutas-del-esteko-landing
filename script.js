/**
 * Rutas del Esteko - Landing Page Interactive Operations (Dynamic SPA Version)
 * Author: Antigravity Regiment (Agent 00 - General Commander)
 * Powered by: DeepSeek Strategy Design
 */

// ==========================================================================
// 1. CONFIGURACIÓN Y CLIENTE DE SUPABASE (PÚBLICO)
// ==========================================================================
let firestoreDb = null;
let isDbOnlinePublic = false;

// Datos por defecto (Semilla inicial) por si no existe conexión a la base de datos
const DEFAULT_DESTINATIONS = [
    {
        id: "default-mdp",
        name: "Mar del Plata Mágica",
        category: "verano",
        duration: "7 Noches / 10 Días",
        description: "Salidas durante la temporada de verano desde la Terminal de Ómnibus en unidades premium de la empresa San Felipe (habilitación CNRT). Estadía de 7 noches en departamentos céntricos equipados, cercanos a los principales atractivos y playas.",
        long_description: "Mar del Plata, la Perla del Atlántico, te espera con sus playas doradas, su vida nocturna inigualable y sus rincones turísticos para todos los gustos. Con Rutas del Esteko viajás con la tranquilidad de saber que cada detalle está planificado: salida desde la Terminal de Ómnibus de Santiago del Estero en unidades premium San Felipe con habilitación CNRT, coordinadores permanentes y departamentos céntricos y equipados a pasos de los mejores atractivos.\n\nIncluye coordinación permanente durante toda la estadía, asistencia ante cualquier eventualidad y la posibilidad de contratar excursiones opcionales como el Aquarium, la Catedral del Mar, el Casino, paseos en barco y mucho más. Una experiencia familiar y segura que ya disfrutaron miles de estekenses.",
        image_url: "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=600&q=80",
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
        description: "Salidas en enero y febrero desde la Terminal de Ómnibus a bordo de unidades de última generación de la empresa San Felipe con habilitación CNRT internacional. Estadía de 7 noches en departamentos equipados céntricos (2 a 7 personas) a metros del mar y la peatonal.",
        long_description: "Balneario Camboriú, Brasil, es uno de los destinos turísticos más impresionantes de América del Sur. Con su costanera, el teleférico panorámico, el parque acuático, las excursiones a Bombinhas y el imperdible paseo pirata, garantiza una experiencia única para toda la familia.\n\nViajamos en unidades de última generación de San Felipe con habilitación CNRT internacional, un lujo de confort para 11 días de aventura. Nos alojamos en departamentos céntricos equipados a metros del mar y la peatonal, disponibles para 2 a 7 personas. Coordinadores permanentes te acompañan durante todo el viaje.",
        image_url: "https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&w=600&q=80",
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
        description: "Salidas en vacaciones de julio desde la Terminal de Ómnibus a bordo de unidades de la empresa San Felipe con habilitación CNRT. Estadía en cabañas equipadas (2 a 6 pers.) en complejo con juegos y parque. Incluye media pensión con menús espectaculares y cenas de 3 pasos.",
        long_description: "San Rafael en invierno es una experiencia única: montañas nevadas, bodegas con degustación, circuitos de aventura y la calidez de la gente mendocina. Viajamos en vacaciones de julio con micros San Felipe (CNRT), alojándonos en cabañas equipadas (para 2 a 6 personas) en complejo con parque y juegos.\n\nEl paquete incluye media pensión completa con menús espectaculares y cenas de 3 pasos. Además, visitamos las mundialmente reconocidas bodegas de San Rafael, la fábrica de chocolates, Las Leñas y el Dique Valle Grande Reyunos. Un viaje que combina gastronomía, naturaleza y aventura.",
        image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
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
        description: "Salidas en invierno a bordo de unidades premium de la empresa San Felipe (CNRT habilitación internacional). Estadía en hotel en Foz do Iguaçu, Brasil con piscina y áreas verdes. Incluye desayuno y cena buffet durante la estadía para mayor confort.",
        long_description: "Las Cataratas del Iguazú son una de las Siete Maravillas Naturales del Mundo y una experiencia que te cambia la vida. Con Rutas del Esteko descubrís ambos lados: el lado argentino con la imponente Garganta del Diablo, y el lado brasilero con su panorámica incomparable.\n\nViajamos en micros premium San Felipe con habilitación CNRT internacional, alojándonos en un hotel en Foz do Iguaçu con piscina y áreas verdes. El paquete incluye desayuno y cena buffet durante toda la estadía. Excursiones incluidas: compras en Ciudad del Este, Hito de las Tres Fronteras, Cataratas lado argentino y brasilero.",
        image_url: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=600&q=80",
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

// Inicialización de Firebase (Compat Mode)
const firebaseConfig = {
    apiKey: "AIzaSyAxSpYY8iZXcLylJStFx2GD3Ejyzq_wy_U",
    authDomain: "rutas-del-esteko-landing.firebaseapp.com",
    projectId: "rutas-del-esteko-landing",
    storageBucket: "rutas-del-esteko-landing.firebasestorage.app",
    messagingSenderId: "583115096942",
    appId: "1:583115096942:web:62193426a24fdd0e19377f"
};

try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        firestoreDb = firebase.firestore();
    }
} catch (e) {
    console.warn("No se pudo iniciar Firebase en la landing page pública.", e);
}

// ==========================================================================
// 2. INICIO Y CARGA DINÁMICA DE CONTENIDO
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
    
    // Probar conexión e inicializar datos dinámicos
    await testConnectionAndLoadContent();

    // Registrar e inicializar efectos de GSAP & ScrollTrigger (Fase 2 Visual Upgrade)
    initHeroParallax();
    initScrollReveal();
    initNosotrosCarousel();
    initDestinationOverlayListeners();

    // 1. MOBILE MENU TOGGLE DRAWER
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = mobileToggle.querySelector('i');
    
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        
        if (isOpen) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-xmark');
            document.body.style.overflow = 'hidden';
        } else {
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    });

    function closeMobileMenu() {
        navMenu.classList.remove('open');
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
        document.body.style.overflow = '';
    }

    // 2. SPA ROUTER & VIEW SWITCHER (Tabs Navigation)
    const spaViews = document.querySelectorAll('.spa-view');

    let isTransitioning = false;
    const sectionOrder = ['inicio', 'nosotros', 'temporadas', 'educativo', 'fiesta', 'sorteos', 'pagos', 'unete', 'contacto'];

    // ============================================================
    // TYPEWRITER ANIMATION UTILS (Scoped to DOMContentLoaded)
    // ============================================================
    function runTypewriter(element, text, speed = 30) {
        if (!element) return;
        if (element.typewriterInterval) {
            clearInterval(element.typewriterInterval);
        }
        element.innerHTML = '';
        const textNode = document.createTextNode('');
        element.appendChild(textNode);
        
        let index = 0;
        element.typewriterInterval = setInterval(() => {
            if (index < text.length) {
                textNode.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(element.typewriterInterval);
                element.typewriterInterval = null;
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

    // Expose triggerTypewriter globally for overlay/other files
    window.triggerTypewriterGlobal = triggerTypewriter;

    function animateViewEntrance(viewId) {
        const view = document.getElementById('view-' + viewId);
        if (!view) return;

        // Target elements inside the active view
        const sectionTag = view.querySelector('.section-tag');
        const h2 = view.querySelector('.section-header h2, .sorteos-content h2');
        const heroTitle = view.querySelector('.hero-title');
        const subtitle = view.querySelector('.section-subtitle, .sorteos-content > p');
        const headerLine = view.querySelector('.header-line');
        
        // Clear any running tweens on these elements
        gsap.killTweensOf([sectionTag, h2, heroTitle, subtitle, headerLine]);

        const tl = gsap.timeline();

        if (sectionTag) {
            tl.fromTo(sectionTag, 
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
        }
        
        // Typewriter title effects
        if (heroTitle) {
            gsap.set(heroTitle, { opacity: 1, y: 0, scale: 1 });
            triggerTypewriter(heroTitle, 20);
        }
        
        if (h2) {
            gsap.set(h2, { opacity: 1, y: 0, scale: 1 });
            triggerTypewriter(h2, 30);
        }

        if (headerLine) {
            tl.fromTo(headerLine,
                { width: 0 },
                { width: "80px", duration: 0.5, ease: "power2.inOut" },
                sectionTag ? "-=0.25" : "0"
            );
        }

        if (subtitle) {
            tl.fromTo(subtitle,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
                "-=0.3"
            );
        }
    }

    function switchView(hash) {
        const viewId = hash.replace('#', '') || 'inicio';
        const targetViewElement = document.getElementById('view-' + viewId);

        if (targetViewElement) {
            // Evitar doble transición
            const currentActiveView = document.querySelector('.spa-view.active-view');
            if (currentActiveView === targetViewElement) return;

            // Determinar dirección del deslizamiento
            const oldIndex = currentActiveView ? sectionOrder.indexOf(currentActiveView.id.replace('view-', '')) : -1;
            const newIndex = sectionOrder.indexOf(viewId);
            const direction = newIndex > oldIndex ? 1 : -1; // 1 = adelante (izquierda), -1 = atrás (derecha)

            // Si hay animaciones activas en las vistas, detenerlas
            gsap.killTweensOf('.spa-view');

            // Actualizar menú activo
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + viewId) {
                    link.classList.add('active');
                }
            });

            // En secciones distintas a 'inicio', removemos la transparencia de la barra para legibilidad
            const mainHeader = document.getElementById('main-header');
            if (mainHeader) {
                if (viewId === 'inicio') {
                    mainHeader.classList.remove('solid-header');
                } else {
                    mainHeader.classList.add('solid-header');
                }
            }

            closeMobileMenu();

            const tl = gsap.timeline({
                onStart: () => {
                    isTransitioning = true;
                    // Ir al inicio de la página instantáneamente antes de empezar
                    window.scrollTo({ top: 0, behavior: 'instant' });
                },
                onComplete: () => {
                    isTransitioning = false;
                    // Refrescar ScrollTrigger para recalcular alturas
                    if (typeof ScrollTrigger !== "undefined") {
                        ScrollTrigger.refresh();
                    }
                }
            });

            if (currentActiveView) {
                // Hacer absoluta la sección saliente para que no empuje hacia abajo a la entrante
                gsap.set(currentActiveView, {
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    left: 0,
                    zIndex: 1
                });

                // Preparar e inyectar inmediatamente la sección entrante en el flujo para mantener la altura y que el footer no suba
                gsap.set(targetViewElement, {
                    display: 'block',
                    position: 'relative',
                    opacity: 0,
                    x: 60 * direction,
                    zIndex: 2
                });

                // Desvanecer y deslizar la sección saliente
                tl.to(currentActiveView, {
                    opacity: 0,
                    x: -60 * direction,
                    duration: 0.45,
                    ease: "power2.inOut",
                    onComplete: () => {
                        currentActiveView.classList.remove('active-view');
                        // Ocultar físicamente de la pantalla y limpiar estilos
                        gsap.set(currentActiveView, { 
                            display: 'none', 
                            x: 0,
                            position: '',
                            width: '',
                            top: '',
                            left: '',
                            zIndex: ''
                        });
                    }
                }, 0);

                // Animar la sección entrante
                tl.to(targetViewElement, {
                    opacity: 1,
                    x: 0,
                    duration: 0.55,
                    ease: "power2.out",
                    onStart: () => {
                        targetViewElement.classList.add('active-view');
                        animateViewEntrance(viewId);
                    },
                    onComplete: () => {
                        // Limpiar estilos temporales
                        gsap.set(targetViewElement, {
                            position: '',
                            zIndex: '',
                            x: ''
                        });
                        // Iniciar animaciones de elementos DESPUÉS de que la vista sea visible
                        setupViewScrollTriggers(viewId);
                    }
                }, 0.1); // Pequeño delay de 0.1s para un cruce ultra suave
            } else {
                // Primera carga: simple fade-in sin deslizamiento
                tl.set(targetViewElement, { display: 'block', opacity: 0 });
                tl.to(targetViewElement, {
                    opacity: 1,
                    duration: 0.6,
                    ease: "power2.out",
                    onStart: () => {
                        targetViewElement.classList.add('active-view');
                        animateViewEntrance(viewId);
                    },
                    onComplete: () => {
                        setupViewScrollTriggers(viewId);
                    }
                });
            }
        }
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                // Permitir enlaces a nuevas pestañas
                if (link.getAttribute('target') === '_blank') {
                    return;
                }
                e.preventDefault();
                const hash = href;
                history.pushState(null, null, hash);
                switchView(hash);
            }
        }
    });

    window.addEventListener('popstate', () => {
        switchView(window.location.hash);
    });

    switchView(window.location.hash);

    // 3. STICKY HEADER SCROLL EFFECT
    const mainHeader = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // 3b. SCROLL PROGRESS READING BAR (Taste-Skill Feature)
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    });

    // 4. MARQUEE EFFECT BUFFER & HOVER PAUSE (Taste-Skill Feature)
    const marqueeText = document.querySelector('.marquee-text');
    if (marqueeText) {
        const doubleContent = marqueeText.innerHTML + " &nbsp;•&nbsp; " + marqueeText.innerHTML;
        marqueeText.innerHTML = doubleContent;
        
        // Pausar rotación en hover
        marqueeText.addEventListener('mouseenter', () => {
            marqueeText.style.animationPlayState = 'paused';
        });
        marqueeText.addEventListener('mouseleave', () => {
            marqueeText.style.animationPlayState = 'running';
        });
    }

    // 4b. SPOTLIGHT BORDER EVENT DELEGATION (Taste-Skill Feature)
    const destinationsGrid = document.getElementById('destinations-grid');
    if (destinationsGrid) {
        destinationsGrid.addEventListener('mousemove', (e) => {
            const card = e.target.closest('.destination-card');
            if (card && !card.classList.contains('destination-card-skeleton')) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }
        });
    }
});

// ==========================================================================
// 3. RECUPERACIÓN DE DATOS (NUBE O CACHÉ DE EMERGENCIA)
// ==========================================================================
async function testConnectionAndLoadContent() {
    if (firestoreDb) {
        try {
            const doc = await firestoreDb.collection('landing_sections').doc('hero').get();
            if (doc.exists) {
                isDbOnlinePublic = true;
            }
        } catch (e) {
            isDbOnlinePublic = false;
        }
    }

    // 1. Cargar y aplicar textos de secciones
    await loadAndApplySections();

    // 2. Cargar y renderizar catálogo de viajes y configuraciones
    await loadAndApplyDestinationsAndConfig();

    // 3. Cargar y renderizar galerías de fotos escolares/fiestas
    await loadAndApplyGalleries();

    // 4. Inicializar los Leads Forms
    initLeadFormSubmission();
    
    // 5. Inicializar el formulario de CV
    initCVFormSubmission();

    // 6. Cargar opiniones de Google Maps
    await loadGoogleReviews();
}

// Aplicar textos dinámicos
async function loadAndApplySections() {
    let sections = null;

    if (isDbOnlinePublic && firestoreDb) {
        try {
            const snapshot = await firestoreDb.collection('landing_sections').get();
            if (!snapshot.empty) {
                sections = {};
                snapshot.forEach(doc => {
                    const data = doc.data();
                    sections[doc.id] = {
                        title: data.title || '',
                        subtitle: data.subtitle || '',
                        content: data.content || '',
                        image_url: data.image_url || '',
                        extra_data: data.extra_data || {}
                    };
                });
                localStorage.setItem('esteko_landing_sections', JSON.stringify(sections));
            }
        } catch (e) {
            console.warn("Fallo cargando secciones de la nube, usando caché.", e);
        }
    }

    if (!sections) {
        sections = JSON.parse(localStorage.getItem('esteko_landing_sections'));
    }

    if (!sections) return; // No hay datos aún

    // Aplicar textos en el HTML
    // Hero
    if (sections.hero) {
        const hTitle = document.querySelector('.hero-title');
        const hText = document.querySelector('.hero-text');

        if (hTitle) {
            hTitle.textContent = sections.hero.title || '';
            hTitle.style.display = sections.hero.title ? 'block' : 'none';
        }
        if (hText) {
            hText.textContent = sections.hero.content || '';
            hText.style.display = sections.hero.content ? 'block' : 'none';
        }

        // Inicializar Carrusel Dinámico
        let heroImages = [];
        if (sections.hero.extra_data && sections.hero.extra_data.hero_images) {
            heroImages = sections.hero.extra_data.hero_images;
        }
        initializeHeroCarousel(heroImages);
    }

    // Nosotros
    if (sections.nosotros) {
        const nTitle = document.querySelector('.nosotros h2');
        const nContentWrapper = document.querySelector('.nosotros-content');
        const nImage = document.querySelector('.main-photo img');

        if (nTitle) {
            nTitle.textContent = sections.nosotros.title || '';
            nTitle.style.display = sections.nosotros.title ? 'block' : 'none';
        }
        const nTag = document.getElementById('nosotros-tag');
        if (nTag) {
            nTag.textContent = sections.nosotros.subtitle || '';
            nTag.style.display = sections.nosotros.subtitle ? 'inline-block' : 'none';
        }
        
        // Re-escribir párrafos
        if (nContentWrapper && sections.nosotros.content) {
            const paras = sections.nosotros.content.split('\n\n');
            let parasHtml = `<h3>Agencia de Viajes y Turismo</h3>`;
            paras.forEach(p => {
                if (p.trim()) parasHtml += `<p>${p.trim()}</p>`;
            });
            
            // Re-inyectar la tarjeta legal y las viñetas que estaban abajo
            const minturCard = document.querySelector('.mintur-safety-card');
            const featuresList = document.querySelector('.features-list');
            
            nContentWrapper.innerHTML = parasHtml;
            if (minturCard) nContentWrapper.appendChild(minturCard);
            if (featuresList) nContentWrapper.appendChild(featuresList);
        }

        if (nImage && sections.nosotros.image_url) nImage.src = sections.nosotros.image_url;

        // Nosotros sub-photos rendering
        if (sections.nosotros.extra_data) {
            const subPhoto1 = document.querySelector('.sub-photo-1 img');
            const subPhoto2 = document.querySelector('.sub-photo-2 img');
            if (subPhoto1 && sections.nosotros.extra_data.sub_photo_1) {
                subPhoto1.src = sections.nosotros.extra_data.sub_photo_1;
            }
            if (subPhoto2 && sections.nosotros.extra_data.sub_photo_2) {
                subPhoto2.src = sections.nosotros.extra_data.sub_photo_2;
            }
            
            // Slogan Year and Text
            const sloganYear = document.getElementById('nosotros-badge-year');
            const sloganText = document.getElementById('nosotros-badge-text');
            if (sloganYear && sections.nosotros.extra_data.slogan_year) {
                sloganYear.textContent = sections.nosotros.extra_data.slogan_year;
            }
            if (sloganText && sections.nosotros.extra_data.slogan_text) {
                sloganText.textContent = sections.nosotros.extra_data.slogan_text;
            }
            
            // 3 bullet phrases
            const bullet1 = document.getElementById('nosotros-bullet-1-text');
            const bullet2 = document.getElementById('nosotros-bullet-2-text');
            const bullet3 = document.getElementById('nosotros-bullet-3-text');
            if (bullet1 && sections.nosotros.extra_data.bullet_1) {
                bullet1.textContent = sections.nosotros.extra_data.bullet_1;
            }
            if (bullet2 && sections.nosotros.extra_data.bullet_2) {
                bullet2.textContent = sections.nosotros.extra_data.bullet_2;
            }
            if (bullet3 && sections.nosotros.extra_data.bullet_3) {
                bullet3.textContent = sections.nosotros.extra_data.bullet_3;
            }
        }
    }

    // La Fiesta
    if (sections.fiesta) {
        const fTitle = document.querySelector('.fiesta h2');
        const fImage1 = document.getElementById('fiesta-img-1');
        const fImage2 = document.getElementById('fiesta-img-2');
        const fContentWrapper = document.querySelector('.fiesta-content');

        if (fTitle) {
            fTitle.textContent = sections.fiesta.title || '';
            fTitle.style.display = sections.fiesta.title ? 'block' : 'none';
        }
        const fTag = document.getElementById('fiesta-tag');
        if (fTag) {
            fTag.textContent = sections.fiesta.subtitle || '';
            fTag.style.display = sections.fiesta.subtitle ? 'inline-block' : 'none';
        }
        if (fImage1 && sections.fiesta.image_url) fImage1.src = sections.fiesta.image_url;
        if (fImage2 && sections.fiesta.extra_data?.sub_photo_2) {
            fImage2.src = sections.fiesta.extra_data.sub_photo_2;
            fImage2.style.display = 'block';
        } else if (fImage2) {
            fImage2.src = "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80";
        }
        
        if (fContentWrapper && sections.fiesta.content) {
            const paras = sections.fiesta.content.split('\n\n');
            const historyTitle = (sections.fiesta.extra_data && sections.fiesta.extra_data.history_title) 
                                 ? sections.fiesta.extra_data.history_title 
                                 : 'Tradición, Música y Experiencias Inolvidables';
            let parasHtml = `<h3>${historyTitle}</h3>`;
            paras.forEach(p => {
                if (p.trim()) parasHtml += `<p>${p.trim()}</p>`;
            });
            
            const quote = document.querySelector('.fiesta-quote');
            if (quote && sections.fiesta.extra_data) {
                const quoteP = quote.querySelector('p');
                const quoteCite = quote.querySelector('cite');
                if (quoteP && sections.fiesta.extra_data.quote_text) quoteP.innerHTML = sections.fiesta.extra_data.quote_text;
                if (quoteCite && sections.fiesta.extra_data.quote_cite) quoteCite.textContent = sections.fiesta.extra_data.quote_cite;
            }
            
            const perks = document.querySelector('.fiesta-perks');
            
            fContentWrapper.innerHTML = parasHtml;
            if (quote) fContentWrapper.appendChild(quote);
            if (perks) fContentWrapper.appendChild(perks);
        }
    }

    // Educativo
    if (sections.educativo) {
        const eTitle = document.querySelector('.educativo .section-header h2');
        const eTag = document.getElementById('educativo-tag');
        const eImage = document.querySelector('.edu-img');
        const eContentWrapper = document.querySelector('.educativo-content');

        if (eTitle) {
            eTitle.textContent = sections.educativo.title || '';
            eTitle.style.display = sections.educativo.title ? 'block' : 'none';
        }
        if (eTag) {
            eTag.innerHTML = sections.educativo.subtitle ? `<i class="fa-solid fa-graduation-cap"></i> ${sections.educativo.subtitle}` : '';
            eTag.style.display = sections.educativo.subtitle ? 'inline-block' : 'none';
        }
        if (eImage && sections.educativo.image_url) eImage.src = sections.educativo.image_url;
        
        if (eContentWrapper && sections.educativo.content) {
            const paras = sections.educativo.content.split('\n\n');
            let parasHtml = '';
            paras.forEach(p => {
                if (p.trim()) parasHtml += `<p class="edu-intro">${p.trim()}</p>`;
            });

            const features = document.querySelector('.edu-features');
            if (features && sections.educativo.extra_data) {
                const featItems = features.querySelectorAll('.edu-feat-item');
                if (featItems.length >= 2) {
                    const feat1 = featItems[0];
                    const feat2 = featItems[1];
                    if (sections.educativo.extra_data.feat_1_title) feat1.querySelector('h5').textContent = sections.educativo.extra_data.feat_1_title;
                    if (sections.educativo.extra_data.feat_1_desc) feat1.querySelector('p').textContent = sections.educativo.extra_data.feat_1_desc;
                    if (sections.educativo.extra_data.feat_2_title) feat2.querySelector('h5').textContent = sections.educativo.extra_data.feat_2_title;
                    if (sections.educativo.extra_data.feat_2_desc) feat2.querySelector('p').textContent = sections.educativo.extra_data.feat_2_desc;
                }
            }

            const btn = document.querySelector('.btn-edu');

            eContentWrapper.innerHTML = parasHtml;
            if (features) eContentWrapper.appendChild(features);
            if (btn) eContentWrapper.appendChild(btn);
        }
    }

    // Sorteos
    if (sections.sorteos) {
        const sTitle = document.querySelector('.sorteos-content h2');
        const sContentWrapper = document.querySelector('.sorteos-content > p');
        const sBanner = document.querySelector('.sorteos-banner');

        if (sTitle) {
            sTitle.textContent = sections.sorteos.title || '';
            sTitle.style.display = sections.sorteos.title ? 'block' : 'none';
        }
        const sTag = document.getElementById('sorteos-tag');
        if (sTag) {
            sTag.innerHTML = sections.sorteos.subtitle ? `<i class="fa-solid fa-ticket"></i> ${sections.sorteos.subtitle}` : '';
            sTag.style.display = sections.sorteos.subtitle ? 'inline-block' : 'none';
        }
        if (sContentWrapper && sections.sorteos.content) sContentWrapper.textContent = sections.sorteos.content;
        if (sBanner && sections.sorteos.image_url) {
            sBanner.style.backgroundImage = `url('${sections.sorteos.image_url}')`;
        }

        // Render step cards dynamically
        const extra = sections.sorteos.extra_data || {};
        const c1Num = document.getElementById('sorteos-card1-num');
        const c1Title = document.getElementById('sorteos-card1-title');
        const c1Desc = document.getElementById('sorteos-card1-desc');
        const c2Num = document.getElementById('sorteos-card2-num');
        const c2Title = document.getElementById('sorteos-card2-title');
        const c2Desc = document.getElementById('sorteos-card2-desc');
        const c3Num = document.getElementById('sorteos-card3-num');
        const c3Title = document.getElementById('sorteos-card3-title');
        const c3Desc = document.getElementById('sorteos-card3-desc');

        if (c1Num) c1Num.textContent = extra.card1_num || "01";
        if (c1Title) c1Title.textContent = extra.card1_title || "Seguinos";
        if (c1Desc) c1Desc.innerHTML = extra.card1_desc || `Dale follow a nuestro <a href="https://www.instagram.com/rutasdelesteko.sde/" target="_blank">Instagram oficial</a>.`;

        if (c2Num) c2Num.textContent = extra.card2_num || "02";
        if (c2Title) c2Title.textContent = extra.card2_title || "Registrate";
        if (c2Desc) c2Desc.innerHTML = extra.card2_desc || `Ingresá tu correo en el <a href="#contacto" class="raffle-link-contacto">formulario</a> de la pestaña Contacto.`;

        if (c3Num) c3Num.textContent = extra.card3_num || "03";
        if (c3Title) c3Title.textContent = extra.card3_title || "¡Participá!";
        if (c3Desc) c3Desc.innerHTML = extra.card3_desc || `Ya estás en la base de sorteos mensuales de viajes.`;
    }

    // Pagos (Medios de Pago)
    if (sections.pagos) {
        const pTag = document.querySelector('.pagos .section-tag');
        const pTitle = document.querySelector('.pagos .section-header h2');
        const pSubtitle = document.querySelector('.pagos .section-subtitle');
        const pInfoTitle = document.querySelector('.pagos-info h3');
        const pInfoContent = document.querySelector('.pagos-info > p');

        if (pTag) {
            pTag.textContent = sections.pagos.extra_data?.section_tag || '';
            pTag.style.display = sections.pagos.extra_data?.section_tag ? 'inline-block' : 'none';
        }
        if (pTitle) {
            pTitle.textContent = sections.pagos.title || '';
            pTitle.style.display = sections.pagos.title ? 'block' : 'none';
        }
        if (pSubtitle) {
            pSubtitle.textContent = sections.pagos.subtitle || '';
            pSubtitle.style.display = sections.pagos.subtitle ? 'block' : 'none';
        }
        if (pInfoTitle && sections.pagos.extra_data?.info_title) {
            pInfoTitle.textContent = sections.pagos.extra_data.info_title;
        }
        if (pInfoContent && sections.pagos.content) {
            pInfoContent.textContent = sections.pagos.content;
        }

        const cards = document.querySelectorAll('.payment-methods-grid .method-card');
        const extra = sections.pagos.extra_data || {};
        
        if (cards.length >= 4) {
            // Card 1
            const c1Icon = cards[0].querySelector('.method-icon i');
            const c1Title = cards[0].querySelector('h4');
            const c1Desc = cards[0].querySelector('p');
            if (c1Icon && extra.card1_icon) c1Icon.className = `fa-solid ${extra.card1_icon}`;
            if (c1Title && extra.card1_title) c1Title.textContent = extra.card1_title;
            if (c1Desc && extra.card1_desc) c1Desc.innerHTML = extra.card1_desc;

            // Card 2
            const c2Icon = cards[1].querySelector('.method-icon i');
            const c2Title = cards[1].querySelector('h4');
            const c2Desc = cards[1].querySelector('p');
            if (c2Icon && extra.card2_icon) c2Icon.className = `fa-solid ${extra.card2_icon}`;
            if (c2Title && extra.card2_title) c2Title.textContent = extra.card2_title;
            if (c2Desc && extra.card2_desc) c2Desc.innerHTML = extra.card2_desc;

            // Card 3
            const c3Icon = cards[2].querySelector('.method-icon i');
            const c3Title = cards[2].querySelector('h4');
            const c3Desc = cards[2].querySelector('p');
            if (c3Icon && extra.card3_icon) c3Icon.className = `fa-solid ${extra.card3_icon}`;
            if (c3Title && extra.card3_title) c3Title.textContent = extra.card3_title;
            if (c3Desc && extra.card3_desc) c3Desc.innerHTML = extra.card3_desc;

            // Card 4
            const c4Icon = cards[3].querySelector('.method-icon i');
            const c4Title = cards[3].querySelector('h4');
            const c4Desc = cards[3].querySelector('p');
            if (c4Icon && extra.card4_icon) c4Icon.className = `fa-solid ${extra.card4_icon}`;
            if (c4Title && extra.card4_title) c4Title.textContent = extra.card4_title;
            if (c4Desc && extra.card4_desc) c4Desc.innerHTML = extra.card4_desc;
        }
    }
}

function initializeHeroCarousel(images) {
    const sliderContainer = document.getElementById('hero-slider');
    if (!sliderContainer) return;

    // Solo una imagen neutra de excelente resolución como respaldo (ruta escénica en cañón)
    const defaultImages = [
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
    ];

    const finalImages = (images && images.length > 0) ? images : defaultImages;

    sliderContainer.innerHTML = '';
    finalImages.forEach((imgUrl, index) => {
        const slide = document.createElement('div');
        slide.className = `hero-slide${index === 0 ? ' active' : ''}`;
        slide.style.backgroundImage = `linear-gradient(135deg, rgba(15, 10, 10, 0.12), rgba(15, 10, 10, 0.02)), url('${imgUrl}')`;
        sliderContainer.appendChild(slide);
    });

    let currentSlide = 0;
    const slides = sliderContainer.querySelectorAll('.hero-slide');
    
    if (slides.length <= 1) return;

    if (window.heroCarouselInterval) {
        clearInterval(window.heroCarouselInterval);
    }

    window.heroCarouselInterval = setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}

// Aplicar catálogo y simulador
function parseDestDescription(dest) {
    let parsed = { short: dest.description || '', long: dest.long_description || '', gallery: dest.gallery_images || [] };
    if (dest.description && dest.description.trim().startsWith('{')) {
        try {
            const parsedJson = JSON.parse(dest.description);
            parsed.short = parsedJson.short || '';
            parsed.long = parsedJson.long || '';
            parsed.gallery = parsedJson.gallery || [];
        } catch (e) {
            console.warn("Error parsing description JSON:", e);
        }
    }
    return parsed;
}

async function loadAndApplyDestinationsAndConfig() {
    let destinations = null;
    let config = null;

    // 1. Cargar Configuración General
    if (isDbOnlinePublic && firestoreDb) {
        try {
            const snapshot = await firestoreDb.collection('landing_config').get();
            if (!snapshot.empty) {
                config = {};
                snapshot.forEach(doc => {
                    config[doc.id] = doc.data().value;
                });
                localStorage.setItem('esteko_landing_config', JSON.stringify(config));
            }
        } catch (e) {
            console.warn("Fallo de red al leer configuraciones.", e);
        }
    }

    if (!config) {
        config = JSON.parse(localStorage.getItem('esteko_landing_config'));
    }

    // Aplicar config de legajos, email, whatsapp y redes
    if (config) {
        applyGlobalConfigVars(config);
        window.globalWhatsappPhone = config.whatsapp || '3855962089';
    } else {
        window.globalWhatsappPhone = '3855962089';
    }

    // 2. Cargar catálogo de destinos
    if (isDbOnlinePublic && firestoreDb) {
        try {
            const snapshot = await firestoreDb.collection('landing_destinations').orderBy('created_at', 'asc').get();
            if (!snapshot.empty) {
                destinations = [];
                snapshot.forEach(doc => {
                    destinations.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                localStorage.setItem('esteko_landing_destinations', JSON.stringify(destinations));
            }
        } catch (e) {
            console.warn("Fallo leyendo destinos de Firestore, usando local.", e);
        }
    }

    if (!destinations) {
        destinations = JSON.parse(localStorage.getItem('esteko_landing_destinations'));
    }

    if (!destinations) return; // Nada que renderizar

    // Unpack descriptions and gallery images from JSON if needed
    destinations = destinations.map(d => {
        const parsedDesc = parseDestDescription(d);
        return {
            ...d,
            description: parsedDesc.short,
            long_description: parsedDesc.long,
            gallery_images: parsedDesc.gallery
        };
    });

    window.publicDestinationsList = destinations;

    // Renderizar catálogo en el frontend público
    renderPublicCatalogGrid(destinations, config);

    // Renderizar destinos favoritos (más elegidos) del panel
    renderPublicDestinosMasElegidos(destinations, config);

    // Inicializar filtros del catálogo
    initTripFilters();

    // Inicializar el Simulador de Ahorro
    initSavingsSimulator(destinations, config);
}

function applyGlobalConfigVars(config) {
    // Correo
    const emailEls = document.querySelectorAll('.footer-about p, .top-bar-content span'); // O reemplazar selectores específicos
    // Legajo badge
    const badgeEl = document.querySelector('.registration-badge');
    if (badgeEl && config.legajo) {
        badgeEl.innerHTML = `<i class="fa-solid fa-shield-halved"></i> Legajo Oficial N° ${config.legajo} - 
                            <a href="https://www.agenciasdeviajes.ar/agencias/6QezBnKQ" target="_blank" class="top-bar-link">Buscador Nacional de Agencias <i class="fa-solid fa-qrcode" style="margin-left: 2px;" title="Verificar Habilitación Oficial (QR)"></i></a>`;
    }

    // WhatsApp enlaces dinámicos
    if (config.whatsapp) {
        const waLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
        waLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const currentText = href.split('?text=')[1] || '';
                link.setAttribute('href', `https://wa.me/54${config.whatsapp}${currentText ? '?text=' + currentText : ''}`);
            }
        });
    }

    // Redes Sociales enlaces
    const fbLinks = document.querySelectorAll('a[aria-label*="Facebook"], a[href*="facebook"]');
    const igLinks = document.querySelectorAll('a[aria-label*="Instagram"], a[href*="instagram"]');
    const tkLinks = document.querySelectorAll('a[aria-label*="TikTok"], a[href*="tiktok"]');

    if (config.facebook) fbLinks.forEach(link => link.setAttribute('href', config.facebook));
    if (config.instagram) igLinks.forEach(link => {
        link.setAttribute('href', config.instagram);
        // Si tiene el texto descriptivo del link
        if (link.textContent.includes('@')) {
            const handle = config.instagram.split('instagram.com/')[1]?.replace('/', '') || 'rutasdelesteko.sde';
            link.innerHTML = `<i class="fa-brands fa-instagram"></i> Ir a Instagram @${handle}`;
        }
    });
    if (config.tiktok) tkLinks.forEach(link => link.setAttribute('href', config.tiktok));

    // Aplicar logos e imágenes globales de la landing
    if (config.logo_header_url) {
        const headerLogoImg = document.querySelector('.navbar-logo-img');
        if (headerLogoImg) headerLogoImg.src = config.logo_header_url;
    }
    if (config.logo_footer_url) {
        const footerLogoImg = document.querySelector('.footer-logo-img');
        if (footerLogoImg) footerLogoImg.src = config.logo_footer_url;
        const sidebarLogoImg = document.querySelector('.sidebar-logo'); // Para sincronizar logo lateral en el panel admin
        if (sidebarLogoImg) sidebarLogoImg.src = config.logo_footer_url;
    }
    if (config.badge_reviews_url) {
        const badgeReviewsImg = document.querySelector('.reviews-badge-img');
        if (badgeReviewsImg) badgeReviewsImg.src = config.badge_reviews_url;
    }
    if (config.qr_mintur_url) {
        const qrMinturImg = document.querySelector('.mintur-qr-img');
        if (qrMinturImg) qrMinturImg.src = config.qr_mintur_url;
        
        const footerQrImg = document.querySelector('.footer-qr-img');
        if (footerQrImg) footerQrImg.src = config.qr_mintur_url;
    }
}

function renderPublicCatalogGrid(destinations, config) {
    const grid = document.getElementById('destinations-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    destinations.forEach((dest, index) => {
        const isInactive = dest.is_active === false;
        const card = document.createElement('div');
        card.className = `destination-card animate-fade-in${isInactive ? ' card-disabled' : ''}`;
        card.setAttribute('data-category', dest.category);
        card.id = `card-dynamic-${dest.id}`;
        
        // Estilo de delay escalonado para efecto cascada (Taste-Skill Feature)
        card.style.animationDelay = `${index * 120}ms`;

        // Generar viñetas de servicios
        let servicesHtml = '';
        if (dest.services) {
            dest.services.forEach(serv => {
                servicesHtml += `<li><i class="fa-solid fa-check" style="color:var(--primary); margin-right:8px;"></i> ${serv}</li>`;
            });
        }

        const waText = encodeURIComponent(dest.whatsapp_text || `Hola! Me interesa el viaje a ${dest.name}`);
        const phone = config?.whatsapp || '3855962089';

        card.innerHTML = `
            <div class="card-image" style="cursor: pointer;" onclick="openDestinationOverlay('${dest.id}')">
                <img src="${dest.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=500&q=80'}" alt="${dest.name}">
                <div class="card-image-overlay"></div>
                ${dest.is_oferta ? `<span class="card-badge badge-offer" style="background-color: var(--accent); top: 15px; left: 15px; z-index: 10;">🔥 ${config.descuento_oferta || 15}% OFF</span>` : ''}
                ${isInactive ? `<span class="card-badge badge-inactive" style="background-color: #7f8c8d; top: 15px; right: 15px; z-index: 10; font-weight: bold;"><i class="fa-solid fa-ban"></i> No Disponible</span>` : ''}
                <span class="card-badge badge-${dest.category === 'verano' ? 'summer' : dest.category === 'invierno' ? 'winter' : 'escape'}">${dest.category}</span>
            </div>
            <div class="card-body">
                <span class="card-duration"><i class="fa-solid fa-clock"></i> ${dest.duration}</span>
                <h3>${dest.name}</h3>
                <p class="card-desc">${dest.description}</p>
                <ul class="card-services" style="list-style:none;">
                    ${servicesHtml}
                </ul>
                <div class="card-footer">
                    <span class="price-info">${dest.price_info}</span>
                    <div class="card-footer-actions">
                        ${isInactive ? 
                          `<span class="btn-card btn-card-disabled">No Disponible <i class="fa-solid fa-ban"></i></span>` : 
                          `<a href="https://wa.me/54${phone}?text=${waText}" target="_blank" class="btn-card-wa" title="Consultar por WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>`
                        }
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function initTripFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const destinationCards = document.querySelectorAll('.destination-card');

    filterButtons.forEach(btn => {
        // Clonar para remover listeners anteriores si existieran
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            newBtn.classList.add('active');

            const filterValue = newBtn.getAttribute('data-filter');

            document.querySelectorAll('.destination-card').forEach(card => {
                const category = card.getAttribute('data-category');
                
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
                    }, 300);
                }
            });
        });
    });
}

function initSavingsSimulator(destinations, config) {
    const selectDestiny = document.getElementById('sim-destiny');
    const selectInstallments = document.getElementById('sim-installments');
    const totalVal = document.getElementById('sim-total-val');
    const señaVal = document.getElementById('sim-seña-val');
    const installVal = document.getElementById('sim-install-val');

    if (!selectDestiny || !selectInstallments) return;

    // Poblar destinos dinámicamente
    selectDestiny.innerHTML = '';
    const activeDests = destinations.filter(dest => dest.is_active !== false);
    activeDests.forEach(dest => {
        let finalCost = parseInt(dest.cost, 10) || 0;
        let nameSuffix = "";
        if (dest.is_oferta && config.descuento_oferta) {
            finalCost = finalCost - (finalCost * (config.descuento_oferta / 100));
            nameSuffix = ` (Oferta ${config.descuento_oferta}% OFF)`;
        }
        
        const opt = document.createElement('option');
        opt.value = finalCost;
        opt.textContent = `${dest.name}${nameSuffix} ($${parseInt(finalCost, 10).toLocaleString('es-AR')})`;
        selectDestiny.appendChild(opt);
    });

    // Poblar cuotas si la config las tiene
    if (config?.quotas && config.quotas.length > 0) {
        selectInstallments.innerHTML = '';
        config.quotas.forEach(q => {
            const opt = document.createElement('option');
            opt.value = q;
            opt.textContent = `${q} Cuotas Mensuales`;
            if (q === 6) opt.selected = true; // 6 por defecto
            selectInstallments.appendChild(opt);
        });
    }

    // Función de cálculo
    function calculate() {
        const total = parseInt(selectDestiny.value, 10) || 0;
        const installments = parseInt(selectInstallments.value, 10) || 6;
        const señaPercent = config?.seña_percent || 20;

        // Seña redondeada a miles
        const rawSeña = total * (señaPercent / 100);
        const seña = Math.ceil(rawSeña / 1000) * 1000;
        const remaining = total - seña;
        const monthlyQuote = Math.round(remaining / installments);

        totalVal.textContent = `$${total.toLocaleString('es-AR')} ARS`;
        señaVal.textContent = `$${seña.toLocaleString('es-AR')} ARS`;
        installVal.textContent = `$${monthlyQuote.toLocaleString('es-AR')} ARS`;
    }

    selectDestiny.addEventListener('change', calculate);
    selectInstallments.addEventListener('change', calculate);
    calculate();
}

// ==========================================================================
// 4. CARGAR GALERIAS DE FOTOS COMPLEMENTARIAS
// ==========================================================================
async function loadAndApplyGalleries() {
    let gallery = null;

    if (isDbOnlinePublic && firestoreDb) {
        try {
            const snapshot = await firestoreDb.collection('landing_gallery').orderBy('created_at', 'desc').get();
            if (!snapshot.empty) {
                gallery = [];
                snapshot.forEach(doc => {
                    gallery.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                localStorage.setItem('esteko_landing_gallery', JSON.stringify(gallery));
            }
        } catch (e) {
            console.warn("Fallo de red al leer galerías escolares.", e);
        }
    }

    if (!gallery) {
        gallery = JSON.parse(localStorage.getItem('esteko_landing_gallery')) || [];
    }

    // Inyectar en La Fiesta
    const fiestaFiltered = gallery.filter(item => item.section === 'fiesta');
    renderSingleGallerySection(fiestaFiltered, '#view-fiesta .container', 'fiesta-gallery-grid');

    // Inyectar en Educativo
    const eduFiltered = gallery.filter(item => item.section === 'educativo');
    renderSingleGallerySection(eduFiltered, '#view-educativo .container', 'educativo-gallery-grid');
}

function isVideoUrl(url) {
    if (!url) return false;
    const cleanUrl = url.split('?')[0].toLowerCase();
    return cleanUrl.endsWith('.mp4') || 
           cleanUrl.endsWith('.webm') || 
           cleanUrl.endsWith('.ogg') || 
           cleanUrl.endsWith('.mov') ||
           (url.includes('firebasestorage.googleapis.com') && url.toLowerCase().includes('.mp4'));
}

function renderSingleGallerySection(images, containerSelector, uniqueId) {
    const parentContainer = document.querySelector(containerSelector);
    if (!parentContainer) return;

    // Eliminar grid dinámica anterior si ya existiera
    const oldGrid = document.getElementById(uniqueId);
    if (oldGrid) oldGrid.remove();

    if (images.length === 0) return;

    // Crear la nueva grilla
    const grid = document.createElement('div');
    grid.className = 'gallery-grid-dynamic';
    grid.id = uniqueId;

    images.forEach(img => {
        const item = document.createElement('div');
        item.className = 'gallery-item-dynamic';
        if (isVideoUrl(img.image_url)) {
            item.innerHTML = `
                <video src="${img.image_url}" loop muted playsinline preload="none" style="width:100%; height:100%; object-fit:cover;"></video>
                <div class="video-badge"><i class="fa-solid fa-play"></i> Video</div>
            `;
            const video = item.querySelector('video');
            if (video && 'IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            video.play().catch(() => {});
                        } else {
                            video.pause();
                        }
                    });
                }, { threshold: 0.1 });
                observer.observe(video);
            }
        } else {
            item.innerHTML = `<img src="${img.image_url}" alt="Rutas del Esteko Experiencias" loading="lazy">`;
        }
        grid.appendChild(item);
    });

    // Inyectar al final del contenedor padre
    parentContainer.appendChild(grid);
}

// ==========================================================================
// 5. REGISTRO Y ENVÍO DE LEADS A LA NUBE
// ==========================================================================
function initLeadFormSubmission() {
    const leadForm = document.getElementById('lead-form');
    const leadSuccessMsg = document.getElementById('lead-success-msg');
    const successUserName = document.getElementById('success-user-name');
    const btnResetForm = document.getElementById('btn-reset-form');

    if (!leadForm) return;

    // Cargar selector de destinos dinámico en el formulario de registro
    const leadDestSelect = document.getElementById('lead-destiny-select');
    const localDests = (JSON.parse(localStorage.getItem('esteko_landing_destinations')) || DEFAULT_DESTINATIONS)
                       .filter(dest => dest.is_active !== false);
    
    if (leadDestSelect && localDests.length > 0) {
        leadDestSelect.innerHTML = '';
        localDests.forEach(dest => {
            const opt = document.createElement('option');
            opt.value = dest.name;
            opt.textContent = dest.name;
            leadDestSelect.appendChild(opt);
        });
        
        // Agregar opciones por defecto escolares
        const optEdu = document.createElement('option');
        optEdu.value = "Viaje Educativo (Colegio)";
        optEdu.textContent = "Viaje Educativo (Colegio)";
        leadDestSelect.appendChild(optEdu);

        const optOtro = document.createElement('option');
        optOtro.value = "Otro Destino";
        optOtro.textContent = "Otro Destino / Escapada";
        leadDestSelect.appendChild(optOtro);
    }

    // Reemplazar listener anterior
    const newForm = leadForm.cloneNode(true);
    leadForm.parentNode.replaceChild(newForm, leadForm);

    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('btn-submit-lead');
        const submitText = document.getElementById('btn-submit-text');

        submitBtn.disabled = true;
        submitText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...';

        const name = document.getElementById('lead-name').value.trim();
        const phone = document.getElementById('lead-phone').value.trim();
        const email = document.getElementById('lead-email').value.trim();
        const destiny = document.getElementById('lead-destiny-select').value;

        const leadData = {
            name,
            phone,
            email,
            destiny,
            created_at: new Date().toISOString()
        };

        // 1. Guardar localmente
        let leads = JSON.parse(localStorage.getItem('esteko_leads') || '[]');
        leads.push(leadData);
        localStorage.setItem('esteko_leads', JSON.stringify(leads));

        // 2. Guardar en Firestore (si está online)
        let dbSaved = true;
        if (isDbOnlinePublic && firestoreDb) {
            try {
                await firestoreDb.collection('landing_leads').add(leadData);
            } catch (err) {
                console.error("Error al registrar lead en Firestore:", err);
                dbSaved = false;
            }
        }

        // Mostrar confirmación
        if (successUserName) successUserName.textContent = name;
        newForm.style.display = 'none';
        if (leadSuccessMsg) leadSuccessMsg.style.display = 'block';

        submitBtn.disabled = false;
        submitText.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Registrarme y Participar';
    });

    if (btnResetForm) {
        btnResetForm.addEventListener('click', () => {
            newForm.reset();
            if (leadSuccessMsg) leadSuccessMsg.style.display = 'none';
            newForm.style.display = 'block';
        });
    }
}

// ==========================================================================
// 5b. REGISTRO Y ENVÍO DE POSTULACIONES DE CV A LA NUBE
// ==========================================================================
function initCVFormSubmission() {
    const cvForm = document.getElementById('cv-upload-form');
    const dragDropZone = document.getElementById('cv-drag-drop');
    const fileInput = document.getElementById('cv-file-input');
    const fileDisplay = document.getElementById('cv-file-display');
    const progressContainer = document.getElementById('cv-upload-progress-container');
    const progressBar = document.getElementById('cv-upload-progress-bar');
    const successMsg = document.getElementById('cv-success-msg');
    const successName = document.getElementById('cv-success-user-name');
    const btnReset = document.getElementById('btn-reset-cv-form');

    if (!cvForm) return;

    let selectedFile = null;

    // Trigger file input click
    dragDropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });

    // Drag over/leave/drop
    dragDropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropZone.classList.add('dragover');
    });

    dragDropZone.addEventListener('dragleave', () => {
        dragDropZone.classList.remove('dragover');
    });

    dragDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropZone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });

    function handleFileSelection(file) {
        // Validate type (.pdf, .doc, .docx)
        const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
        if (!allowedExtensions.exec(file.name)) {
            alert('Formato no permitido. Por favor adjuntá un archivo PDF o Word (.doc, .docx).');
            selectedFile = null;
            fileDisplay.style.display = 'none';
            fileInput.value = '';
            return;
        }

        // Validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('El archivo supera los 5MB permitidos. Por favor subí un archivo más chico.');
            selectedFile = null;
            fileDisplay.style.display = 'none';
            fileInput.value = '';
            return;
        }

        selectedFile = file;
        fileDisplay.textContent = `📄 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        fileDisplay.style.display = 'block';
    }

    // Submit handler
    cvForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert('Por favor adjuntá tu currículum (CV) antes de enviar.');
            return;
        }

        const submitBtn = document.getElementById('btn-submit-cv');
        const submitText = document.getElementById('btn-submit-cv-text');

        submitBtn.disabled = true;
        submitText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

        const name = document.getElementById('cv-name').value.trim();
        const phone = document.getElementById('cv-phone').value.trim();
        const email = document.getElementById('cv-email').value.trim();

        // 1. Upload CV to Firebase Storage
        let cvUrl = "";
        let uploadSuccess = false;

        if (typeof firebase !== 'undefined') {
            try {
                progressContainer.style.display = 'block';
                const timestamp = Date.now();
                const cleanFileName = selectedFile.name.replace(/[^a-zA-Z0-9.]/g, '_');
                const filePath = `cvs/${timestamp}_${cleanFileName}`;
                
                const storageRef = firebase.storage().ref().child(filePath);
                const uploadTask = storageRef.put(selectedFile);

                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', 
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            progressBar.style.width = `${progress}%`;
                        }, 
                        (error) => {
                            console.error("Firebase Storage Upload Error:", error);
                            reject(error);
                        }, 
                        async () => {
                            try {
                                cvUrl = await storageRef.getDownloadURL();
                                uploadSuccess = true;
                                resolve();
                            } catch (err) {
                                reject(err);
                            }
                        }
                    );
                });
            } catch (err) {
                console.error("Error al subir archivo a Firebase:", err);
                alert("Hubo un problema al subir tu archivo a la nube. Por favor, intentalo de nuevo.");
                submitBtn.disabled = false;
                submitText.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Postulación';
                progressContainer.style.display = 'none';
                progressBar.style.width = '0%';
                return;
            }
        } else {
            alert("El servicio de subida de archivos no está disponible en este momento. Por favor intentá más tarde.");
            submitBtn.disabled = false;
            submitText.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Postulación';
            return;
        }

        // 2. Insert Application to Supabase
        if (uploadSuccess && cvUrl) {
            const applicationData = {
                full_name: name,
                phone: phone,
                email: email,
                cv_url: cvUrl,
                created_at: new Date().toISOString()
            };

            let dbSaved = true;
            if (isDbOnlinePublic && firestoreDb) {
                try {
                    await firestoreDb.collection('landing_applications').add(applicationData);
                } catch (err) {
                    console.error("Error al registrar postulación en Firestore:", err);
                    dbSaved = false;
                }
            } else {
                dbSaved = false;
            }

            if (!dbSaved) {
                // Fallback local
                let localApps = JSON.parse(localStorage.getItem('esteko_cv_applications') || '[]');
                localApps.push(applicationData);
                localStorage.setItem('esteko_cv_applications', JSON.stringify(localApps));
            }

            // Show Success
            if (successName) successName.textContent = name;
            cvForm.style.display = 'none';
            if (successMsg) successMsg.style.display = 'block';
        }

        submitBtn.disabled = false;
        submitText.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Postulación';
        progressContainer.style.display = 'none';
        progressBar.style.width = '0%';
    });

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            cvForm.reset();
            selectedFile = null;
            fileDisplay.style.display = 'none';
            fileInput.value = '';
            if (successMsg) successMsg.style.display = 'none';
            cvForm.style.display = 'block';
        });
    }
}

// ==========================================================================
// METODOS INTERACTIVOS PREMIUM (GSAP & ScrollTrigger & SplitText - Fase 2)
// ==========================================================================

function initHeroParallax() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    // Parallax del fondo del Hero (se desplaza más lento)
    gsap.to(".hero-slider", {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Parallax del contenido del Hero con desvanecimiento al bajar
    gsap.to(".hero-content", {
        yPercent: -10,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
}

function initScrollReveal() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
}

function setupViewScrollTriggers(viewId) {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    const view = document.getElementById('view-' + viewId);
    if (!view) return;

    // 1. Matar cualquier ScrollTrigger existente dentro de esta vista
    ScrollTrigger.getAll().forEach(trigger => {
        if (view.contains(trigger.trigger)) {
            trigger.kill();
        }
    });

    // 1. Matar tweens activos y resetear inline styles
    const elementsToReset = view.querySelectorAll(
        '.nosotros-content, .nosotros-visual, ' +
        '.destination-card, ' +
        '.educativo-content, .educativo-gallery, ' +
        '.fiesta-visual img, .fiesta-content, ' +
        '.steps-raffle .step-card, ' +
        '.pagos-info, .method-card, .pagos-simulator, ' +
        '.unete-info-box, .unete-form-box, ' +
        '.contacto-info-box, .contacto-form-box'
    );
    // Matar tweens activos para evitar estados intermedios congelados
    gsap.killTweensOf(Array.from(elementsToReset));
    // clearProps:'all' limpia translate/rotate/scale (shorthands de GSAP) además de transform/opacity
    gsap.set(elementsToReset, { clearProps: 'all' });

    // 2. Definir las animaciones de ScrollTrigger para esta vista específica
    if (viewId === 'nosotros') {
        const content = view.querySelector('.nosotros-content');
        const visual = view.querySelector('.nosotros-visual');
        if (content) {
            gsap.from(content, {
                x: -80,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: content,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        }
        if (visual) {
            gsap.from(visual, {
                x: 80,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: visual,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        }
    }

    if (viewId === 'temporadas') {
        const cards = view.querySelectorAll('.destination-card');
        if (cards.length > 0) {
            gsap.from(cards, {
                y: 60,
                opacity: 0,
                scale: 0.95,
                duration: 0.8,
                stagger: 0.12,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: view.querySelector('.destinations-grid'),
                    start: "top 90%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        }
    }

    if (viewId === 'educativo') {
        const content = view.querySelector('.educativo-content');
        const gallery = view.querySelector('.educativo-gallery');
        if (content) {
            gsap.fromTo(content,
                { x: -80, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 0.9, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: content,
                        start: "top 85%",
                        toggleActions: "play none none none",
                        once: true
                    }
                }
            );
        }
        if (gallery) {
            gsap.fromTo(gallery,
                { x: 80, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 0.9, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: gallery,
                        start: "top 85%",
                        toggleActions: "play none none none",
                        once: true
                    }
                }
            );
        }
    }

    if (viewId === 'fiesta') {
        const imgs = view.querySelectorAll('.fiesta-visual img');
        const content = view.querySelector('.fiesta-content');
        if (imgs.length > 0) {
            gsap.fromTo(imgs,
                { x: -80, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 0.9, 
                    stagger: 0.18, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: view.querySelector('.fiesta-visual'),
                        start: "top 85%",
                        toggleActions: "play none none none",
                        once: true
                    }
                }
            );
        }
        if (content) {
            gsap.fromTo(content,
                { x: 80, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 0.9, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: content,
                        start: "top 85%",
                        toggleActions: "play none none none",
                        once: true
                    }
                }
            );
        }
    }

    if (viewId === 'sorteos') {
        const cards = view.querySelectorAll('.steps-raffle .step-card');
        if (cards.length > 0) {
            // Disable transitions during GSAP animation to avoid browser layout conflicts
            cards.forEach(c => c.style.setProperty('transition', 'none', 'important'));

            gsap.from(cards, {
                x: -50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: view.querySelector('.steps-raffle'),
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true
                },
                onComplete: () => {
                    // Restore transitions for hover effects
                    cards.forEach(c => c.style.removeProperty('transition'));
                }
            });
        }
    }

    if (viewId === 'pagos') {
        const info = view.querySelector('.pagos-info');
        const cards = view.querySelectorAll('.method-card');
        const sim = view.querySelector('.pagos-simulator');
        if (info) {
            gsap.fromTo(info,
                { x: -80, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 0.9, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: info,
                        start: "top 85%",
                        toggleActions: "play none none none",
                        once: true
                    }
                }
            );
        }
        if (cards.length > 0) {
            gsap.fromTo(cards,
                { y: 40, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.7, 
                    stagger: 0.1, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: view.querySelector('.methods-grid'),
                        start: "top 85%",
                        toggleActions: "play none none none",
                        once: true
                    }
                }
            );
        }
        if (sim) {
            gsap.fromTo(sim,
                { x: 80, opacity: 0 },
                { 
                    x: 0, 
                    opacity: 1, 
                    duration: 0.9, 
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sim,
                        start: "top 85%",
                        toggleActions: "play none none none",
                        once: true
                    }
                }
            );
        }
    }

    if (viewId === 'unete') {
        const info = view.querySelector('.unete-info-box');
        const form = view.querySelector('.unete-form-box');
        if (info) {
            gsap.from(info, {
                x: -80,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: info,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        }
        if (form) {
            gsap.from(form, {
                x: 80,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: form,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        }
    }

    if (viewId === 'contacto') {
        const info = view.querySelector('.contacto-info-box');
        const form = view.querySelector('.contacto-form-box');
        if (info) {
            gsap.from(info, {
                x: -80,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: info,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        }
        if (form) {
            gsap.from(form, {
                x: 80,
                opacity: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: form,
                    start: "top 85%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        }
    }

    // Refrescar ScrollTrigger inmediatamente después de crear las animaciones para esta vista
    ScrollTrigger.refresh(true);
}

// ============================================================
// CAROUSEL AUTOMATICO: NOSOTROS
// ============================================================
function initNosotrosCarousel() {
    const photos = document.querySelectorAll('.nosotros-visual .gallery-photo');
    if (photos.length < 3) return;

    let classes = ['main-photo', 'sub-photo-1', 'sub-photo-2'];

    setInterval(() => {
        // Rotar las clases
        classes.push(classes.shift());
        
        photos.forEach((photo, idx) => {
            // Remover clases de posicionamiento anteriores
            photo.classList.remove('main-photo', 'sub-photo-1', 'sub-photo-2');
            // Añadir la nueva clase
            photo.classList.add(classes[idx]);
        });
    }, 4000); // Cada 4 segundos
}

// ============================================================
// DETALLE DE DESTINOS OVERLAY (OPCION B)
// ============================================================
let overlayGalleryImages = [];
let overlayLightboxIndex = 0;

window.openDestinationOverlay = function(destId) {
    const dest = window.publicDestinationsList ? window.publicDestinationsList.find(d => d.id === destId) : null;
    if (!dest) return;

    // Poblar los elementos del overlay
    const overlay = document.getElementById('dest-overlay');
    if (!overlay) return;

    // Titulo y badge
    const titleEl = document.getElementById('overlay-title');
    const badgeEl = document.getElementById('overlay-badge');
    if (titleEl) titleEl.textContent = dest.name;
    if (badgeEl) {
        const badgeLabel = { verano: '☀️ Verano', invierno: '❄️ Invierno', mas: '🌿 Escapada' };
        badgeEl.textContent = badgeLabel[dest.category] || dest.category;
        const badgeColors = { verano: 'var(--primary)', invierno: 'var(--accent)', mas: 'var(--secondary)' };
        badgeEl.style.background = badgeColors[dest.category] || 'var(--primary)';
    }

    // Duracion e info
    const durationSpan = document.querySelector('#overlay-duration span');
    const seasonSpan = document.querySelector('#overlay-season span');
    if (durationSpan) durationSpan.textContent = dest.duration;
    if (seasonSpan) seasonSpan.textContent = dest.price_info;

    // Fondo del hero del overlay
    const heroBg = document.getElementById('overlay-hero-bg');
    if (heroBg) {
        heroBg.style.backgroundImage = `url('${dest.image_url || ''}')`;
    }

    // Sidebar CTA
    const ctaName = document.getElementById('overlay-cta-name');
    const ctaDuration = document.querySelector('#overlay-cta-duration span');
    const ctaPriceInfo = document.getElementById('overlay-price-info');
    const ctaBadge = document.getElementById('overlay-cta-badge');

    if (ctaName) ctaName.textContent = dest.name;
    if (ctaDuration) ctaDuration.textContent = dest.duration;
    if (ctaPriceInfo) ctaPriceInfo.textContent = `$${parseInt(dest.cost || 0, 10).toLocaleString('es-AR')} ARS`;
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

    // Servicios en el sidebar
    const ctaServices = document.getElementById('overlay-cta-services');
    if (ctaServices && dest.services) {
        ctaServices.innerHTML = dest.services.slice(0, 3).map(s =>
            `<li><i class="fa-solid fa-check"></i> ${s}</li>`
        ).join('');
    }

    // WhatsApp link
    const phone = window.globalWhatsappPhone || '3855962089';
    const waText = encodeURIComponent(dest.whatsapp_text || `Hola! Me interesa el viaje a ${dest.name}`);
    const waUrl = `https://wa.me/54${phone}?text=${waText}`;
    const waBtn = document.getElementById('overlay-cta-wa');
    if (waBtn) waBtn.href = waUrl;

    // Descripcion larga
    const longDescEl = document.getElementById('overlay-long-desc');
    if (longDescEl) {
        const rawText = dest.long_description || dest.description || '';
        const paras = rawText.split('\n\n').filter(p => p.trim());
        longDescEl.innerHTML = paras.map(p => `<p>${p.trim()}</p>`).join('');
    }

    // Servicios incluidos en columna izquierda
    const servicesList = document.getElementById('overlay-services-list');
    if (servicesList && dest.services) {
        servicesList.innerHTML = dest.services.map(s =>
            `<li><i class="fa-solid fa-circle-check"></i> <span>${s}</span></li>`
        ).join('');
    }

    // Galería de fotos
    const galleryGrid = document.getElementById('overlay-gallery-grid');
    const galleryBlock = document.getElementById('overlay-gallery-block');
    const galleryImages_raw = (dest.gallery_images && dest.gallery_images.length > 0) ? dest.gallery_images : (dest.image_url ? [dest.image_url] : []);
    overlayGalleryImages = galleryImages_raw.filter(Boolean);

    if (galleryGrid && overlayGalleryImages.length > 0) {
        if (galleryBlock) galleryBlock.style.display = 'block';
        galleryGrid.innerHTML = '';
        const MAX_VISIBLE = 6;
        const visibleImages = overlayGalleryImages.slice(0, MAX_VISIBLE);

        visibleImages.forEach((imgUrl, idx) => {
            const item = document.createElement('div');
            item.className = 'dest-gallery-item';
            item.setAttribute('data-index', idx);
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            item.setAttribute('aria-label', `Ver foto ${idx + 1}`);

            let mediaElem;
            if (isVideoUrl(imgUrl)) {
                mediaElem = document.createElement('video');
                mediaElem.src = imgUrl;
                mediaElem.muted = true;
                mediaElem.loop = true;
                mediaElem.playsInline = true;
                mediaElem.preload = 'none';
                mediaElem.style.width = '100%';
                mediaElem.style.height = '100%';
                mediaElem.style.objectFit = 'cover';
                
                const badge = document.createElement('div');
                badge.className = 'video-badge';
                badge.innerHTML = `<i class="fa-solid fa-play"></i>`;
                item.appendChild(badge);
                
                if ('IntersectionObserver' in window) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                mediaElem.play().catch(() => {});
                            } else {
                                mediaElem.pause();
                            }
                        });
                    }, { threshold: 0.1 });
                    observer.observe(mediaElem);
                }
            } else {
                mediaElem = document.createElement('img');
                mediaElem.src = imgUrl;
                mediaElem.alt = `Foto ${idx + 1}`;
                mediaElem.loading = 'lazy';
            }

            if (idx === MAX_VISIBLE - 1 && overlayGalleryImages.length > MAX_VISIBLE) {
                const moreOverlay = document.createElement('div');
                moreOverlay.className = 'dest-gallery-more';
                moreOverlay.innerHTML = `<span>+${overlayGalleryImages.length - MAX_VISIBLE}</span><small>más fotos</small>`;
                item.appendChild(mediaElem);
                item.appendChild(moreOverlay);
            } else {
                item.appendChild(mediaElem);
            }

            item.addEventListener('click', () => openOverlayLightbox(idx));
            item.addEventListener('keydown', e => { if (e.key === 'Enter') openOverlayLightbox(idx); });

            galleryGrid.appendChild(item);
        });
    } else {
        if (galleryBlock) galleryBlock.style.display = 'none';
    }

    // Mostrar overlay con transiciones
    overlay.style.display = 'flex';
    // Forzar reflow para animación
    overlay.offsetHeight;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Animación de los elementos internos del overlay
    const overlayTitle = document.getElementById('overlay-title');
    if (overlayTitle) {
        gsap.set(overlayTitle, { opacity: 1, x: 0 });
        window.triggerTypewriterGlobal(overlayTitle, 20);
    }

    const overlayLeft = overlay.querySelector('.dest-info-col');
    const overlayRight = overlay.querySelector('.dest-cta-col');
    if (overlayLeft && overlayRight) {
        gsap.killTweensOf([overlayLeft, overlayRight]);
        gsap.fromTo(overlayLeft,
            { opacity: 0, x: -80 },
            { opacity: 1, x: 0, duration: 0.85, ease: "power3.out" }
        );
        gsap.fromTo(overlayRight,
            { opacity: 0, x: 80 },
            { opacity: 1, x: 0, duration: 0.85, ease: "power3.out" }
        );
    }

    // Stagger gallery items inside the overlay
    const overlayGalleryItems = overlay.querySelectorAll('.dest-gallery-item');
    if (overlayGalleryItems.length > 0) {
        gsap.killTweensOf(overlayGalleryItems);
        gsap.fromTo(overlayGalleryItems,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", delay: 0.25 }
        );
    }
};

window.closeDestinationOverlay = function() {
    const overlay = document.getElementById('dest-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    setTimeout(() => {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    }, 400); // Coincide con la duración de la transición CSS
};

function initDestinationOverlayListeners() {
    const overlay = document.getElementById('dest-overlay');
    const closeBtn = document.getElementById('dest-overlay-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', window.closeDestinationOverlay);
    }
    if (overlay) {
        overlay.addEventListener('click', e => {
            if (e.target === overlay || e.target.classList.contains('dest-overlay-container')) {
                window.closeDestinationOverlay();
            }
        });
    }

    // Escuchar Escape para cerrar
    document.addEventListener('keydown', e => {
        if (overlay && overlay.classList.contains('active')) {
            if (e.key === 'Escape') {
                const lightbox = document.getElementById('overlay-lightbox');
                if (lightbox && lightbox.style.display === 'flex') {
                    closeOverlayLightbox();
                } else {
                    window.closeDestinationOverlay();
                }
            }
        }
    });

    // Lightbox del overlay
    const lbClose = document.getElementById('overlay-lightbox-close');
    const lbPrev = document.getElementById('overlay-lightbox-prev');
    const lbNext = document.getElementById('overlay-lightbox-next');
    const lb = document.getElementById('overlay-lightbox');

    lbClose?.addEventListener('click', closeOverlayLightbox);
    lbPrev?.addEventListener('click', () => navigateOverlayLightbox(-1));
    lbNext?.addEventListener('click', () => navigateOverlayLightbox(1));

    if (lb) {
        lb.addEventListener('click', e => {
            if (e.target === lb) closeOverlayLightbox();
        });
        document.addEventListener('keydown', e => {
            if (lb.style.display === 'flex') {
                if (e.key === 'ArrowLeft') navigateOverlayLightbox(-1);
                if (e.key === 'ArrowRight') navigateOverlayLightbox(1);
            }
        });
    }
}

function openOverlayLightbox(index) {
    const lb = document.getElementById('overlay-lightbox');
    if (!lb || !overlayGalleryImages.length) return;
    overlayLightboxIndex = index;
    updateOverlayLightboxImage();
    lb.style.display = 'flex';
}

function closeOverlayLightbox() {
    const lb = document.getElementById('overlay-lightbox');
    if (lb) lb.style.display = 'none';
    const video = document.getElementById('overlay-lightbox-video');
    if (video) {
        video.pause();
        video.src = '';
    }
}

function navigateOverlayLightbox(dir) {
    overlayLightboxIndex = (overlayLightboxIndex + dir + overlayGalleryImages.length) % overlayGalleryImages.length;
    updateOverlayLightboxImage();
}

function updateOverlayLightboxImage() {
    const img = document.getElementById('overlay-lightbox-img');
    const video = document.getElementById('overlay-lightbox-video');
    const counter = document.getElementById('overlay-lightbox-counter');
    const mediaUrl = overlayGalleryImages[overlayLightboxIndex];

    if (isVideoUrl(mediaUrl)) {
        if (img) img.style.display = 'none';
        if (video) {
            video.src = mediaUrl;
            video.style.display = 'block';
            video.play().catch(e => console.log("Auto-play blocked or failed", e));
        }
    } else {
        if (video) {
            video.pause();
            video.style.display = 'none';
            video.src = '';
        }
        if (img) {
            img.src = mediaUrl;
            img.style.display = 'block';
        }
    }

    if (counter) counter.textContent = `${overlayLightboxIndex + 1} / ${overlayGalleryImages.length}`;
}

// ==========================================================================
// 12. CARGA DINÁMICA DE OPINIONES DE GOOGLE MAPS
// ==========================================================================
async function loadGoogleReviews() {
    const reviewsGrid = document.querySelector('.reviews-grid-premium');
    if (!reviewsGrid) return;

    let reviewsList = [];

    if (isDbOnlinePublic && firestoreDb) {
        try {
            const snapshot = await firestoreDb.collection('landing_reviews').get();
            if (!snapshot.empty) {
                snapshot.forEach(doc => {
                    reviewsList.push({ id: doc.id, ...doc.data() });
                });
                // Ordenar por orden
                reviewsList.sort((a, b) => (a.order || 10) - (b.order || 10));
            }
        } catch (e) {
            console.warn("Fallo leyendo opiniones de Firestore, usando locales.", e);
        }
    }

    // Fallback: Si no hay opiniones en Firestore, usar localStorage si existen
    if (reviewsList.length === 0) {
        const local = localStorage.getItem('esteko_landing_reviews');
        if (local) {
            try {
                reviewsList = JSON.parse(local);
            } catch (err) {
                console.warn("Error parsing local reviews", err);
            }
        }
    }

    if (reviewsList.length > 0) {
        renderGoogleReviews(reviewsList);
    }
}

function renderGoogleReviews(reviewsList) {
    const reviewsGrid = document.querySelector('.reviews-grid-premium');
    if (!reviewsGrid) return;

    reviewsGrid.innerHTML = '';

    // Agrupar opiniones en pares (frente y dorso de las flip cards)
    for (let i = 0; i < reviewsList.length; i += 2) {
        const frontReview = reviewsList[i];
        const backReview = reviewsList[i + 1] || null;

        const wrapper = document.createElement('div');
        wrapper.className = 'review-card-premium-wrapper';

        const card = document.createElement('div');
        card.className = 'review-card-premium';

        // Frente
        let starsHTML = '';
        const starCount = parseInt(frontReview.stars) || 5;
        for (let s = 0; s < 5; s++) {
            starsHTML += s < starCount ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
        }

        const frontFace = document.createElement('div');
        frontFace.className = 'review-card-front';
        frontFace.innerHTML = `
            <div class="review-header-prem">
                <img src="${frontReview.avatar_url || 'img/default-avatar.png'}" alt="${frontReview.name}" class="reviewer-avatar" onerror="this.src='img/default-avatar.png'">
                <div class="reviewer-meta">
                    <h4>${frontReview.name}</h4>
                    <span class="reviewer-title"><i class="fa-solid fa-circle-check"></i> ${frontReview.title || 'Pasajero verificado'}</span>
                </div>
                ${backReview ? '<span class="flip-hint-badge"><i class="fa-solid fa-rotate animate-pulse"></i></span>' : ''}
                <span class="google-icon-corner"><i class="fa-brands fa-google"></i></span>
            </div>
            <div class="review-rating-stars">
                <div class="stars-gold">${starsHTML}</div>
                <span class="review-time">${frontReview.time || 'Hace poco'}</span>
            </div>
            <p class="review-comment">"${frontReview.comment}"</p>
        `;
        card.appendChild(frontFace);

        // Dorso
        if (backReview) {
            let backStarsHTML = '';
            const backStarCount = parseInt(backReview.stars) || 5;
            for (let s = 0; s < 5; s++) {
                backStarsHTML += s < backStarCount ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
            }

            const backFace = document.createElement('div');
            backFace.className = 'review-card-back';
            backFace.innerHTML = `
                <div class="review-header-prem">
                    <img src="${backReview.avatar_url || 'img/default-avatar.png'}" alt="${backReview.name}" class="reviewer-avatar" onerror="this.src='img/default-avatar.png'">
                    <div class="reviewer-meta">
                        <h4>${backReview.name}</h4>
                        <span class="reviewer-title"><i class="fa-solid fa-circle-check"></i> ${backReview.title || 'Pasajero verificado'}</span>
                    </div>
                    <span class="google-icon-corner"><i class="fa-brands fa-google"></i></span>
                </div>
                <div class="review-rating-stars">
                    <div class="stars-gold">${backStarsHTML}</div>
                    <span class="review-time">${backReview.time || 'Hace poco'}</span>
                </div>
                <p class="review-comment">"${backReview.comment}"</p>
            `;
            card.appendChild(backFace);
        } else {
            // Si es impar, dorso con CTA para opinar
            const backFace = document.createElement('div');
            backFace.className = 'review-card-back review-card-cta-back';
            backFace.style.display = 'flex';
            backFace.style.flexDirection = 'column';
            backFace.style.justifyContent = 'center';
            backFace.style.alignItems = 'center';
            backFace.style.textAlign = 'center';
            backFace.style.padding = '20px';
            backFace.innerHTML = `
                <i class="fa-brands fa-google" style="font-size: 2.5rem; color: var(--primary); margin-bottom: 12px;"></i>
                <h4 style="margin-bottom: 5px;">¿Viajaste con nosotros?</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px; line-height: 1.4;">¡Dejanos tu reseña oficial de 5 estrellas en Google Maps!</p>
                <a href="https://www.google.com/maps/place/Rutas+del+Esteko+-+Agencia+de+Viajes+y+Turismo/@-27.8192068,-64.2676658,17z/data=!4m8!3m7!1s0x943b4d0000d981d3:0x7b8cfd201eae5f9f!8m2!3d-27.8192068!4d-64.2650909!9m1!1b1!16s%2Fg%2F11wvn7yj62" target="_blank" class="btn-google-review-premium" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; font-size: 0.8rem; border-radius: 20px; background: var(--primary); color: #fff; text-decoration: none; font-weight: 600; box-shadow: var(--shadow-sm);"><i class="fa-solid fa-map-location-dot"></i> Opinar ahora</a>
            `;
            card.appendChild(backFace);
        }

        wrapper.appendChild(card);
        reviewsGrid.appendChild(wrapper);
    }
}

function renderPublicDestinosMasElegidos(destinations, config) {
    const carousel = document.getElementById('destinos-carousel');
    const dotsContainer = document.getElementById('carousel-dots');
    if (!carousel) return;

    // 1. Filtrar los destinos marcados como favorito (is_favorito === true) y que estén activos
    let favoritos = destinations.filter(d => d.is_favorito === true && d.is_active !== false);

    // Fallback: Si no hay favoritos marcados en el panel, mostramos los primeros 3 destinos activos
    if (favoritos.length === 0) {
        favoritos = destinations.filter(d => d.is_active !== false).slice(0, 3);
    }

    carousel.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';

    const phone = config?.whatsapp || '3855962089';

    favoritos.forEach((dest, index) => {
        const card = document.createElement('div');
        card.className = 'dest-elegido-card reveal-on-scroll';
        card.style.animationDelay = `${index * 100}ms`;

        const waText = encodeURIComponent(dest.whatsapp_text || `Hola! Me interesa el viaje a ${dest.name}`);
        const seasonIcon = dest.category === 'verano' ? '<i class="fa-solid fa-sun"></i>' : (dest.category === 'invierno' ? '<i class="fa-solid fa-snowflake"></i>' : '<i class="fa-solid fa-compass"></i>');
        const seasonLabel = dest.category === 'verano' ? 'Verano' : (dest.category === 'invierno' ? 'Invierno' : 'Escapada');

        card.innerHTML = `
            <div class="dest-elegido-img" style="background-image: url('${dest.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'}')" onclick="openDestinationOverlay('${dest.id}')">
                <div class="dest-elegido-overlay"></div>
                <div class="dest-elegido-info">
                    <span class="dest-elegido-season">${seasonIcon} ${seasonLabel}</span>
                    <h3>${dest.name}</h3>
                    <div class="dest-elegido-footer">
                        <div class="dest-elegido-price">
                            <span class="dest-desde">Desde</span>
                            <span class="dest-precio">$${parseInt(dest.cost || 0, 10).toLocaleString('es-AR')}</span>
                        </div>
                        <a href="https://wa.me/54${phone}?text=${waText}" target="_blank" onclick="event.stopPropagation();" class="dest-elegido-btn">Ver más <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        `;
        carousel.appendChild(card);

        // Crear dot de carrusel correspondiente
        if (dotsContainer) {
            const dot = document.createElement('span');
            dot.className = `carousel-dot${index === 0 ? ' active' : ''}`;
            dot.setAttribute('data-idx', index);
            
            // Acción al hacer clic en el dot: mover scroll
            dot.addEventListener('click', () => {
                const cardWidth = card.clientWidth + 20; // width + gap
                carousel.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth'
                });
                
                // Actualizar clase activa
                dotsContainer.querySelectorAll('.carousel-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
            });
            dotsContainer.appendChild(dot);
        }
    });

    // Escuchar el evento de scroll en el carrusel para actualizar la clase activa de los dots en móvil
    if (dotsContainer && favoritos.length > 0) {
        carousel.addEventListener('scroll', () => {
            const cardWidth = carousel.firstElementChild ? carousel.firstElementChild.clientWidth + 20 : 300;
            const scrollIndex = Math.round(carousel.scrollLeft / cardWidth);
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            if (dots[scrollIndex]) {
                dots.forEach(d => d.classList.remove('active'));
                dots[scrollIndex].classList.add('active');
            }
        });
    }

    // Lógica de carrusel auto-run (deslizamiento automático cada 4 segundos)
    if (favoritos.length > 1) {
        if (window.destinosCarouselInterval) {
            clearInterval(window.destinosCarouselInterval);
        }
        
        let activeIdx = 0;
        const autoScroll = () => {
            // Pausar temporalmente si el mouse está posado sobre el carrusel
            if (carousel.matches(':hover')) return;
            activeIdx = (activeIdx + 1) % favoritos.length;
            const cardWidth = carousel.firstElementChild ? carousel.firstElementChild.clientWidth + 20 : 300;
            carousel.scrollTo({
                left: activeIdx * cardWidth,
                behavior: 'smooth'
            });
        };
        
        window.destinosCarouselInterval = setInterval(autoScroll, 4000);
        
        // Limpiar intervalo si el usuario interactúa manualmente
        carousel.addEventListener('pointerdown', () => {
            clearInterval(window.destinosCarouselInterval);
        }, { passive: true });
        carousel.addEventListener('touchstart', () => {
            clearInterval(window.destinosCarouselInterval);
        }, { passive: true });
    }
}


