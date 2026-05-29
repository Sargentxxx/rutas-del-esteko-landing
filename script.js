/**
 * Rutas del Esteko - Landing Page Interactive Operations (Dynamic SPA Version)
 * Author: Antigravity Regiment (Agent 00 - General Commander)
 * Powered by: DeepSeek Strategy Design
 */

// ==========================================================================
// 1. CONFIGURACIÓN Y CLIENTE DE SUPABASE (PÚBLICO)
// ==========================================================================
const SUPABASE_URL = "https://wzclhwfdvdrrcfzmmxit.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Y2xod2ZkdmRycmNmem1teGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwODYwODUsImV4cCI6MjA5MDY2MjA4NX0.N5g-kwoU44_49RU6yaQkch-klk191yhKTzr0ABo02Hk";

let supabasePublic = null;
let isDbOnlinePublic = false;

// Datos por defecto (Semilla inicial) por si no existe conexión a la base de datos
const DEFAULT_DESTINATIONS = [
    {
        id: "default-mdp",
        name: "Mar del Plata Mágica",
        category: "verano",
        duration: "7 Noches / 10 Días",
        description: "Salidas durante la temporada de verano desde la Terminal de Ómnibus en unidades premium de la empresa San Felipe (habilitación CNRT). Estadía de 7 noches en departamentos céntricos equipados, cercanos a los principales atractivos y playas.",
        image_url: "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=600&q=80",
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
        image_url: "https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&w=600&q=80",
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
        image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
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
        image_url: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=600&q=80",
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

try {
    if (typeof supabase !== 'undefined') {
        supabasePublic = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.warn("Librería de Supabase no disponible. Operando en modo Local Fallback.");
}

// ==========================================================================
// 2. INICIO Y CARGA DINÁMICA DE CONTENIDO
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
    
    // Probar conexión e inicializar datos dinámicos
    await testConnectionAndLoadContent();

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

    function switchView(hash) {
        const viewId = hash.replace('#', '') || 'inicio';
        const targetViewElement = document.getElementById('view-' + viewId);

        if (targetViewElement) {
            spaViews.forEach(view => {
                view.classList.remove('active-view');
            });

            targetViewElement.classList.add('active-view');

            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + viewId) {
                    link.classList.add('active');
                }
            });

            window.scrollTo({ top: 0, behavior: 'instant' });
            closeMobileMenu();
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

    // 4. MARQUEE EFFECT BUFFER
    const marqueeText = document.querySelector('.marquee-text');
    if (marqueeText) {
        const doubleContent = marqueeText.innerHTML + " &nbsp;•&nbsp; " + marqueeText.innerHTML;
        marqueeText.innerHTML = doubleContent;
    }
});

// ==========================================================================
// 3. RECUPERACIÓN DE DATOS (NUBE O CACHÉ DE EMERGENCIA)
// ==========================================================================
async function testConnectionAndLoadContent() {
    if (supabasePublic) {
        try {
            const { data, error } = await supabasePublic
                .from('landing_sections')
                .select('id')
                .limit(1);

            if (!error) {
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
}

// Aplicar textos dinámicos
async function loadAndApplySections() {
    let sections = null;

    if (isDbOnlinePublic && supabasePublic) {
        try {
            const { data, error } = await supabasePublic
                .from('landing_sections')
                .select('*');

            if (!error && data && data.length > 0) {
                sections = {};
                data.forEach(item => {
                    sections[item.id] = {
                        title: item.title,
                        subtitle: item.subtitle,
                        content: item.content,
                        image_url: item.image_url,
                        extra_data: item.extra_data
                    };
                });
                localStorage.setItem('esteko_landing_sections', JSON.stringify(sections));
            }
        } catch (e) {
            console.warn("Fallo cargando secciones de la nube, usando caché.");
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

        if (hTitle && sections.hero.title) hTitle.textContent = sections.hero.title;
        if (hText && sections.hero.content) hText.textContent = sections.hero.content;

        // Inicializar Carrusel Dinámico
        let heroImages = [];
        if (sections.hero.extra_data && sections.hero.extra_data.hero_images) {
            heroImages = sections.hero.extra_data.hero_images;
        }
        initializeHeroCarousel(heroImages);
    }
}

function initializeHeroCarousel(images) {
    const sliderContainer = document.getElementById('hero-slider');
    if (!sliderContainer) return;

    const defaultImages = [
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80",
        "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1920&q=80"
    ];

    const finalImages = (images && images.length > 0) ? images : defaultImages;

    sliderContainer.innerHTML = '';
    finalImages.forEach((imgUrl, index) => {
        const slide = document.createElement('div');
        slide.className = `hero-slide${index === 0 ? ' active' : ''}`;
        slide.style.backgroundImage = `linear-gradient(135deg, rgba(15, 10, 10, 0.75), rgba(15, 10, 10, 0.45)), url('${imgUrl}')`;
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

    // Nosotros
    if (sections.nosotros) {
        const nTitle = document.querySelector('.nosotros h2');
        const nContentWrapper = document.querySelector('.nosotros-content');
        const nImage = document.querySelector('.main-photo img');

        if (nTitle && sections.nosotros.title) nTitle.textContent = sections.nosotros.title;
        
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
    }

    // La Fiesta
    if (sections.fiesta) {
        const fTitle = document.querySelector('.fiesta h2');
        const fImage = document.querySelector('.fiesta-visual img');
        const fContentWrapper = document.querySelector('.fiesta-content');

        if (fTitle && sections.fiesta.title) fTitle.textContent = sections.fiesta.title;
        if (fImage && sections.fiesta.image_url) fImage.src = sections.fiesta.image_url;
        
        if (fContentWrapper && sections.fiesta.content) {
            const paras = sections.fiesta.content.split('\n\n');
            let parasHtml = `<h3>Tradición, Música y Experiencias Inolvidables</h3>`;
            paras.forEach(p => {
                if (p.trim()) parasHtml += `<p>${p.trim()}</p>`;
            });
            
            const quote = document.querySelector('.fiesta-quote');
            const perks = document.querySelector('.fiesta-perks');
            
            fContentWrapper.innerHTML = parasHtml;
            if (quote) fContentWrapper.appendChild(quote);
            if (perks) fContentWrapper.appendChild(perks);
        }
    }

    // Educativo
    if (sections.educativo) {
        const eTitle = document.querySelector('.educativo-text h2');
        const eImage = document.querySelector('.edu-img');
        const eContentWrapper = document.querySelector('.educativo-text');

        if (eTitle && sections.educativo.title) eTitle.textContent = sections.educativo.title;
        if (eImage && sections.educativo.image_url) eImage.src = sections.educativo.image_url;
        
        if (eContentWrapper && sections.educativo.content) {
            const paras = sections.educativo.content.split('\n\n');
            let parasHtml = `<span class="badge-edu"><i class="fa-solid fa-graduation-cap"></i> División Educativa</span>
                             <h2>${sections.educativo.title || 'Paseos con Escuelas y Colegios'}</h2>`;
            paras.forEach(p => {
                if (p.trim()) parasHtml += `<p class="edu-intro">${p.trim()}</p>`;
            });

            const features = document.querySelector('.edu-features');
            const btn = document.querySelector('.btn-edu');

            eContentWrapper.innerHTML = parasHtml;
            if (features) eContentWrapper.appendChild(features);
            if (btn) eContentWrapper.appendChild(btn);
        }
    }
}

// Aplicar catálogo y simulador
async function loadAndApplyDestinationsAndConfig() {
    let destinations = null;
    let config = null;

    // 1. Cargar Configuración General
    if (isDbOnlinePublic && supabasePublic) {
        try {
            const { data, error } = await supabasePublic
                .from('landing_config')
                .select('*');

            if (!error && data && data.length > 0) {
                config = {};
                data.forEach(item => {
                    config[item.key] = item.value;
                });
                localStorage.setItem('esteko_landing_config', JSON.stringify(config));
            }
        } catch (e) {
            console.warn("Fallo de red al leer configuraciones.");
        }
    }

    if (!config) {
        config = JSON.parse(localStorage.getItem('esteko_landing_config'));
    }

    // Aplicar config de legajos, email, whatsapp y redes
    if (config) {
        applyGlobalConfigVars(config);
    }

    // 2. Cargar catálogo de destinos
    if (isDbOnlinePublic && supabasePublic) {
        try {
            const { data, error } = await supabasePublic
                .from('landing_destinations')
                .select('*')
                .order('created_at', { ascending: true });

            if (!error && data && data.length > 0) {
                destinations = data;
                localStorage.setItem('esteko_landing_destinations', JSON.stringify(destinations));
            }
        } catch (e) {
            console.warn("Fallo leyendo destinos, usando local.");
        }
    }

    if (!destinations) {
        destinations = JSON.parse(localStorage.getItem('esteko_landing_destinations'));
    }

    if (!destinations) return; // Nada que renderizar

    // Renderizar catálogo en el frontend público
    renderPublicCatalogGrid(destinations, config);

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
                            <a href="${config.legajo_url || 'https://www.agenciasdeviajes.ar/#buscador'}" target="_blank" class="top-bar-link">Buscador Nacional de Agencias</a>`;
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
    const fbLinks = document.querySelectorAll('a[aria-label="Facebook"], .footer-copyright a[href*="facebook"]');
    const igLinks = document.querySelectorAll('a[aria-label="Instagram"], .footer-copyright a[href*="instagram"], .sorteos-banner a[href*="instagram"]');
    const tkLinks = document.querySelectorAll('a[aria-label="TikTok"], .footer-copyright a[href*="tiktok"]');

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
}

function renderPublicCatalogGrid(destinations, config) {
    const grid = document.getElementById('destinations-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    destinations.forEach(dest => {
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.setAttribute('data-category', dest.category);
        card.id = `card-dynamic-${dest.id}`;

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
            <div class="card-image">
                <img src="${dest.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=500&q=80'}" alt="${dest.name}">
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
                    <a href="https://wa.me/54${phone}?text=${waText}" target="_blank" class="btn-card">Consultar <i class="fa-solid fa-arrow-right"></i></a>
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
    destinations.forEach(dest => {
        const opt = document.createElement('option');
        opt.value = dest.cost;
        opt.textContent = `${dest.name} ($${parseInt(dest.cost, 10).toLocaleString('es-AR')})`;
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

    if (isDbOnlinePublic && supabasePublic) {
        try {
            const { data, error } = await supabasePublic
                .from('landing_gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                gallery = data;
                localStorage.setItem('esteko_landing_gallery', JSON.stringify(gallery));
            }
        } catch (e) {
            console.warn("Fallo de red al leer galerías escolares.");
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
        item.innerHTML = `<img src="${img.image_url}" alt="Rutas del Esteko Experiencias" loading="lazy">`;
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
    const localDests = JSON.parse(localStorage.getItem('esteko_landing_destinations')) || DEFAULT_DESTINATIONS;
    
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

        // 2. Guardar en Supabase (si está online)
        let dbSaved = true;
        if (isDbOnlinePublic && supabasePublic) {
            try {
                const { error } = await supabasePublic
                    .from('landing_leads')
                    .insert(leadData);

                if (error) {
                    console.error("Error al registrar lead en Supabase:", error);
                    dbSaved = false;
                }
            } catch (err) {
                console.error("Fallo de red enviando lead:", err);
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
