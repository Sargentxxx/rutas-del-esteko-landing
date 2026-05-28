/**
 * Rutas del Esteko - Admin Panel JavaScript Lógica
 * Author: Antigravity Regiment (Agent 00 - General Commander)
 * Powered by: DeepSeek Strategy Design
 * 
 * Double system: Sincronización en tiempo real con Supabase y
 * fallback a LocalStorage de alta resiliencia.
 */

// ==========================================================================
// 1. CONFIGURACIÓN Y CLIENTE DE SUPABASE
// ==========================================================================
const SUPABASE_URL = "https://wzclhwfdvdrrcfzmmxit.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6Y2xod2ZkdmRycmNmem1teGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwODYwODUsImV4cCI6MjA5MDY2MjA4NX0.N5g-kwoU44_49RU6yaQkch-klk191yhKTzr0ABo02Hk";
const LOCAL_MASTER_PASS = "adminesteko2026"; // Contraseña maestra de contingencia local

let supabaseClient = null;
let isDatabaseOnline = false;

// Inicializar cliente Supabase de forma segura
try {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.warn("No se pudo cargar el cliente CDN de Supabase. Operando en modo offline.");
}

// Datos por defecto (Semilla inicial) por si no existe base de datos
const DEFAULT_SECTIONS = {
    hero: {
        title: "Tu viaje soñado, con la confianza de siempre.",
        subtitle: "Desde Santiago del Estero al País",
        content: "Salidas grupales con coordinadores permanentes, los mejores alojamientos y la alegría que nos caracteriza. ¡Sumate a los más de 15.000 pasajeros que ya cumplieron su sueño con nosotros!"
    },
    nosotros: {
        title: "¡Bienvenidos a Rutas del Esteko!",
        content: "Somos un emprendimiento familiar nacido en el año 2022, creado con el objetivo de brindar una alternativa turística accesible, confiable y de calidad para todas las personas que desean cumplir el sueño de viajar.\n\nNos destacamos por ser la primera agencia de Santiago del Estero en innovar con una propuesta alternativa de turismo, ofreciendo durante la temporada de verano paquetes de traslado + departamento, con alojamientos equipados, cómodos y ubicados cerca de la playa en los principales destinos turísticos del país, extendiéndonos también a Camboriú, en el vecino país de Brasil.\n\nEn Rutas del Esteko buscamos que cada viajero se sienta acompañado desde el primer momento, brindando un ambiente familiar, cálido y agradable para que pueda disfrutar plenamente de cada experiencia.",
        image_url: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80"
    },
    fiesta: {
        title: "La Fiesta de Rutas del Esteko",
        content: "Cada año, en Rutas del Esteko vivimos uno de los momentos más especiales junto a nuestros pasajeros y pasajeras: La Fiesta de Rutas del Esteko, un evento pensado para dar inicio oficial a nuestra temporada de verano.\n\nDurante esta gran celebración presentamos todos nuestros destinos, paquetes turísticos y precios para la nueva temporada, compartiendo con el público cada una de las propuestas y experiencias que formarán parte del verano.\n\nAdemás, la fiesta cuenta con sorteos de viajes, premios, shows en vivo y muchas sorpresas, creando un ambiente familiar, alegre y lleno de emoción para todas las personas que nos acompañan año tras año.",
        image_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80"
    },
    educativo: {
        title: "Paseos con Escuelas y Colegios",
        content: "Creamos experiencias educativas seguras, dinámicas y divertidas fuera del aula. Viajes de estudio y recreativos planificados con absoluta rigurosidad legal y la máxima diversión para los alumnos.",
        image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
    }
};

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

const DEFAULT_CONFIG = {
    seña_percent: 20,
    quotas: [3, 6, 9, 12],
    legajo: "19.515",
    legajo_url: "https://www.agenciasdeviajes.ar/#buscador",
    email: "rutasdelesteko@gmail.com",
    whatsapp: "3855962089",
    facebook: "https://www.facebook.com/profile.php?id=100087455823485",
    instagram: "https://www.instagram.com/rutasdelesteko.sde/",
    tiktok: "https://www.tiktok.com/@rutasdelesteko"
};

// ==========================================================================
// 2. INICIALIZACIÓN DE LA APLICACIÓN & DETECCIÓN DE CONEXIÓN
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar LocalStorage con datos por defecto si están vacíos
    if (!localStorage.getItem('esteko_landing_sections')) {
        localStorage.setItem('esteko_landing_sections', JSON.stringify(DEFAULT_SECTIONS));
    }
    if (!localStorage.getItem('esteko_landing_destinations')) {
        localStorage.setItem('esteko_landing_destinations', JSON.stringify(DEFAULT_DESTINATIONS));
    }
    if (!localStorage.getItem('esteko_landing_config')) {
        localStorage.setItem('esteko_landing_config', JSON.stringify(DEFAULT_CONFIG));
    }
    if (!localStorage.getItem('esteko_landing_gallery')) {
        localStorage.setItem('esteko_landing_gallery', JSON.stringify([]));
    }

    // Actualizar fecha militar en cabecera
    updateSystemDate();
    
    // Chequear conexión y validez de tablas con Supabase
    await testDatabaseConnection();

    // Comprobar si ya existe sesión iniciada
    checkActiveSession();

    // Inicializar eventos de navegación (tabs) del dashboard
    initDashboardTabs();

    // Inicializar listeners del formulario de login
    initLoginListeners();
});

function updateSystemDate() {
    const systemDateEl = document.getElementById('system-date');
    if (systemDateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const today = new Date();
        systemDateEl.textContent = "Operativo: " + today.toLocaleDateString('es-AR', options);
    }
}

async function testDatabaseConnection() {
    const dbStatusBadge = document.getElementById('db-status-badge');
    const dbStatusText = document.getElementById('db-status-text');
    const fallbackBanner = document.getElementById('fallback-banner');

    if (!supabaseClient) {
        setOfflineState("Servicio Desconectado");
        return;
    }

    try {
        // Consultar una tabla clave para testear
        const { data, error } = await supabaseClient
            .from('landing_sections')
            .select('id')
            .limit(1);

        if (error) {
            console.error("Error al testear Supabase, cayendo a LocalStorage:", error);
            setOfflineState("Tablas Faltantes");
        } else {
            // Conexión exitosa y tablas listas
            isDatabaseOnline = true;
            if (dbStatusBadge) {
                dbStatusBadge.className = "status-shield database-online";
                dbStatusText.innerHTML = '<i class="fa-solid fa-cloud-bolt"></i> Nube Supabase Sincronizada';
            }
            if (fallbackBanner) fallbackBanner.style.display = "none";
        }
    } catch (e) {
        console.error("Fallo crítico de red contra Supabase:", e);
        setOfflineState("Red Inalcanzable");
    }

    function setOfflineState(reason) {
        isDatabaseOnline = false;
        if (dbStatusBadge) {
            dbStatusBadge.className = "status-shield database-offline";
            dbStatusText.innerHTML = `<i class="fa-solid fa-triangle-exclamation animate-pulse"></i> Modo Local (${reason})`;
        }
        if (fallbackBanner) fallbackBanner.style.display = "flex";
    }
}

// ==========================================================================
// 3. CONTROL DE AUTENTICACIÓN
// ==========================================================================
function checkActiveSession() {
    const sessionToken = localStorage.getItem('esteko_admin_session');
    
    if (supabaseClient) {
        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (session) {
                const email = session.user.email;
                localStorage.setItem('esteko_admin_session', email);
                showDashboardView(email);
            } else {
                // Si no hay sesión local de contingencia
                const currentSession = localStorage.getItem('esteko_admin_session');
                if (currentSession && currentSession.includes("Local Admin")) {
                    showDashboardView(currentSession);
                } else {
                    localStorage.removeItem('esteko_admin_session');
                    document.getElementById('login-container').style.display = 'flex';
                    document.getElementById('dashboard-container').style.display = 'none';
                }
            }
        });
    } else {
        if (sessionToken) {
            showDashboardView(sessionToken);
        } else {
            document.getElementById('login-container').style.display = 'flex';
            document.getElementById('dashboard-container').style.display = 'none';
        }
    }
}

function initLoginListeners() {
    const loginForm = document.getElementById('login-form');
    const togglePassBtn = document.getElementById('toggle-password');
    const adminPassInput = document.getElementById('admin-password');

    if (togglePassBtn && adminPassInput) {
        togglePassBtn.addEventListener('click', () => {
            const isPass = adminPassInput.type === 'password';
            adminPassInput.type = isPass ? 'text' : 'password';
            togglePassBtn.querySelector('i').className = isPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('admin-email').value.trim();
            const password = adminPassInput.value;
            const errorAlert = document.getElementById('login-error');
            const errorMessage = document.getElementById('error-message');
            const submitBtn = document.getElementById('btn-login-submit');

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Validando Acceso...';
            errorAlert.style.display = 'none';

            // 1. Intento de inicio de sesión con Supabase Auth (si está en línea)
            if (isDatabaseOnline && supabaseClient) {
                try {
                    const { data, error } = await supabaseClient.auth.signInWithPassword({
                        email: email,
                        password: password
                    });

                    if (!error && data?.session) {
                        localStorage.setItem('esteko_admin_session', email);
                        showDashboardView(email);
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<span><i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión Militar</span>';
                        return;
                    }
                } catch (err) {
                    console.warn("Fallo de auth en red, intentando validación local:", err);
                }
            }

            // 2. Fallback de validación local (Contraseña Maestra en código)
            if (password === LOCAL_MASTER_PASS) {
                localStorage.setItem('esteko_admin_session', email + " (Local Admin)");
                showDashboardView(email);
                showToast("Acceso Concedido con Contraseña Maestra");
            } else {
                // Denegado
                errorAlert.style.display = 'flex';
                errorMessage.textContent = "Contraseña o correo de administrador inválido.";
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span><i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión Militar</span>';
        });
    }

    // Listener para inicio de sesión con Google
    const googleLoginBtn = document.getElementById('btn-google-login');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            if (isDatabaseOnline && supabaseClient) {
                try {
                    googleLoginBtn.disabled = true;
                    googleLoginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando...';
                    const { error } = await supabaseClient.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: window.location.origin + window.location.pathname
                        }
                    });
                    if (error) {
                        console.error("Error al iniciar sesión con Google:", error);
                        alert("Error al conectar con Google: " + error.message);
                        googleLoginBtn.disabled = false;
                        googleLoginBtn.innerHTML = '<i class="fa-brands fa-google" style="color: #ea4335;"></i> Continuar con Google';
                    }
                } catch (err) {
                    console.error("Fallo de red en Google Auth:", err);
                    alert("Error de red al intentar conectar con Google.");
                    googleLoginBtn.disabled = false;
                    googleLoginBtn.innerHTML = '<i class="fa-brands fa-google" style="color: #ea4335;"></i> Continuar con Google';
                }
            } else {
                alert("La base de datos en la nube está desconectada. No se puede iniciar sesión con Google en este momento.");
            }
        });
    }

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (supabaseClient) {
                try {
                    await supabaseClient.auth.signOut();
                } catch (e) {}
            }
            localStorage.removeItem('esteko_admin_session');
            showToast("Sesión cerrada con éxito");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }
}

function showDashboardView(userEmail) {
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const userEmailEl = document.getElementById('logged-user-email');

    // Evitar recargas duplicadas de pestañas si el panel ya está visible para el mismo usuario
    if (dashboardContainer.style.display === 'flex' && userEmailEl.textContent === userEmail) {
        return;
    }

    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'flex';
    userEmailEl.textContent = userEmail;

    // Cargar los datos de la pestaña activa inicial
    loadTabContent('secciones');
}

// ==========================================================================
// 4. SISTEMA DE TABS Y NAVEGACIÓN
// ==========================================================================
function initDashboardTabs() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');

            // Toggle clases en links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Toggle panes
            const panes = document.querySelectorAll('.tab-pane');
            panes.forEach(pane => pane.classList.remove('active-pane'));
            
            const targetPane = document.getElementById('tab-' + tabId);
            if (targetPane) {
                targetPane.classList.add('active-pane');
                // Cargar datos
                loadTabContent(tabId);
            }
        });
    });
}

function loadTabContent(tabId) {
    if (tabId === 'secciones') {
        loadSectionsData();
    } else if (tabId === 'destinos') {
        loadDestinationsData();
    } else if (tabId === 'galeria') {
        loadGalleryData();
    } else if (tabId === 'configuracion') {
        loadConfigData();
    } else if (tabId === 'leads') {
        loadLeadsData();
    }
}

// ==========================================================================
// 5. PESTAÑA: SECCIONES (GET & SET)
// ==========================================================================
async function loadSectionsData() {
    let sections = DEFAULT_SECTIONS;

    if (isDatabaseOnline && supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('landing_sections')
                .select('*');

            if (!error && data && data.length > 0) {
                sections = {};
                data.forEach(item => {
                    sections[item.id] = {
                        title: item.title,
                        subtitle: item.subtitle,
                        content: item.content,
                        image_url: item.image_url
                    };
                });
                // Actualizar caché local
                localStorage.setItem('esteko_landing_sections', JSON.stringify(sections));
            }
        } catch (e) {
            console.warn("Fallo de red al leer secciones, usando LocalStorage.");
        }
    }

    // Si falló Supabase o no está online, usar LocalStorage
    if (!isDatabaseOnline) {
        sections = JSON.parse(localStorage.getItem('esteko_landing_sections')) || DEFAULT_SECTIONS;
    }

    // Inyectar datos en inputs
    // Hero
    document.getElementById('hero-title').value = sections.hero?.title || "";
    document.getElementById('hero-subtitle').value = sections.hero?.subtitle || "";
    document.getElementById('hero-text').value = sections.hero?.content || "";

    // Nosotros
    document.getElementById('nosotros-title').value = sections.nosotros?.title || "";
    document.getElementById('nosotros-content').value = sections.nosotros?.content || "";
    document.getElementById('nosotros-image').value = sections.nosotros?.image_url || "";

    // La Fiesta
    document.getElementById('fiesta-title').value = sections.fiesta?.title || "";
    document.getElementById('fiesta-content').value = sections.fiesta?.content || "";
    document.getElementById('fiesta-image').value = sections.fiesta?.image_url || "";

    // Educativo
    document.getElementById('educativo-title').value = sections.educativo?.title || "";
    document.getElementById('educativo-content').value = sections.educativo?.content || "";
    document.getElementById('educativo-image').value = sections.educativo?.image_url || "";

    // Configurar listeners de file uploader local
    initFileUploaderListeners('nosotros-file', 'nosotros-image');
    initFileUploaderListeners('fiesta-file', 'fiesta-image');
    initFileUploaderListeners('educativo-file', 'educativo-image');
}

// Configurar formulario de guardado
const formEditSections = document.getElementById('form-edit-sections');
if (formEditSections) {
    formEditSections.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('btn-save-sections');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando Textos...';

        const updatedSections = {
            hero: {
                title: document.getElementById('hero-title').value,
                subtitle: document.getElementById('hero-subtitle').value,
                content: document.getElementById('hero-text').value,
                image_url: ""
            },
            nosotros: {
                title: document.getElementById('nosotros-title').value,
                content: document.getElementById('nosotros-content').value,
                image_url: document.getElementById('nosotros-image').value
            },
            fiesta: {
                title: document.getElementById('fiesta-title').value,
                content: document.getElementById('fiesta-content').value,
                image_url: document.getElementById('fiesta-image').value
            },
            educativo: {
                title: document.getElementById('educativo-title').value,
                content: document.getElementById('educativo-content').value,
                image_url: document.getElementById('educativo-image').value
            }
        };

        // Guardar en LocalStorage
        localStorage.setItem('esteko_landing_sections', JSON.stringify(updatedSections));

        // Guardar en Supabase (si está online)
        let success = true;
        if (isDatabaseOnline && supabaseClient) {
            try {
                for (const sectionId of Object.keys(updatedSections)) {
                    const sec = updatedSections[sectionId];
                    const { error } = await supabaseClient
                        .from('landing_sections')
                        .upsert({
                            id: sectionId,
                            title: sec.title,
                            subtitle: sec.subtitle || "",
                            content: sec.content,
                            image_url: sec.image_url,
                            updated_at: new Date()
                        });
                    if (error) {
                        console.error(`Error guardando sección ${sectionId} en Supabase:`, error);
                        success = false;
                    }
                }
            } catch (err) {
                console.error("Fallo de red guardando secciones:", err);
                success = false;
            }
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Todos los Cambios de Texto';

        if (success) {
            showToast("Secciones actualizadas con éxito!");
        } else {
            showToast("Guardado localmente. (Error al escribir en la nube)");
        }
    });
}

// ==========================================================================
// 6. PESTAÑA: DESTINOS (CRUD OPERACIONES)
// ==========================================================================
let allDestinations = [];

async function loadDestinationsData() {
    const listContainer = document.getElementById('destinations-admin-container');
    listContainer.innerHTML = '<div class="loading-placeholder-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Sincronizando Catálogo...</div>';

    allDestinations = DEFAULT_DESTINATIONS;

    if (isDatabaseOnline && supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('landing_destinations')
                .select('*')
                .order('created_at', { ascending: true });

            if (!error && data) {
                allDestinations = data;
                localStorage.setItem('esteko_landing_destinations', JSON.stringify(allDestinations));
            }
        } catch (e) {
            console.warn("Fallo al leer destinos, usando caché local.");
        }
    }

    if (!isDatabaseOnline) {
        allDestinations = JSON.parse(localStorage.getItem('esteko_landing_destinations')) || DEFAULT_DESTINATIONS;
    }

    renderAdminDestinations();
}

function renderAdminDestinations() {
    const container = document.getElementById('destinations-admin-container');
    if (!container) return;

    if (allDestinations.length === 0) {
        container.innerHTML = '<div class="loading-placeholder-spinner">No hay destinos registrados. Creá uno nuevo.</div>';
        return;
    }

    container.innerHTML = '';
    allDestinations.forEach(dest => {
        const card = document.createElement('div');
        card.className = 'dest-card-admin';
        card.innerHTML = `
            <div class="dest-card-image">
                <img src="${dest.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=500&q=80'}" alt="${dest.name}">
                <span class="dest-badge-admin badge-${dest.category}-admin">${dest.category}</span>
            </div>
            <div class="dest-card-details">
                <h3>${dest.name}</h3>
                <span class="dest-duration-txt"><i class="fa-solid fa-clock"></i> ${dest.duration}</span>
                <p class="dest-desc-admin">${dest.description}</p>
                <div class="dest-card-financials">
                    <span>Precio Simulador: <strong>$${parseInt(dest.cost, 10).toLocaleString('es-AR')} ARS</strong></span>
                </div>
                <div class="dest-card-actions">
                    <button class="btn-edit-admin" onclick="openEditDestModal('${dest.id}')"><i class="fa-solid fa-pen-to-square"></i> Editar</button>
                    <button class="btn-delete-admin" onclick="deleteDestinationTrigger('${dest.id}')"><i class="fa-solid fa-trash-can"></i> Eliminar</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Evento para abrir modal de creación
const btnOpenCreateModal = document.getElementById('btn-open-create-destination-modal');
if (btnOpenCreateModal) {
    btnOpenCreateModal.addEventListener('click', () => {
        document.getElementById('form-destination-crud').reset();
        document.getElementById('dest-id').value = '';
        document.getElementById('dest-modal-title').innerHTML = '<i class="fa-solid fa-circle-plus"></i> Registrar Nuevo Viaje';
        document.getElementById('destination-modal').style.display = 'flex';
        initFileUploaderListeners('dest-file', 'dest-image');
    });
}

// Cerrar modal
const btnCloseModal = document.getElementById('btn-close-dest-modal');
const btnCancelModal = document.getElementById('btn-cancel-dest-modal');
const modalOverlay = document.getElementById('destination-modal');

if (btnCloseModal) btnCloseModal.addEventListener('click', closeModalFn);
if (btnCancelModal) btnCancelModal.addEventListener('click', closeModalFn);

function closeModalFn() {
    if (modalOverlay) modalOverlay.style.display = 'none';
}

// Abrir para editar
window.openEditDestModal = function(destId) {
    const dest = allDestinations.find(d => d.id === destId);
    if (!dest) return;

    document.getElementById('dest-id').value = dest.id;
    document.getElementById('dest-name').value = dest.name;
    document.getElementById('dest-category').value = dest.category;
    document.getElementById('dest-duration').value = dest.duration;
    document.getElementById('dest-price-info').value = dest.price_info;
    document.getElementById('dest-whatsapp-text').value = dest.whatsapp_text;
    document.getElementById('dest-cost').value = dest.cost;
    document.getElementById('dest-image').value = dest.image_url;
    document.getElementById('dest-description').value = dest.description;
    
    // Convertir array de servicios a string por saltos de línea
    const servicesStr = dest.services ? dest.services.join('\n') : '';
    document.getElementById('dest-services').value = servicesStr;

    document.getElementById('dest-modal-title').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar Información de Viaje';
    document.getElementById('destination-modal').style.display = 'flex';

    initFileUploaderListeners('dest-file', 'dest-image');
};

// Formulario de Submit de CRUD
const formDestCrud = document.getElementById('form-destination-crud');
if (formDestCrud) {
    formDestCrud.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('btn-save-dest-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando Destino...';

        const id = document.getElementById('dest-id').value;
        const name = document.getElementById('dest-name').value.trim();
        const category = document.getElementById('dest-category').value;
        const duration = document.getElementById('dest-duration').value.trim();
        const price_info = document.getElementById('dest-price-info').value.trim();
        const whatsapp_text = document.getElementById('dest-whatsapp-text').value.trim();
        const cost = parseInt(document.getElementById('dest-cost').value, 10);
        const image_url = document.getElementById('dest-image').value.trim();
        const description = document.getElementById('dest-description').value.trim();
        
        // Servicios a array
        const servicesText = document.getElementById('dest-services').value;
        const services = servicesText.split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        let finalId = id;
        let isNew = false;
        
        if (!id) {
            // Generar UUID si no hay
            finalId = 'uuid-' + Math.random().toString(36).substr(2, 9);
            isNew = true;
        }

        const destObj = {
            id: finalId,
            name,
            category,
            duration,
            description,
            image_url,
            price_info,
            whatsapp_text,
            services,
            cost,
            updated_at: new Date().toISOString()
        };

        if (isNew) {
            destObj.created_at = new Date().toISOString();
        }

        // Guardar en array local
        if (isNew) {
            allDestinations.push(destObj);
        } else {
            const index = allDestinations.findIndex(d => d.id === id);
            if (index !== -1) {
                // Preservar created_at
                destObj.created_at = allDestinations[index].created_at;
                allDestinations[index] = destObj;
            }
        }
        localStorage.setItem('esteko_landing_destinations', JSON.stringify(allDestinations));

        // Guardar en Supabase si está en línea
        let dbSaved = true;
        if (isDatabaseOnline && supabaseClient) {
            try {
                // Eliminar prefijo temporal "uuid-" si es nuevo y usar el UUID nativo de Supabase
                const dbObj = { ...destObj };
                if (isNew && dbObj.id.startsWith('uuid-')) {
                    delete dbObj.id; // Deja que Postgres autogenere
                }

                const { data, error } = await supabaseClient
                    .from('landing_destinations')
                    .upsert(dbObj);

                if (error) {
                    console.error("Error al escribir destino en Supabase:", error);
                    dbSaved = false;
                }
            } catch (err) {
                console.error("Fallo de red en CRUD destinos:", err);
                dbSaved = false;
            }
        }

        closeModalFn();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Guardar Destino';

        if (dbSaved) {
            showToast("Destino guardado en la nube con éxito!");
        } else {
            showToast("Guardado localmente. (Error de red en la nube)");
        }

        // Recargar pestaña
        loadDestinationsData();
    });
}

// Eliminar destino
window.deleteDestinationTrigger = async function(destId) {
    if (!confirm("¿Está seguro de eliminar este destino militarmente? Se borrará de la grilla y del simulador inmediatamente.")) {
        return;
    }

    // Borrado local
    allDestinations = allDestinations.filter(d => d.id !== destId);
    localStorage.setItem('esteko_landing_destinations', JSON.stringify(allDestinations));

    let dbDeleted = true;
    if (isDatabaseOnline && supabaseClient) {
        try {
            const { error } = await supabaseClient
                .from('landing_destinations')
                .delete()
                .eq('id', destId);

            if (error) {
                console.error("Error al borrar destino de Supabase:", error);
                dbDeleted = false;
            }
        } catch (err) {
            console.error("Fallo de red al borrar destino:", err);
            dbDeleted = false;
        }
    }

    if (dbDeleted) {
        showToast("Destino eliminado con éxito!");
    } else {
        showToast("Eliminado de forma local. (Error en la nube)");
    }

    loadDestinationsData();
};

// ==========================================================================
// 7. PESTAÑA: MULTIPLE FOTOS GALERIA (UPLOAD & MANAGER)
// ==========================================================================
let activeGallerySection = 'fiesta';
let galleryItems = [];

async function loadGalleryData() {
    const displayContainer = document.getElementById('admin-gallery-display');
    displayContainer.innerHTML = '<div class="gallery-empty-msg"><i class="fa-solid fa-spinner fa-spin"></i> Cargando fotos de galería...</div>';

    if (isDatabaseOnline && supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('landing_gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                galleryItems = data;
                localStorage.setItem('esteko_landing_gallery', JSON.stringify(galleryItems));
            }
        } catch (e) {
            console.warn("Fallo al leer galería de la nube, usando caché.");
        }
    }

    if (!isDatabaseOnline) {
        galleryItems = JSON.parse(localStorage.getItem('esteko_landing_gallery')) || [];
    }

    // Iniciar dropzone de subida
    initDropzoneUploader();

    renderAdminGallery();
}

function renderAdminGallery() {
    const displayContainer = document.getElementById('admin-gallery-display');
    if (!displayContainer) return;

    const filtered = galleryItems.filter(item => item.section === activeGallerySection);

    if (filtered.length === 0) {
        displayContainer.innerHTML = `<div class="gallery-empty-msg">No hay imágenes en la galería de ${activeGallerySection}. ¡Cargá una nueva foto!</div>`;
        return;
    }

    displayContainer.innerHTML = '';
    filtered.forEach(item => {
        const thumb = document.createElement('div');
        thumb.className = 'gallery-thumb-wrapper';
        thumb.innerHTML = `
            <img src="${item.image_url}" alt="Galería ${activeGallerySection}">
            <button class="btn-delete-thumb" onclick="deleteGalleryItemTrigger('${item.id}')" title="Eliminar Imagen"><i class="fa-solid fa-xmark"></i></button>
        `;
        displayContainer.appendChild(thumb);
    });
}

window.filterAdminGallery = function(section) {
    activeGallerySection = section;
    document.getElementById('btn-gallery-filter-fiesta').className = section === 'fiesta' ? 'btn-xs-tab active' : 'btn-xs-tab';
    document.getElementById('btn-gallery-filter-educativo').className = section === 'educativo' ? 'btn-xs-tab active' : 'btn-xs-tab';
    renderAdminGallery();
};

function initDropzoneUploader() {
    const dropzone = document.getElementById('gallery-dropzone');
    const fileInput = document.getElementById('gallery-file-input');
    const selectedLabel = document.getElementById('selected-file-label');

    if (!dropzone || !fileInput) return;

    dropzone.onclick = () => fileInput.click();

    dropzone.ondragover = (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--admin-primary)';
        dropzone.style.backgroundColor = 'rgba(230, 92, 0, 0.05)';
    };

    dropzone.ondragleave = (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        dropzone.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
    };

    dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        dropzone.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
        
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            handleSelectedGalleryFile(e.dataTransfer.files[0]);
        }
    };

    fileInput.onchange = () => {
        if (fileInput.files.length > 0) {
            handleSelectedGalleryFile(fileInput.files[0]);
        }
    };

    function handleSelectedGalleryFile(file) {
        if (selectedLabel) {
            selectedLabel.style.display = 'inline-block';
            selectedLabel.textContent = `Archivo seleccionado: ${file.name} (${Math.round(file.size / 1024)} KB)`;
        }
    }
}

// Cargar imagen de galería formulario
const formUploadGallery = document.getElementById('form-upload-gallery');
if (formUploadGallery) {
    formUploadGallery.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('btn-submit-gallery-img');
        const section = document.getElementById('gallery-upload-section').value;
        const fileInput = document.getElementById('gallery-file-input');
        const urlInput = document.getElementById('gallery-url-input');

        let imageUrl = urlInput.value.trim();
        const hasFile = fileInput.files.length > 0;

        if (!imageUrl && !hasFile) {
            alert("Por favor, selecciona un archivo de imagen o ingresa una URL de internet.");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cargando Imagen...';

        // 1. Si hay archivo, subirlo a Supabase Storage
        if (hasFile) {
            const file = fileInput.files[0];
            
            if (isDatabaseOnline && supabaseClient) {
                try {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${section}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                    const filePath = `gallery/${fileName}`;

                    // Subir archivo al bucket publico "landing-media"
                    const { data, error } = await supabaseClient.storage
                        .from('landing-media')
                        .upload(filePath, file);

                    if (!error) {
                        const { data: pubData } = supabaseClient.storage
                            .from('landing-media')
                            .getPublicUrl(filePath);
                        imageUrl = pubData.publicUrl;
                    } else {
                        console.error("Fallo de Storage Supabase, intentando fallback de lectura local base64:", error);
                        // Convertir a Base64 localmente
                        imageUrl = await convertFileToBase64(file);
                        showToast("Bucket 'landing-media' sin acceso. Guardada como imagen local.");
                    }
                } catch (err) {
                    console.error("Fallo de red en Storage:", err);
                    imageUrl = await convertFileToBase64(file);
                }
            } else {
                // Modo offline: guardar local en base64
                imageUrl = await convertFileToBase64(file);
            }
        }

        // 2. Registrar en base de datos / localStorage
        const newItem = {
            id: 'uuid-g-' + Math.random().toString(36).substr(2, 9),
            section: section,
            image_url: imageUrl,
            created_at: new Date().toISOString()
        };

        // Guardar local
        galleryItems.unshift(newItem);
        localStorage.setItem('esteko_landing_gallery', JSON.stringify(galleryItems));

        // Guardar en Supabase (si está online)
        let dbSaved = true;
        if (isDatabaseOnline && supabaseClient) {
            try {
                const dbObj = { ...newItem };
                if (dbObj.id.startsWith('uuid-g-')) delete dbObj.id; // Auto UUID en DB

                const { error } = await supabaseClient
                    .from('landing_gallery')
                    .insert(dbObj);

                if (error) {
                    console.error("Error registrando galería en Supabase:", error);
                    dbSaved = false;
                }
            } catch (err) {
                console.error("Fallo de red registrando galería:", err);
                dbSaved = false;
            }
        }

        // Limpiar inputs
        formUploadGallery.reset();
        document.getElementById('selected-file-label').style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Agregar Imagen a la Galería';

        if (dbSaved) {
            showToast("Imagen subida y agregada con éxito!");
        } else {
            showToast("Imagen agregada localmente.");
        }

        // Recargar
        loadGalleryData();
    });
}

// Convertidor a Base64 para fallback offline de imágenes
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Borrar foto de galería
window.deleteGalleryItemTrigger = async function(itemId) {
    if (!confirm("¿Está seguro de eliminar esta imagen militarmente?")) {
        return;
    }

    // Borrado local
    galleryItems = galleryItems.filter(item => item.id !== itemId);
    localStorage.setItem('esteko_landing_gallery', JSON.stringify(galleryItems));

    let dbDeleted = true;
    if (isDatabaseOnline && supabaseClient) {
        try {
            const { error } = await supabaseClient
                .from('landing_gallery')
                .delete()
                .eq('id', itemId);

            if (error) {
                console.error("Error al borrar galería en Supabase:", error);
                dbDeleted = false;
            }
        } catch (err) {
            console.error("Fallo de red al borrar galería:", err);
            dbDeleted = false;
        }
    }

    if (dbDeleted) {
        showToast("Imagen eliminada con éxito!");
    } else {
        showToast("Eliminada de forma local.");
    }

    loadGalleryData();
};

// ==========================================================================
// 8. PESTAÑA: CONFIGURACIÓN GENERAL Y SIMULADOR
// ==========================================================================
async function loadConfigData() {
    let config = DEFAULT_CONFIG;

    if (isDatabaseOnline && supabaseClient) {
        try {
            const { data, error } = await supabaseClient
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
            console.warn("Fallo al leer configuraciones de la nube, usando LocalStorage.");
        }
    }

    if (!isDatabaseOnline) {
        config = JSON.parse(localStorage.getItem('esteko_landing_config')) || DEFAULT_CONFIG;
    }

    // Inyectar datos en inputs
    document.getElementById('config-seña-percent').value = config.seña_percent || 20;
    document.getElementById('config-legajo').value = config.legajo || "";
    document.getElementById('config-legajo-url').value = config.legajo_url || "";
    document.getElementById('config-email').value = config.email || "";
    document.getElementById('config-whatsapp').value = config.whatsapp || "";
    
    // Redes
    document.getElementById('config-facebook').value = config.facebook || "";
    document.getElementById('config-instagram').value = config.instagram || "";
    document.getElementById('config-tiktok').value = config.tiktok || "";

    // Checkboxes de cuotas
    const quotas = config.quotas || [3, 6, 9, 12];
    document.getElementById('quota-3').checked = quotas.includes(3);
    document.getElementById('quota-6').checked = quotas.includes(6);
    document.getElementById('quota-9').checked = quotas.includes(9);
    document.getElementById('quota-12').checked = quotas.includes(12);
}

// Configuración submit formulario
const formSystemConfig = document.getElementById('form-system-config');
if (formSystemConfig) {
    formSystemConfig.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('btn-save-config');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando Configuraciones...';

        // Obtener cuotas seleccionadas
        const quotas = [];
        if (document.getElementById('quota-3').checked) quotas.push(3);
        if (document.getElementById('quota-6').checked) quotas.push(6);
        if (document.getElementById('quota-9').checked) quotas.push(9);
        if (document.getElementById('quota-12').checked) quotas.push(12);

        const updatedConfig = {
            seña_percent: parseInt(document.getElementById('config-seña-percent').value, 10),
            quotas: quotas,
            legajo: document.getElementById('config-legajo').value.trim(),
            legajo_url: document.getElementById('config-legajo-url').value.trim(),
            email: document.getElementById('config-email').value.trim(),
            whatsapp: document.getElementById('config-whatsapp').value.trim(),
            facebook: document.getElementById('config-facebook').value.trim(),
            instagram: document.getElementById('config-instagram').value.trim(),
            tiktok: document.getElementById('config-tiktok').value.trim()
        };

        // Guardar local
        localStorage.setItem('esteko_landing_config', JSON.stringify(updatedConfig));

        // Guardar en Supabase (si está online)
        let success = true;
        if (isDatabaseOnline && supabaseClient) {
            try {
                for (const key of Object.keys(updatedConfig)) {
                    const { error } = await supabaseClient
                        .from('landing_config')
                        .upsert({
                            key: key,
                            value: updatedConfig[key],
                            updated_at: new Date()
                        });
                    if (error) {
                        console.error(`Error guardando config ${key} en Supabase:`, error);
                        success = false;
                    }
                }
            } catch (err) {
                console.error("Fallo de red en guardado de config:", err);
                success = false;
            }
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Parámetros de Configuración';

        if (success) {
            showToast("Configuración general guardada en la nube!");
        } else {
            showToast("Guardada localmente. (Error en la nube)");
        }
    });
}

// ==========================================================================
// 9. PESTAÑA: LEADS CAPTURADOS (VER MENSAJES)
// ==========================================================================
let allLeads = [];

async function loadLeadsData() {
    const tableBody = document.getElementById('leads-table-body');
    const navLeadsBadge = document.getElementById('nav-leads-badge');
    tableBody.innerHTML = '<tr><td colspan="6" class="table-empty-placeholder"><i class="fa-solid fa-spinner fa-spin"></i> Cargando contactos...</td></tr>';

    allLeads = [];

    // 1. Cargar desde la nube (si está en línea)
    if (isDatabaseOnline && supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('landing_leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                allLeads = data;
            }
        } catch (e) {
            console.warn("Fallo al leer leads de la nube, cargando locales.");
        }
    }

    // 2. Cargar locales (LocalStorage de leads combinados)
    const localLeads = JSON.parse(localStorage.getItem('esteko_leads') || '[]');
    
    // Unir y dedupificar si es posible, o usar el local si no hay nube
    if (allLeads.length === 0) {
        allLeads = localLeads.reverse(); // Mostrar los más recientes primero
    }

    // Actualizar badge del menú lateral
    if (navLeadsBadge) {
        navLeadsBadge.textContent = allLeads.length;
    }

    renderLeadsTable();
}

function renderLeadsTable() {
    const tableBody = document.getElementById('leads-table-body');
    if (!tableBody) return;

    if (allLeads.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="table-empty-placeholder">No hay leads capturados todavía.</td></tr>';
        return;
    }

    tableBody.innerHTML = '';
    allLeads.forEach(lead => {
        const row = document.createElement('tr');
        
        // Formatear fecha
        const dateObj = new Date(lead.created_at || lead.registeredAt || new Date());
        const formattedDate = dateObj.toLocaleDateString('es-AR') + ' ' + dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

        // Whatsapp link directo
        const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, '') : '';
        const waTextEncoded = encodeURIComponent(`Hola ${lead.name}! Recibimos tu registro desde la web en Rutas del Esteko interesados en viajar a ${lead.destiny}. Contanos en qué podemos ayudarte.`);
        const waLink = `https://wa.me/54${cleanPhone}?text=${waTextEncoded}`;

        row.innerHTML = `
            <td class="lead-date-cell">${formattedDate}</td>
            <td class="lead-name-cell">${lead.name}</td>
            <td>+54 ${lead.phone}</td>
            <td>${lead.email}</td>
            <td><span class="dest-badge-admin badge-mas-admin" style="position:static;">${lead.destiny}</span></td>
            <td>
                <a href="${waLink}" target="_blank" class="lead-whatsapp-btn"><i class="fa-brands fa-whatsapp"></i> Chat WhatsApp</a>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Vaciar Leads
const btnClearLeads = document.getElementById('btn-clear-leads');
if (btnClearLeads) {
    btnClearLeads.addEventListener('click', async () => {
        if (!confirm("¿Está seguro de vaciar el listado de leads? Esta acción no se puede deshacer.")) {
            return;
        }

        localStorage.setItem('esteko_leads', JSON.stringify([]));

        let dbDeleted = true;
        if (isDatabaseOnline && supabaseClient) {
            try {
                // Borrar todos los registros de la tabla
                const { error } = await supabaseClient
                    .from('landing_leads')
                    .delete()
                    .neq('id', '00000000-0000-0000-0000-000000000000'); // Elimina todos los registros de forma RLS-friendly

                if (error) {
                    console.error("Error vaciando leads de Supabase:", error);
                    dbDeleted = false;
                }
            } catch (err) {
                dbDeleted = false;
            }
        }

        showToast("Listado de leads vaciado.");
        loadLeadsData();
    });
}

// ==========================================================================
// 10. UTILIDADES GLOBALES (UPLOADER & TOAST)
// ==========================================================================
// Helper para inyectar subida de archivo a base64 instantáneo en inputs
function initFileUploaderListeners(fileInputId, targetInputId) {
    const fileInput = document.getElementById(fileInputId);
    const targetInput = document.getElementById(targetInputId);

    if (!fileInput || !targetInput) return;

    fileInput.onchange = async () => {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const originalLabel = fileInput.nextElementSibling;
            
            if (originalLabel) {
                originalLabel.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subiendo...';
            }

            // 1. Si Supabase está en línea, subir a Storage
            if (isDatabaseOnline && supabaseClient) {
                try {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `media-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                    const filePath = `uploads/${fileName}`;

                    const { data, error } = await supabaseClient.storage
                        .from('landing-media')
                        .upload(filePath, file);

                    if (!error) {
                        const { data: pubData } = supabaseClient.storage
                            .from('landing-media')
                            .getPublicUrl(filePath);
                        targetInput.value = pubData.publicUrl;
                        showToast("Archivo subido a Supabase Storage!");
                    } else {
                        // Fallback a base64
                        const b64 = await convertFileToBase64(file);
                        targetInput.value = b64;
                        showToast("Bucket cerrado. Subido en formato de lectura local.");
                    }
                } catch (err) {
                    const b64 = await convertFileToBase64(file);
                    targetInput.value = b64;
                }
            } else {
                // Sencillo convertidor offline
                const b64 = await convertFileToBase64(file);
                targetInput.value = b64;
                showToast("Modo offline: Imagen codificada con éxito.");
            }

            if (originalLabel) {
                originalLabel.innerHTML = '<i class="fa-solid fa-upload"></i> Subir';
            }
        }
    };
}

// Toast Notificaciones
function showToast(message) {
    const toast = document.getElementById('admin-toast-notification');
    const toastMsg = document.getElementById('toast-message');

    if (toast && toastMsg) {
        toastMsg.textContent = message;
        toast.style.display = 'flex';
        
        // Desvanecer después de 3.5 segundos
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3500);
    }
}

// Copy SQL code block
const btnCopySql = document.getElementById('btn-copy-sql-code');
if (btnCopySql) {
    btnCopySql.addEventListener('click', () => {
        const sqlTextarea = document.getElementById('sql-code-text');
        if (sqlTextarea) {
            sqlTextarea.select();
            document.execCommand('copy');
            showToast("Código SQL copiado al portapapeles militar!");
        }
    });
}
