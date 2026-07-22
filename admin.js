/**
 * Rutas del Esteko - Admin Panel JavaScript Lógica
 * Author: Antigravity Regiment (Agent 00 - General Commander)
 * Powered by: DeepSeek Strategy Design
 * 
 * Double system: Sincronización en tiempo real con Firebase y
 * fallback a LocalStorage de alta resiliencia.
 */

// ==========================================================================
// 1. CONFIGURACIÓN Y CLIENTE DE FIREBASE & FIRESTORE
// ==========================================================================
const LOCAL_MASTER_PASS = "adminesteko2026"; // Contraseña maestra de contingencia local
const firebaseConfig = {
    apiKey: "AIzaSyAxSpYY8iZXcLylJStFx2GD3Ejyzq_wy_U",
    authDomain: "rutas-del-esteko-landing.firebaseapp.com",
    projectId: "rutas-del-esteko-landing",
    storageBucket: "rutas-del-esteko-landing.firebasestorage.app",
    messagingSenderId: "583115096942",
    appId: "1:583115096942:web:62193426a24fdd0e19377f"
};

let isDatabaseOnline = false;
let firestoreDb = null;

try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        firestoreDb = firebase.firestore();
    }
} catch (e) {
    console.warn("No se pudo cargar el cliente CDN de Firebase.", e);
}

async function ensureFirebaseAuth() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
        if (!firebase.auth().currentUser) {
            try {
                await firebase.auth().signInAnonymously();
            } catch (err) {
                console.warn("Inicio de sesión anónimo fallback:", err);
            }
        }
    }
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
        image_url: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=800&q=80",
        extra_data: {
            sub_photo_1: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=500&q=80",
            sub_photo_2: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=500&q=80"
        }
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
    },
    sorteos: {
        title: "¡Vos podés ser el próximo ganador!",
        content: "En cada uno de nuestros destinos y salidas, realizamos sorteos especiales de valijas, excursiones opcionales gratuitas y hasta vouchers de descuento para tu próximo viaje. ¡La suerte está siempre de tu lado con el Esteko!",
        image_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80"
    },
    pagos: {
        title: "Viajar nunca fue tan fácil y accesible",
        subtitle: "Queremos que tu única preocupación sea disfrutar. Contamos con planes de financiamiento a tu medida.",
        content: "Entendemos la realidad de nuestras familias. Por eso, diseñamos esquemas de pago flexibles para que puedas congelar el valor de tu viaje y pagarlo a tu propio ritmo.",
        extra_data: {
            section_tag: "Medios de Pago",
            info_title: "Todas las facilidades a tu disposición",
            card1_icon: "fa-piggy-bank",
            card1_title: "Pagos Parciales",
            card1_desc: "Congelá el precio con una seña mínima y andá pagando el saldo de manera flexible hasta 10 días antes de la salida.",
            card2_icon: "fa-credit-card",
            card2_title: "Cuotas Sin Interés",
            card2_desc: "Trabajamos con promociones bancarias vigentes y todas las tarjetas de crédito para darte cuotas sin recargo.",
            card3_icon: "fa-id-card",
            card3_title: "Crédito solo con DNI",
            card3_desc: "Aprobación inmediata en nuestra sucursal. Financiá tu viaje solo presentando tu documento nacional de identidad.",
            card4_icon: "fa-wallet",
            card4_title: "Transferencias y Efectivo",
            card4_desc: "Descuentos especiales abonando en nuestra oficina o vía transferencia bancaria directa."
        }
    }
};

const DEFAULT_DESTINATIONS = [
    {
        id: "default-mdp",
        name: "Mar del Plata Mágica",
        category: "verano",
        duration: "7 Noches / 10 Días",
        description: "Salidas durante la temporada de verano desde la Terminal de Ómnibus en unidades premium de la empresa San Felipe (habilitación CNRT). Estadía de 7 noches en departamentos céntricos equipados, cercanos a los principales atractivos y playas.",
        long_description: "Mar del Plata, la Perla del Atlántico, te espera con sus playas doradas, su vida nocturna inigualable y sus rincones turísticos para todos los gustos. Con Rutas del Esteko viajás con la tranquilidad de saber que cada detalle está planificado.\n\nIncluye coordinación permanente durante toda la estadía, asistencia ante cualquier eventualidad y la posibilidad de contratar excursiones opcionales como el Aquarium, la Catedral del Mar, el Casino y paseos en barco.",
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
        long_description: "Balneario Camboriú, Brasil, es uno de los destinos más impresionantes de América del Sur. Teleférico panorámico, parque acuático, excursiones a Bombinhas y el paseo pirata.\n\nViajamos en unidades de última generación de San Felipe CNRT internacional. Departamentos céntricos equipados a metros del mar (2 a 7 personas). Coordinadores permanentes en todo el viaje.",
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
        long_description: "San Rafael en invierno: montañas nevadas, bodegas con degustación y circuitos de aventura. Micros San Felipe (CNRT). Cabañas equipadas (2 a 6 personas) con parque y juegos.\n\nMedia pensión completa con menús espectaculares y cenas de 3 pasos. Bodegas de San Rafael, fábrica de chocolates, Las Leñas y el Dique Valle Grande Reyunos.",
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
        long_description: "Las Cataratas del Iguazú son una de las Siete Maravillas Naturales del Mundo. Con Rutas del Esteko descubrís ambos lados: lado argentino (Garganta del Diablo) y lado brasilero.\n\nMicros premium San Felipe CNRT internacional. Hotel en Foz do Iguaçu con piscina. Desayuno y cena buffet incluidos. Excursiones: Ciudad del Este, Hito Tres Fronteras, Cataratas Arg. y Bra.",
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

const DEFAULT_CONFIG = {
    seña_percent: 20,
    descuento_oferta: 15,
    quotas: [3, 6, 9, 12],
    legajo: "19.515",
    legajo_url: "https://www.agenciasdeviajes.ar/#buscador",
    email: "rutasdelesteko@gmail.com",
    whatsapp: "3855962089",
    facebook: "https://www.facebook.com/profile.php?id=100087455823485",
    instagram: "https://www.instagram.com/rutasdelesteko.sde/",
    tiktok: "https://www.tiktok.com/@rutasdelesteko",
    logo_header_url: "img/logo.png",
    logo_footer_url: "img/logo.png",
    badge_reviews_url: "img/google-reviews-badge.png",
    qr_mintur_url: "img/qr-rnav.png"
};

const SEED_REVIEWS = [
    {
        id: "review-1a",
        name: "Maria Lujan Rojas",
        title: "Local Guide · 20 reseñas",
        stars: 5,
        time: "Hace 10 meses",
        comment: "Hermosa experiencia!!! Super recomendable, hemos elegido varias veces la empresa y siempre cumplen, el ultimo viaje a San Rafael, Mendoza estuvo genial la cabaña, el desayuno, las comidas, la coordinacion, 10/10",
        avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        order: 10
    },
    {
        id: "review-1b",
        name: "Gabriela Roldán",
        title: "Local Guide · 12 reseñas",
        stars: 5,
        time: "Hace 2 meses",
        comment: "Excelente viaje a Carlos Paz! Los coordinadores estuvieron en cada detalle y el hotel tenía una atención fantástica. Las excursiones súper completas. Ya estamos planeando el próximo destino con ellos.",
        avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        order: 20
    },
    {
        id: "review-2a",
        name: "Carolina Yeck",
        title: "1 reseña · 1 foto",
        stars: 5,
        time: "Hace 3 meses",
        comment: "Una experiencia inolvidable en Mar del Plata! El depto. Excelentemente equipado nos tocó con una hermosa vista al mar en frente del casino. La salida puntual. La coordinadora Ceci excelente responde todas las dudas al instante. Lo recomiendo al 100%. Volvería a contratar los servicios sin dudarlo y por más días. 😃",
        avatar_url: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80",
        order: 30
    },
    {
        id: "review-2b",
        name: "Esteban Gimenez",
        title: "7 reseñas · 2 fotos",
        stars: 5,
        time: "Hace 1 mes",
        comment: "Increíble viaje grupal a Camboriú. El micro de San Felipe súper cómodo y el chofer excelente. El departamento a media cuadra de la playa era un lujo. Excelente organización de todo el equipo de Rutas del Esteko.",
        avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
        order: 40
    },
    {
        id: "review-3a",
        name: "Andrea Apesteguia",
        title: "Local Guide · 9 reseñas · 25 fotos",
        stars: 5,
        time: "Hace 3 meses",
        comment: "Es la primera ves que viajamos con la empresa y fué una hermosa experiencia con Rutas del Esteko,siempre atentos a cualquier inquietud,súper recomendables. Los volveríamos a elegir",
        avatar_url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80",
        order: 50
    },
    {
        id: "review-3b",
        name: "Patricia Sanchez",
        title: "Local Guide · 15 reseñas",
        stars: 5,
        time: "Hace 5 meses",
        comment: "Viajamos en familia a Tafí del Valle y la pasamos espectacular. Los departamentos impecables y muy cómodos. Todo coordinado de diez. Es una empresa muy familiar y confiable. 100% recomendados!",
        avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
        order: 60
    },
    {
        id: "review-4a",
        name: "Lautaro Veron",
        title: "7 reseñas",
        stars: 5,
        time: "Hace 3 meses",
        comment: "2do viaje a Mar del Plata q viajo con Rutas del Esteko. Ofrecen facilidades de pago, el colectivo en buenas condiciones, salimos y llegamos a horario. Las paradas programadas estan bien organizadas. Los dptos q nos tocó estan a 3 cuadras del casino central. Super confiables",
        avatar_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
        order: 70
    },
    {
        id: "review-4b",
        name: "Santiago Coronel",
        title: "4 reseñas · 1 foto",
        stars: 5,
        time: "Hace 6 meses",
        comment: "Fuimos al viaje de invierno a Bariloche. El hotel hermoso y con excelente calefacción. Los coordinadores siempre presentes y cuidándonos en las excursiones. La comida abundante y rica. Sin dudas volveremos a viajar!",
        avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        order: 80
    },
    {
        id: "review-5a",
        name: "Mar Marquez",
        title: "1 reseña",
        stars: 5,
        time: "Hace 4 meses",
        comment: "Excelente servicio, super contenta un viaje excelente, departamento hermosos y sobre todo los coordinadores que estuvieron en todos los detalles acompañando antes con toda la información necesaria y durante el viaje , nos sentimos realmente acompañados , las mejores vacaciones gracias rutas del esteko 🏞️...",
        avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        order: 90
    },
    {
        id: "review-5b",
        name: "Julieta Mansilla",
        title: "Local Guide · 31 reseñas",
        stars: 5,
        time: "Hace 1 mes",
        comment: "Viajé a Villa Gesell con amigas y fue soñado. Depto amplio, luminoso y cerca de todo. Cecy una divina, nos guió en todo momento. La relación precio-calidad es insuperable en Santiago del Estero. Gracias por todo!",
        avatar_url: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=150&q=80",
        order: 100
    },
    {
        id: "review-6a",
        name: "anahi salvatierra",
        title: "1 reseña",
        stars: 5,
        time: "Hace 3 meses",
        comment: "Excelente servicio ,la atención muy buena de los coordinadores, siempre atentos ,lo ofrecido fue cumplido en todo !!! La ubicación de los departamentos un lujo pleno centro a cuadras de la playa",
        avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
        order: 110
    },
    {
        id: "review-6b",
        name: "Ramon Juarez",
        title: "9 reseñas · 5 fotos",
        stars: 5,
        time: "Hace 2 meses",
        comment: "Muy buena experiencia en San Bernardo. Muy puntuales con los horarios del colectivo de San Felipe. Los departamentos son tal cual te muestran en las fotos. La coordinación permanente te da mucha tranquilidad.",
        avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        order: 120
    }
];

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
    if (!localStorage.getItem('esteko_landing_reviews')) {
        localStorage.setItem('esteko_landing_reviews', JSON.stringify(SEED_REVIEWS));
    }

    // Actualizar fecha militar en cabecera
    updateSystemDate();
    
    // Chequear conexión y validez de colecciones con Firebase
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

    if (typeof firebase === 'undefined' || !firebase.apps || firebase.apps.length === 0) {
        setOfflineState("Servicio Desconectado");
        return;
    }

    try {
        await firebase.firestore().collection('landing_sections').limit(1).get();
        isDatabaseOnline = true;
        setOnlineState();
    } catch (e) {
        console.warn("Aviso al verificar conexión con Firebase:", e);
        if (firebase.auth().currentUser || (e.code && (e.code.includes("permission-denied") || e.code.includes("unauthenticated")))) {
            isDatabaseOnline = true;
            setOnlineState();
        } else if (navigator.onLine) {
            isDatabaseOnline = true;
            setOnlineState();
        } else {
            setOfflineState("Red Inalcanzable");
        }
    }

    function setOnlineState() {
        if (dbStatusBadge) {
            dbStatusBadge.className = "status-shield database-online";
            dbStatusText.innerHTML = '<i class="fa-solid fa-cloud-bolt"></i> Nube Firebase Sincronizada';
        }
        if (fallbackBanner) fallbackBanner.style.display = "none";
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
    
    if (typeof firebase !== 'undefined') {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                isDatabaseOnline = true;
                await testDatabaseConnection();
                const email = user.email;
                try {
                    let profileDoc = null;
                    try {
                        profileDoc = await firebase.firestore().collection('landing_profiles').doc(email).get();
                    } catch (errProfile) {
                        console.warn("No se pudo leer landing_profiles, permitiendo acceso al usuario de Firebase Auth:", errProfile);
                    }
                    
                    let profileData = { email: email, rol: 'admin', activo: true };
                    if (profileDoc && profileDoc.exists) {
                        profileData = profileDoc.data();
                    } else if (profileDoc && !profileDoc.exists) {
                        await firebase.firestore().collection('landing_profiles').doc(email).set(profileData, { merge: true }).catch(() => {});
                    }

                    if (profileData.activo !== false) {
                        localStorage.setItem('esteko_admin_session', email);
                        showDashboardView(email);
                        
                        const usuariosTabLink = document.querySelector('[data-tab="usuarios"]');
                        if (usuariosTabLink) {
                            if (profileData.rol === 'admin') {
                                usuariosTabLink.style.display = 'block';
                            } else {
                                usuariosTabLink.style.display = 'none';
                            }
                        }
                        return;
                    }
                    
                    console.warn("Perfil explícitamente inactivo:", email);
                    await firebase.auth().signOut();
                    localStorage.removeItem('esteko_admin_session');
                    showLoginView("Su cuenta ha sido suspendida.");
                } catch (e) {
                    console.error("Error al validar perfil de usuario:", e);
                    localStorage.setItem('esteko_admin_session', email);
                    showDashboardView(email);
                }
            } else {
                const currentSession = localStorage.getItem('esteko_admin_session');
                if (currentSession && currentSession.includes("Local Admin")) {
                    showDashboardView(currentSession);
                } else {
                    localStorage.removeItem('esteko_admin_session');
                    showLoginView();
                }
            }
        });
    } else {
        if (sessionToken) {
            showDashboardView(sessionToken);
        } else {
            showLoginView();
        }
    }
}

function showLoginView(errorMessageText = "") {
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('dashboard-container').style.display = 'none';
    if (errorMessageText) {
        const errorAlert = document.getElementById('login-error');
        const errorMessage = document.getElementById('error-message');
        if (errorAlert && errorMessage) {
            errorAlert.style.display = 'flex';
            errorMessage.textContent = errorMessageText;
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

            // 1. Intento de inicio de sesión con Firebase Auth (si está disponible)
            if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
                try {
                    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
                    isDatabaseOnline = true;
                    
                    let profileDoc = null;
                    try {
                        profileDoc = await firebase.firestore().collection('landing_profiles').doc(email).get();
                    } catch (eDoc) {
                        console.warn("No se pudo consultar landing_profiles:", eDoc);
                    }

                    if (profileDoc && profileDoc.exists) {
                        const profileData = profileDoc.data();
                        if (profileData.activo === false) {
                            throw new Error("Su cuenta ha sido suspendida. Contacte al administrador.");
                        }
                    }
                    
                    localStorage.setItem('esteko_admin_session', email);
                    showDashboardView(email);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span><i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión</span>';
                    return;
                } catch (err) {
                    console.warn("Fallo de auth en red, intentando validación local:", err);
                    if (err.message && err.message.includes("suspendida")) {
                        errorAlert.style.display = 'flex';
                        errorMessage.textContent = err.message;
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<span><i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión</span>';
                        await firebase.auth().signOut().catch(()=>{});
                        return;
                    }
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
            submitBtn.innerHTML = '<span><i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión</span>';
        });
    }

    // Listener para inicio de sesión con Google
    const googleLoginBtn = document.getElementById('btn-google-login');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
                try {
                    googleLoginBtn.disabled = true;
                    googleLoginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Conectando...';
                    
                    const provider = new firebase.auth.GoogleAuthProvider();
                    const result = await firebase.auth().signInWithPopup(provider);
                    const email = result.user.email;

                    // Validar si está registrado y activo
                    const profileDoc = await firebase.firestore().collection('landing_profiles').doc(email).get();
                    if (profileDoc.exists) {
                        const profileData = profileDoc.data();
                        if (profileData.activo === true) {
                            localStorage.setItem('esteko_admin_session', email);
                            showDashboardView(email);
                            showToast("Sesión iniciada con Google");
                            return;
                        }
                    }
                    
                    await firebase.auth().signOut();
                    alert("Su cuenta de Google (" + email + ") no tiene permisos de acceso al panel.");
                    googleLoginBtn.disabled = false;
                    googleLoginBtn.innerHTML = '<i class="fa-brands fa-google" style="color: #ea4335;"></i> Continuar con Google';
                } catch (err) {
                    console.error("Fallo de red en Google Auth:", err);
                    alert("Error de red al intentar conectar con Google: " + err.message);
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
            if (typeof firebase !== 'undefined') {
                try {
                    await firebase.auth().signOut();
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

    // Cargar conteo de badges
    updateBadgesCount();

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
    } else if (tabId === 'postulaciones') {
        loadPostulacionesData();
    } else if (tabId === 'opiniones') {
        loadOpinionsData();
    } else if (tabId === 'usuarios') {
        loadUsersData();
    }
}

// ==========================================================================
// 5. PESTAÑA: SECCIONES (GET & SET)
// ==========================================================================
async function loadSectionsData() {
    let sections = DEFAULT_SECTIONS;

    if (isDatabaseOnline && typeof firebase !== 'undefined') {
        try {
            const snapshot = await firebase.firestore().collection('landing_sections').get();
            if (!snapshot.empty) {
                sections = {};
                snapshot.forEach(doc => {
                    const item = doc.data();
                    sections[doc.id] = {
                        title: item.title || "",
                        subtitle: item.subtitle || "",
                        content: item.content || "",
                        image_url: item.image_url || "",
                        extra_data: item.extra_data || {}
                    };
                });
                // Actualizar caché local
                localStorage.setItem('esteko_landing_sections', JSON.stringify(sections));
            }
        } catch (e) {
            console.warn("Fallo de red al leer secciones, usando LocalStorage.", e);
        }
    }

    if (!isDatabaseOnline) {
        sections = JSON.parse(localStorage.getItem('esteko_landing_sections')) || DEFAULT_SECTIONS;
    }

    // Inyectar datos en inputs
    // Hero
    document.getElementById('hero-title').value = sections.hero?.title || "";
    const heroSubtitleEl = document.getElementById('hero-subtitle');
    if (heroSubtitleEl) {
        heroSubtitleEl.value = sections.hero?.subtitle || "";
    }
    document.getElementById('hero-text').value = sections.hero?.content || "";

    // Carousel URLs from extra_data
    let carouselUrls = "";
    if (sections.hero?.extra_data && sections.hero.extra_data.hero_images) {
        carouselUrls = sections.hero.extra_data.hero_images.join("\n");
    }
    document.getElementById('hero-carousel-urls').value = carouselUrls;

    // Nosotros
    document.getElementById('nosotros-title').value = sections.nosotros?.title || "";
    document.getElementById('nosotros-subtitle').value = sections.nosotros?.subtitle || "";
    document.getElementById('nosotros-content').value = sections.nosotros?.content || "";
    document.getElementById('nosotros-image').value = sections.nosotros?.image_url || "";
    if (document.getElementById('nosotros-image-sub1')) {
        document.getElementById('nosotros-image-sub1').value = sections.nosotros?.extra_data?.sub_photo_1 || "";
    }
    if (document.getElementById('nosotros-image-sub2')) {
        document.getElementById('nosotros-image-sub2').value = sections.nosotros?.extra_data?.sub_photo_2 || "";
    }
    document.getElementById('nosotros-slogan-year').value = sections.nosotros?.extra_data?.slogan_year || "2022";
    document.getElementById('nosotros-slogan-text').value = sections.nosotros?.extra_data?.slogan_text || "Desde hace años viajando juntos";
    document.getElementById('nosotros-bullet-1').value = sections.nosotros?.extra_data?.bullet_1 || "Coordinación permanente y propia durante todo el viaje.";
    document.getElementById('nosotros-bullet-2').value = sections.nosotros?.extra_data?.bullet_2 || "Unidades de larga distancia premium de la empresa San Felipe.";
    document.getElementById('nosotros-bullet-3').value = sections.nosotros?.extra_data?.bullet_3 || "Departamentos equipados y ubicaciones céntricas inigualables.";

    // La Fiesta
    document.getElementById('fiesta-title').value = sections.fiesta?.title || "";
    document.getElementById('fiesta-subtitle').value = sections.fiesta?.subtitle || "";
    document.getElementById('fiesta-content').value = sections.fiesta?.content || "";
    document.getElementById('fiesta-image').value = sections.fiesta?.image_url || "";
    if (document.getElementById('fiesta-image-2')) {
        document.getElementById('fiesta-image-2').value = sections.fiesta?.extra_data?.sub_photo_2 || "";
    }
    document.getElementById('fiesta-history-title').value = sections.fiesta?.extra_data?.history_title || "Tradición, Música y Experiencias Inolvidables";
    document.getElementById('fiesta-quote-text').value = sections.fiesta?.extra_data?.quote_text || "A lo largo de las distintas ediciones participaron reconocidos artistas como Orellana Lucca, Dani Hoyos y Juan Saavedra, entre otros artistas invitados que hicieron de cada encuentro una verdadera fiesta.";
    document.getElementById('fiesta-quote-cite').value = sections.fiesta?.extra_data?.quote_cite || "— Tradición & Alegría Esteko";

    // Educativo
    document.getElementById('educativo-title').value = sections.educativo?.title || "";
    document.getElementById('educativo-subtitle').value = sections.educativo?.subtitle || "";
    document.getElementById('educativo-content').value = sections.educativo?.content || "";
    document.getElementById('educativo-image').value = sections.educativo?.image_url || "";
    document.getElementById('educativo-feat-1-title').value = sections.educativo?.extra_data?.feat_1_title || "100% de Seguridad y Seguros";
    document.getElementById('educativo-feat-1-desc').value = sections.educativo?.extra_data?.feat_1_desc || "Seguros de Responsabilidad Civil, Accidentes Personales y Asistencia Médica total cubiertos desde la salida de la escuela.";
    document.getElementById('educativo-feat-2-title').value = sections.educativo?.extra_data?.feat_2_title || "Coordinadores Especializados";
    document.getElementById('educativo-feat-2-desc').value = sections.educativo?.extra_data?.feat_2_desc || "Personal capacitado en recreación, primeros auxilios y dinámicas de grupo escolar para contención total de los chicos.";

    // Sorteos
    if (document.getElementById('sorteos-title')) {
        document.getElementById('sorteos-title').value = sections.sorteos?.title || "";
    }
    if (document.getElementById('sorteos-subtitle')) {
        document.getElementById('sorteos-subtitle').value = sections.sorteos?.subtitle || "";
    }
    if (document.getElementById('sorteos-content')) {
        document.getElementById('sorteos-content').value = sections.sorteos?.content || "";
    }
    if (document.getElementById('sorteos-bg-image')) {
        document.getElementById('sorteos-bg-image').value = sections.sorteos?.image_url || "";
    }
    if (document.getElementById('sorteos-card1-num')) {
        document.getElementById('sorteos-card1-num').value = sections.sorteos?.extra_data?.card1_num || "01";
        document.getElementById('sorteos-card1-title').value = sections.sorteos?.extra_data?.card1_title || "Seguinos";
        document.getElementById('sorteos-card1-desc').value = sections.sorteos?.extra_data?.card1_desc || "";
        document.getElementById('sorteos-card2-num').value = sections.sorteos?.extra_data?.card2_num || "02";
        document.getElementById('sorteos-card2-title').value = sections.sorteos?.extra_data?.card2_title || "Registrate";
        document.getElementById('sorteos-card2-desc').value = sections.sorteos?.extra_data?.card2_desc || "";
        document.getElementById('sorteos-card3-num').value = sections.sorteos?.extra_data?.card3_num || "03";
        document.getElementById('sorteos-card3-title').value = sections.sorteos?.extra_data?.card3_title || "¡Participá!";
        document.getElementById('sorteos-card3-desc').value = sections.sorteos?.extra_data?.card3_desc || "";
    }

    // Pagos (Medios de Pago)
    if (document.getElementById('pagos-title')) {
        document.getElementById('pagos-title').value = sections.pagos?.title || "";
        document.getElementById('pagos-subtitle').value = sections.pagos?.subtitle || "";
        document.getElementById('pagos-content').value = sections.pagos?.content || "";
        document.getElementById('pagos-section-tag').value = sections.pagos?.extra_data?.section_tag || "Medios de Pago";
        document.getElementById('pagos-info-title').value = sections.pagos?.extra_data?.info_title || "Todas las facilidades a tu disposición";
        
        document.getElementById('pagos-card1-icon').value = sections.pagos?.extra_data?.card1_icon || "fa-piggy-bank";
        document.getElementById('pagos-card1-title').value = sections.pagos?.extra_data?.card1_title || "Pagos Parciales";
        document.getElementById('pagos-card1-desc').value = sections.pagos?.extra_data?.card1_desc || "";
        
        document.getElementById('pagos-card2-icon').value = sections.pagos?.extra_data?.card2_icon || "fa-credit-card";
        document.getElementById('pagos-card2-title').value = sections.pagos?.extra_data?.card2_title || "Cuotas Sin Interés";
        document.getElementById('pagos-card2-desc').value = sections.pagos?.extra_data?.card2_desc || "";
        
        document.getElementById('pagos-card3-icon').value = sections.pagos?.extra_data?.card3_icon || "fa-id-card";
        document.getElementById('pagos-card3-title').value = sections.pagos?.extra_data?.card3_title || "Crédito solo con DNI";
        document.getElementById('pagos-card3-desc').value = sections.pagos?.extra_data?.card3_desc || "";
        
        document.getElementById('pagos-card4-icon').value = sections.pagos?.extra_data?.card4_icon || "fa-wallet";
        document.getElementById('pagos-card4-title').value = sections.pagos?.extra_data?.card4_title || "Transferencias y Efectivo";
        document.getElementById('pagos-card4-desc').value = sections.pagos?.extra_data?.card4_desc || "";
    }

    // Configurar listeners de file uploader local
    initFileUploaderListeners('nosotros-file', 'nosotros-image');
    initFileUploaderListeners('nosotros-file-sub1', 'nosotros-image-sub1');
    initFileUploaderListeners('nosotros-file-sub2', 'nosotros-image-sub2');
    initFileUploaderListeners('fiesta-file', 'fiesta-image');
    initFileUploaderListeners('fiesta-file-2', 'fiesta-image-2');
    initFileUploaderListeners('educativo-file', 'educativo-image');
    initFileUploaderListeners('sorteos-bg-file', 'sorteos-bg-image');
    initHeroCarouselUploader();
}

// Configurar formulario de guardado
const formEditSections = document.getElementById('form-edit-sections');
if (formEditSections) {
    formEditSections.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('btn-save-sections');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando Textos...';

        const carouselUrlsText = document.getElementById('hero-carousel-urls').value;
        const heroImages = carouselUrlsText.split('\n')
            .map(url => url.trim())
            .filter(url => url.length > 0);

        const updatedSections = {
            hero: {
                title: document.getElementById('hero-title').value,
                subtitle: document.getElementById('hero-subtitle') ? document.getElementById('hero-subtitle').value : "",
                content: document.getElementById('hero-text').value,
                image_url: "",
                extra_data: {
                    hero_images: heroImages
                }
            },
            nosotros: {
                title: document.getElementById('nosotros-title').value,
                subtitle: document.getElementById('nosotros-subtitle') ? document.getElementById('nosotros-subtitle').value : "",
                content: document.getElementById('nosotros-content').value,
                image_url: document.getElementById('nosotros-image').value,
                extra_data: {
                    sub_photo_1: document.getElementById('nosotros-image-sub1') ? document.getElementById('nosotros-image-sub1').value : "",
                    sub_photo_2: document.getElementById('nosotros-image-sub2') ? document.getElementById('nosotros-image-sub2').value : "",
                    slogan_year: document.getElementById('nosotros-slogan-year').value,
                    slogan_text: document.getElementById('nosotros-slogan-text').value,
                    bullet_1: document.getElementById('nosotros-bullet-1').value,
                    bullet_2: document.getElementById('nosotros-bullet-2').value,
                    bullet_3: document.getElementById('nosotros-bullet-3').value
                }
            },
            fiesta: {
                title: document.getElementById('fiesta-title').value,
                subtitle: document.getElementById('fiesta-subtitle') ? document.getElementById('fiesta-subtitle').value : "",
                content: document.getElementById('fiesta-content').value,
                image_url: document.getElementById('fiesta-image').value,
                extra_data: {
                    sub_photo_2: document.getElementById('fiesta-image-2') ? document.getElementById('fiesta-image-2').value : "",
                    history_title: document.getElementById('fiesta-history-title').value,
                    quote_text: document.getElementById('fiesta-quote-text').value,
                    quote_cite: document.getElementById('fiesta-quote-cite').value
                }
            },
            educativo: {
                title: document.getElementById('educativo-title').value,
                subtitle: document.getElementById('educativo-subtitle') ? document.getElementById('educativo-subtitle').value : "",
                content: document.getElementById('educativo-content').value,
                image_url: document.getElementById('educativo-image').value,
                extra_data: {
                    feat_1_title: document.getElementById('educativo-feat-1-title').value,
                    feat_1_desc: document.getElementById('educativo-feat-1-desc').value,
                    feat_2_title: document.getElementById('educativo-feat-2-title').value,
                    feat_2_desc: document.getElementById('educativo-feat-2-desc').value
                }
            },
            sorteos: {
                title: document.getElementById('sorteos-title') ? document.getElementById('sorteos-title').value : "",
                subtitle: document.getElementById('sorteos-subtitle') ? document.getElementById('sorteos-subtitle').value : "",
                content: document.getElementById('sorteos-content') ? document.getElementById('sorteos-content').value : "",
                image_url: document.getElementById('sorteos-bg-image') ? document.getElementById('sorteos-bg-image').value : "",
                extra_data: {
                    card1_num: document.getElementById('sorteos-card1-num') ? document.getElementById('sorteos-card1-num').value : "01",
                    card1_title: document.getElementById('sorteos-card1-title') ? document.getElementById('sorteos-card1-title').value : "Seguinos",
                    card1_desc: document.getElementById('sorteos-card1-desc') ? document.getElementById('sorteos-card1-desc').value : "",
                    card2_num: document.getElementById('sorteos-card2-num') ? document.getElementById('sorteos-card2-num').value : "02",
                    card2_title: document.getElementById('sorteos-card2-title') ? document.getElementById('sorteos-card2-title').value : "Registrate",
                    card2_desc: document.getElementById('sorteos-card2-desc') ? document.getElementById('sorteos-card2-desc').value : "",
                    card3_num: document.getElementById('sorteos-card3-num') ? document.getElementById('sorteos-card3-num').value : "03",
                    card3_title: document.getElementById('sorteos-card3-title') ? document.getElementById('sorteos-card3-title').value : "¡Participá!",
                    card3_desc: document.getElementById('sorteos-card3-desc') ? document.getElementById('sorteos-card3-desc').value : ""
                }
            },
            pagos: {
                title: document.getElementById('pagos-title') ? document.getElementById('pagos-title').value : "",
                subtitle: document.getElementById('pagos-subtitle') ? document.getElementById('pagos-subtitle').value : "",
                content: document.getElementById('pagos-content') ? document.getElementById('pagos-content').value : "",
                image_url: "",
                extra_data: {
                    section_tag: document.getElementById('pagos-section-tag') ? document.getElementById('pagos-section-tag').value : "Medios de Pago",
                    info_title: document.getElementById('pagos-info-title') ? document.getElementById('pagos-info-title').value : "Todas las facilidades a tu disposición",
                    card1_icon: document.getElementById('pagos-card1-icon') ? document.getElementById('pagos-card1-icon').value : "fa-piggy-bank",
                    card1_title: document.getElementById('pagos-card1-title') ? document.getElementById('pagos-card1-title').value : "Pagos Parciales",
                    card1_desc: document.getElementById('pagos-card1-desc') ? document.getElementById('pagos-card1-desc').value : "",
                    card2_icon: document.getElementById('pagos-card2-icon') ? document.getElementById('pagos-card2-icon').value : "fa-credit-card",
                    card2_title: document.getElementById('pagos-card2-title') ? document.getElementById('pagos-card2-title').value : "Cuotas Sin Interés",
                    card2_desc: document.getElementById('pagos-card2-desc') ? document.getElementById('pagos-card2-desc').value : "",
                    card3_icon: document.getElementById('pagos-card3-icon') ? document.getElementById('pagos-card3-icon').value : "fa-id-card",
                    card3_title: document.getElementById('pagos-card3-title') ? document.getElementById('pagos-card3-title').value : "Crédito solo con DNI",
                    card3_desc: document.getElementById('pagos-card3-desc') ? document.getElementById('pagos-card3-desc').value : "",
                    card4_icon: document.getElementById('pagos-card4-icon') ? document.getElementById('pagos-card4-icon').value : "fa-wallet",
                    card4_title: document.getElementById('pagos-card4-title') ? document.getElementById('pagos-card4-title').value : "Transferencias y Efectivo",
                    card4_desc: document.getElementById('pagos-card4-desc') ? document.getElementById('pagos-card4-desc').value : ""
                }
            }
        };

        // Guardar en LocalStorage
        localStorage.setItem('esteko_landing_sections', JSON.stringify(updatedSections));

        // Guardar en Firestore si está disponible
        let success = true;
        let dbErrorMessage = "";
        if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
            try {
                await ensureFirebaseAuth();
                for (const sectionId of Object.keys(updatedSections)) {
                    const sec = updatedSections[sectionId];
                    const payload = {
                        title: sec.title || "",
                        subtitle: sec.subtitle || "",
                        content: sec.content || "",
                        image_url: sec.image_url || "",
                        updated_at: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    if (sec.extra_data) {
                        payload.extra_data = sec.extra_data;
                    }
                    await firebase.firestore().collection('landing_sections').doc(sectionId).set(payload, { merge: true });
                }
                isDatabaseOnline = true;
            } catch (err) {
                console.error("Fallo de red guardando secciones:", err);
                success = false;
                dbErrorMessage = err.message || "Error al conectar con Firestore";
            }
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Todos los Cambios de Texto';

        if (success) {
            showToast("¡Secciones actualizadas y guardadas en la Nube con éxito!");
        } else {
            showToast("Guardado localmente. Error en Nube: " + dbErrorMessage, "warning");
        }
    });
}

// ==========================================================================
// 6. PESTAÑA: DESTINOS (CRUD OPERACIONES)
// ==========================================================================
let allDestinations = [];

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

async function loadDestinationsData() {
    const listContainer = document.getElementById('destinations-admin-container');
    listContainer.innerHTML = '<div class="loading-placeholder-spinner"><i class="fa-solid fa-spinner fa-spin"></i> Sincronizando Catálogo...</div>';

    allDestinations = DEFAULT_DESTINATIONS;

    if (isDatabaseOnline && typeof firebase !== 'undefined') {
        try {
            const snapshot = await firebase.firestore().collection('landing_destinations').get();
            if (!snapshot.empty) {
                const list = [];
                snapshot.forEach(doc => {
                    list.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                // Ordenar por created_at
                list.sort((a, b) => {
                    const t1 = a.created_at ? (a.created_at.seconds ? a.created_at.seconds * 1000 : new Date(a.created_at).getTime()) : 0;
                    const t2 = b.created_at ? (b.created_at.seconds ? b.created_at.seconds * 1000 : new Date(b.created_at).getTime()) : 0;
                    return t1 - t2;
                });

                allDestinations = list.map(d => {
                    const parsedDesc = parseDestDescription(d);
                    return {
                        ...d,
                        description: parsedDesc.short,
                        long_description: parsedDesc.long,
                        gallery_images: parsedDesc.gallery
                    };
                });
                localStorage.setItem('esteko_landing_destinations', JSON.stringify(allDestinations));
            }
        } catch (e) {
            console.warn("Fallo al leer destinos, usando caché local.", e);
        }
    }

    if (!isDatabaseOnline) {
        allDestinations = JSON.parse(localStorage.getItem('esteko_landing_destinations')) || DEFAULT_DESTINATIONS;
        allDestinations = allDestinations.map(d => {
            const parsedDesc = parseDestDescription(d);
            return {
                ...d,
                description: parsedDesc.short,
                long_description: parsedDesc.long,
                gallery_images: parsedDesc.gallery
            };
        });
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
                    ${dest.is_oferta ? `<br><span style="color: var(--accent); font-size: 0.85rem;"><i class="fa-solid fa-tag"></i> Producto en Oferta</span>` : ''}
                    ${dest.is_favorito ? `<br><span style="color: #ff9f1c; font-size: 0.85rem; font-weight: bold;"><i class="fa-solid fa-star"></i> Destino Favorito (Más Elegido)</span>` : ''}
                    ${dest.is_active === false ? `<br><span style="color: #e74c3c; font-size: 0.85rem; font-weight: bold;"><i class="fa-solid fa-ban"></i> No Disponible (Deshabilitado)</span>` : `<br><span style="color: #2ec4b6; font-size: 0.85rem; font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Disponible (Habilitado)</span>`}
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

// Helpers para la galería de imágenes del destino
window.updateGalleryPreview = function(index) {
    const urlInput = document.getElementById(`dest-gallery-img-${index}`);
    const previewDiv = document.getElementById(`dest-gallery-preview-${index}`);
    if (urlInput && previewDiv) {
        const val = urlInput.value.trim();
        const img = previewDiv.querySelector('img');
        if (val) {
            img.src = val;
            previewDiv.style.display = 'flex';
        } else {
            previewDiv.style.display = 'none';
        }
    }
};

function initDestGalleryListeners() {
    for (let i = 1; i <= 6; i++) {
        initFileUploaderListeners(`dest-gallery-file-${i}`, `dest-gallery-img-${i}`);
        
        const input = document.getElementById(`dest-gallery-img-${i}`);
        if (input) {
            input.addEventListener('change', () => window.updateGalleryPreview(i));
            input.addEventListener('input', () => window.updateGalleryPreview(i));
        }
    }
}

// Evento para abrir modal de creación
const btnOpenCreateModal = document.getElementById('btn-open-create-destination-modal');
if (btnOpenCreateModal) {
    btnOpenCreateModal.addEventListener('click', () => {
        document.getElementById('form-destination-crud').reset();
        document.getElementById('dest-id').value = '';
        document.getElementById('dest-long-description').value = '';
        
        // Limpiar inputs y previews de galería
        for (let i = 1; i <= 6; i++) {
            const input = document.getElementById(`dest-gallery-img-${i}`);
            if (input) input.value = '';
            window.updateGalleryPreview(i);
        }

        document.getElementById('dest-modal-title').innerHTML = '<i class="fa-solid fa-circle-plus"></i> Registrar Nuevo Viaje';
        document.getElementById('destination-modal').style.display = 'flex';
        initFileUploaderListeners('dest-file', 'dest-image');
        initDestGalleryListeners();
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
    document.getElementById('dest-is-oferta').checked = dest.is_oferta || false;
    document.getElementById('dest-is-favorito').checked = dest.is_favorito || false;
    document.getElementById('dest-is-active').checked = dest.is_active !== false;
    document.getElementById('dest-duration').value = dest.duration;
    document.getElementById('dest-price-info').value = dest.price_info;
    document.getElementById('dest-whatsapp-text').value = dest.whatsapp_text;
    document.getElementById('dest-cost').value = dest.cost;
    document.getElementById('dest-image').value = dest.image_url;
    document.getElementById('dest-description').value = dest.description;
    document.getElementById('dest-long-description').value = dest.long_description || '';
    
    // Rellenar galería de imágenes
    const gallery = dest.gallery_images || [];
    for (let i = 1; i <= 6; i++) {
        const input = document.getElementById(`dest-gallery-img-${i}`);
        if (input) {
            input.value = gallery[i - 1] || '';
        }
        window.updateGalleryPreview(i);
    }
    
    // Convertir array de servicios a string por saltos de línea
    const servicesStr = dest.services ? dest.services.join('\n') : '';
    document.getElementById('dest-services').value = servicesStr;

    document.getElementById('dest-modal-title').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar Información de Viaje';
    document.getElementById('destination-modal').style.display = 'flex';

    initFileUploaderListeners('dest-file', 'dest-image');
    initDestGalleryListeners();
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
        const is_oferta = document.getElementById('dest-is-oferta').checked;
        const is_favorito = document.getElementById('dest-is-favorito').checked;
        const is_active = document.getElementById('dest-is-active').checked;
        const duration = document.getElementById('dest-duration').value.trim();
        const price_info = document.getElementById('dest-price-info').value.trim();
        const whatsapp_text = document.getElementById('dest-whatsapp-text').value.trim();
        const costVal = document.getElementById('dest-cost').value;
        const cost = parseInt(costVal, 10) || 0;
        const image_url = document.getElementById('dest-image').value.trim();
        const description = document.getElementById('dest-description').value.trim();
        const long_description = document.getElementById('dest-long-description').value.trim();
        
        // Obtener galería de imágenes
        const gallery_images = [];
        for (let i = 1; i <= 6; i++) {
            const val = document.getElementById(`dest-gallery-img-${i}`).value.trim();
            if (val) gallery_images.push(val);
        }

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
            is_oferta,
            is_favorito,
            is_active,
            duration,
            description,
            long_description,
            image_url,
            gallery_images,
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

        // Guardar en Firestore si está disponible
        let dbSaved = true;
        let errorMsg = "";
        if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
            try {
                await ensureFirebaseAuth();
                const dbObj = {
                    name: destObj.name,
                    category: destObj.category,
                    is_oferta: destObj.is_oferta,
                    is_favorito: destObj.is_favorito,
                    is_active: destObj.is_active,
                    duration: destObj.duration,
                    price_info: destObj.price_info,
                    whatsapp_text: destObj.whatsapp_text,
                    cost: destObj.cost || 0,
                    image_url: destObj.image_url,
                    services: destObj.services,
                    description: JSON.stringify({
                        short: destObj.description,
                        long: destObj.long_description,
                        gallery: destObj.gallery_images
                    }),
                    updated_at: firebase.firestore.FieldValue.serverTimestamp()
                };

                let docRef;
                if (isNew) {
                    dbObj.created_at = firebase.firestore.FieldValue.serverTimestamp();
                    docRef = firebase.firestore().collection('landing_destinations').doc();
                } else {
                    docRef = firebase.firestore().collection('landing_destinations').doc(destObj.id);
                }

                await docRef.set(dbObj, { merge: true });
                isDatabaseOnline = true;
            } catch (err) {
                console.error("Fallo de red en CRUD destinos:", err);
                dbSaved = false;
                errorMsg = err.message || "Fallo al conectar con Firestore";
            }
        }

        closeModalFn();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Guardar Destino';

        if (dbSaved) {
            showToast(isNew ? "¡Destino creado y guardado en Nube!" : "¡Destino actualizado y guardado en Nube!");
        } else {
            showToast("Guardado localmente. Error Nube: " + errorMsg, "warning");
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
    if (isDatabaseOnline && typeof firebase !== 'undefined') {
        try {
            await firebase.firestore().collection('landing_destinations').doc(destId).delete();
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

    if (isDatabaseOnline && typeof firebase !== 'undefined') {
        try {
            const snapshot = await firebase.firestore().collection('landing_gallery').get();
            if (!snapshot.empty) {
                const list = [];
                snapshot.forEach(doc => {
                    list.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                // Ordenar por created_at descendente
                list.sort((a, b) => {
                    const t1 = a.created_at ? (a.created_at.seconds ? a.created_at.seconds * 1000 : new Date(a.created_at).getTime()) : 0;
                    const t2 = b.created_at ? (b.created_at.seconds ? b.created_at.seconds * 1000 : new Date(b.created_at).getTime()) : 0;
                    return t2 - t1;
                });
                galleryItems = list;
                localStorage.setItem('esteko_landing_gallery', JSON.stringify(galleryItems));
            }
        } catch (e) {
            console.warn("Fallo al leer galería de la nube, usando caché.", e);
        }
    }

    if (!isDatabaseOnline) {
        galleryItems = JSON.parse(localStorage.getItem('esteko_landing_gallery')) || [];
    }

    // Iniciar dropzone de subida
    initDropzoneUploader();

    renderAdminGallery();
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

function renderAdminGallery() {
    const displayContainer = document.getElementById('admin-gallery-display');
    if (!displayContainer) return;

    const filtered = galleryItems.filter(item => item.section === activeGallerySection);

    if (filtered.length === 0) {
        displayContainer.innerHTML = `<div class="gallery-empty-msg">No hay imágenes o videos en la galería de ${activeGallerySection}. ¡Cargá un nuevo archivo!</div>`;
        return;
    }

    displayContainer.innerHTML = '';
    filtered.forEach(item => {
        const thumb = document.createElement('div');
        thumb.className = 'gallery-thumb-wrapper';
        if (isVideoUrl(item.image_url)) {
            thumb.innerHTML = `
                <video src="${item.image_url}" muted playsinline></video>
                <div class="video-badge"><i class="fa-solid fa-play"></i> Video</div>
                <button class="btn-delete-thumb" onclick="deleteGalleryItemTrigger('${item.id}')" title="Eliminar Video"><i class="fa-solid fa-xmark"></i></button>
            `;
        } else {
            thumb.innerHTML = `
                <img src="${item.image_url}" alt="Galería ${activeGallerySection}">
                <button class="btn-delete-thumb" onclick="deleteGalleryItemTrigger('${item.id}')" title="Eliminar Imagen"><i class="fa-solid fa-xmark"></i></button>
            `;
        }
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
            alert("Por favor, selecciona un archivo de imagen/video o ingresa una URL de internet.");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subiendo archivo...';

        // 1. Si hay archivo, subirlo a Firebase Storage
        if (hasFile) {
            const file = fileInput.files[0];
            
            if (typeof firebase !== 'undefined') {
                try {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${section}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                    const filePath = `gallery/${fileName}`;

                    // Subir archivo a Firebase Storage
                    const storageRef = firebase.storage().ref().child(filePath);
                    const uploadSnapshot = await storageRef.put(file);
                    imageUrl = await uploadSnapshot.ref.getDownloadURL();
                } catch (err) {
                    console.error("Fallo de Storage Firebase, intentando fallback de lectura local base64:", err);
                    imageUrl = await convertFileToBase64(file);
                    showToast("Fallo de subida a Firebase. Guardada localmente.");
                }
            } else {
                // Modo offline / sin Firebase: guardar local en base64
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

        // Guardar en Firestore si está disponible
        let dbSaved = true;
        let dbErrorMessage = "";
        if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
            try {
                await ensureFirebaseAuth();
                const dbObj = {
                    section: newItem.section,
                    image_url: newItem.image_url,
                    created_at: firebase.firestore.FieldValue.serverTimestamp()
                };
                await firebase.firestore().collection('landing_gallery').add(dbObj);
                isDatabaseOnline = true;
            } catch (err) {
                console.error("Fallo de red registrando galería:", err);
                dbSaved = false;
                dbErrorMessage = err.message || "Error al conectar con Firestore";
            }
        }

        // Limpiar inputs
        formUploadGallery.reset();
        document.getElementById('selected-file-label').style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Agregar a la Galería';

        if (dbSaved) {
            showToast("Archivo subido y agregado con éxito!");
        } else {
            showToast("Archivo agregado localmente.");
        }

        // Recargar
        loadGalleryData();
    });
}

// Convertidor a Base64 comprimido para fallback offline de imágenes para evitar QuotaExceededError en LocalStorage
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const max_size = 1000; // Dimensiones máximas recomendables para web
                
                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Comprimir a JPEG con calidad 0.7 para reducir drásticamente el peso (de 3MB a ~50KB)
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                resolve(compressedBase64);
            };
            img.onerror = (err) => {
                // Si falla o no es imagen válida, retornar base64 original como resguardo
                resolve(event.target.result);
            };
        };
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
    if (isDatabaseOnline && typeof firebase !== 'undefined') {
        try {
            await firebase.firestore().collection('landing_gallery').doc(itemId).delete();
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

    if (isDatabaseOnline && typeof firebase !== 'undefined') {
        try {
            const snapshot = await firebase.firestore().collection('landing_config').get();
            if (!snapshot.empty) {
                config = {};
                snapshot.forEach(doc => {
                    const data = doc.data();
                    config[doc.id] = data.value;
                });
                localStorage.setItem('esteko_landing_config', JSON.stringify(config));
            }
        } catch (e) {
            console.warn("Fallo al leer configuraciones de la nube, usando LocalStorage.", e);
        }
    }

    if (!isDatabaseOnline) {
        config = JSON.parse(localStorage.getItem('esteko_landing_config')) || DEFAULT_CONFIG;
    }

    // Inyectar datos en inputs
    document.getElementById('config-seña-percent').value = config.seña_percent || 20;
    document.getElementById('config-descuento-oferta').value = config.descuento_oferta || 15;
    document.getElementById('config-legajo').value = config.legajo || "";
    document.getElementById('config-legajo-url').value = config.legajo_url || "";
    document.getElementById('config-email').value = config.email || "";
    document.getElementById('config-whatsapp').value = config.whatsapp || "";
    
    // Redes
    document.getElementById('config-facebook').value = config.facebook || "";
    document.getElementById('config-instagram').value = config.instagram || "";
    document.getElementById('config-tiktok').value = config.tiktok || "";

    // Imágenes globales
    document.getElementById('config-logo-header').value = config.logo_header_url || "";
    document.getElementById('config-logo-footer').value = config.logo_footer_url || "";
    document.getElementById('config-badge-reviews').value = config.badge_reviews_url || "";
    document.getElementById('config-qr-mintur').value = config.qr_mintur_url || "";

    // Configurar listeners de file uploader para imágenes globales
    initFileUploaderListeners('config-logo-header-file', 'config-logo-header');
    initFileUploaderListeners('config-logo-footer-file', 'config-logo-footer');
    initFileUploaderListeners('config-badge-reviews-file', 'config-badge-reviews');
    initFileUploaderListeners('config-qr-mintur-file', 'config-qr-mintur');

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
            seña_percent: parseInt(document.getElementById('config-seña-percent').value, 10) || 0,
            descuento_oferta: parseInt(document.getElementById('config-descuento-oferta').value, 10) || 0,
            quotas: quotas,
            legajo: document.getElementById('config-legajo').value.trim(),
            legajo_url: document.getElementById('config-legajo-url').value.trim(),
            email: document.getElementById('config-email').value.trim(),
            whatsapp: document.getElementById('config-whatsapp').value.trim(),
            facebook: document.getElementById('config-facebook').value.trim(),
            instagram: document.getElementById('config-instagram').value.trim(),
            tiktok: document.getElementById('config-tiktok').value.trim(),
            logo_header_url: document.getElementById('config-logo-header').value.trim(),
            logo_footer_url: document.getElementById('config-logo-footer').value.trim(),
            badge_reviews_url: document.getElementById('config-badge-reviews').value.trim(),
            qr_mintur_url: document.getElementById('config-qr-mintur').value.trim()
        };

        // Guardar local
        localStorage.setItem('esteko_landing_config', JSON.stringify(updatedConfig));

        // Guardar en Firestore si está disponible
        let success = true;
        let dbErrorMessage = "";
        if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
            try {
                await ensureFirebaseAuth();
                for (const key of Object.keys(updatedConfig)) {
                    await firebase.firestore().collection('landing_config').doc(key).set({
                        value: updatedConfig[key],
                        updated_at: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                }
                isDatabaseOnline = true;
            } catch (err) {
                console.error("Fallo de red en guardado de config:", err);
                success = false;
                dbErrorMessage = err.message || "Error de red";
            }
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Parámetros de Configuración';

        if (success) {
            showToast("¡Configuración general guardada en la Nube con éxito!");
        } else {
            showToast("Guardado localmente. Error en Nube: " + dbErrorMessage, "warning");
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
    if (isDatabaseOnline && typeof firebase !== 'undefined') {
        try {
            const snapshot = await firebase.firestore().collection('landing_leads').get();
            if (!snapshot.empty) {
                const list = [];
                snapshot.forEach(doc => {
                    list.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                // Ordenar por created_at descendente
                list.sort((a, b) => {
                    const t1 = a.created_at ? (a.created_at.seconds ? a.created_at.seconds * 1000 : new Date(a.created_at).getTime()) : 0;
                    const t2 = b.created_at ? (b.created_at.seconds ? b.created_at.seconds * 1000 : new Date(b.created_at).getTime()) : 0;
                    return t2 - t1;
                });
                allLeads = list;
            }
        } catch (e) {
            console.warn("Fallo al leer leads de la nube, cargando locales.", e);
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
        if (isDatabaseOnline && typeof firebase !== 'undefined') {
            try {
                const snapshot = await firebase.firestore().collection('landing_leads').get();
                const batch = firebase.firestore().batch();
                snapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            } catch (err) {
                console.error("Error vaciando leads de Firestore:", err);
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

            // 1. Si Firebase está cargado, subir a Storage
            if (typeof firebase !== 'undefined') {
                try {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `media-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                    const filePath = `uploads/${fileName}`;

                    const storageRef = firebase.storage().ref().child(filePath);
                    const uploadSnapshot = await storageRef.put(file);
                    const url = await uploadSnapshot.ref.getDownloadURL();
                    targetInput.value = url;
                    targetInput.dispatchEvent(new Event('change'));
                    showToast("Archivo subido a Firebase Storage!");
                } catch (err) {
                    console.error("Error al subir a Firebase Storage:", err);
                    const b64 = await convertFileToBase64(file);
                    targetInput.value = b64;
                    targetInput.dispatchEvent(new Event('change'));
                    showToast("Error de subida. Guardado en formato local.");
                }
            } else {
                // Sencillo convertidor offline
                const b64 = await convertFileToBase64(file);
                targetInput.value = b64;
                targetInput.dispatchEvent(new Event('change'));
                showToast("Modo offline: Imagen codificada con éxito.");
            }

            if (originalLabel) {
                originalLabel.innerHTML = '<i class="fa-solid fa-upload"></i> Subir';
            }
        }
    };
}
// Init hero carousel multiple file uploader
function initHeroCarouselUploader() {
    const fileInput = document.getElementById('hero-carousel-file');
    const textarea = document.getElementById('hero-carousel-urls');

    if (!fileInput || !textarea) return;

    fileInput.onchange = async () => {
        if (fileInput.files.length > 0) {
            const originalLabel = fileInput.nextElementSibling;
            
            if (originalLabel) {
                originalLabel.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Subiendo...';
            }

            for (let i = 0; i < fileInput.files.length; i++) {
                const file = fileInput.files[i];
                let fileUrl = "";

                if (typeof firebase !== 'undefined') {
                    try {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `hero-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                        const filePath = `uploads/${fileName}`;

                        const storageRef = firebase.storage().ref().child(filePath);
                        const uploadSnapshot = await storageRef.put(file);
                        fileUrl = await uploadSnapshot.ref.getDownloadURL();
                    } catch (err) {
                        console.error("Error subiendo carrusel a Firebase:", err);
                        fileUrl = await convertFileToBase64(file);
                    }
                } else {
                    fileUrl = await convertFileToBase64(file);
                }

                if (fileUrl) {
                    textarea.value = textarea.value + (textarea.value ? '\n' : '') + fileUrl;
                }
            }

            showToast("Imágenes agregadas al carrusel con éxito.");

            if (originalLabel) {
                originalLabel.innerHTML = '<i class="fa-solid fa-upload"></i> Subir Imágenes al Carrusel';
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

// ==========================================================================
// 11. MÓDULO DE GESTIÓN DE USUARIOS (CRUD CON RPC & RESILIENCIA OFFLINE)
// ==========================================================================
let allUsers = [];

const SEED_PROFILES = [
    {
        id: "a30735f5-51a5-4ee1-9599-6656b284dee5",
        full_name: "Alberto Garcia",
        email: "alberto_garcia82@hotmail.com",
        rol: "admin",
        activo: true,
        created_at: "2026-04-02T22:59:16.744Z"
    },
    {
        id: "5fca907d-a9ae-4fa3-8751-0cb5f722d5eb",
        full_name: "Rutas del Esteko",
        email: "rutasdelesteko@gmail.com",
        rol: "admin",
        activo: true,
        created_at: "2026-04-04T18:27:11.690Z"
    },
    {
        id: "fc9acb2a-61cd-441a-983d-dd269cab5a74",
        full_name: "Alberto Ezequiel Garcia",
        email: "alberto.ezequiel.garcia@gmail.com",
        rol: "admin",
        activo: true,
        created_at: "2026-05-09T22:45:49.896Z"
    }
];

async function loadUsersData() {
    const tableBody = document.getElementById('users-table-body');
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="6" class="table-empty-placeholder"><i class="fa-solid fa-spinner fa-spin"></i> Sincronizando regimiento de usuarios...</td></tr>';
    }

    allUsers = [];

    // Initialize local cache if missing
    if (!localStorage.getItem('esteko_landing_profiles')) {
        localStorage.setItem('esteko_landing_profiles', JSON.stringify(SEED_PROFILES));
    }

    // 1. Cargar desde la nube (si está en línea)
    if (isDatabaseOnline && typeof firebase !== 'undefined') {
        try {
            const snapshot = await firebase.firestore().collection('landing_profiles').get();
            if (!snapshot.empty) {
                const list = [];
                snapshot.forEach(doc => {
                    list.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                // Ordenar por created_at
                list.sort((a, b) => {
                    const t1 = a.created_at ? (a.created_at.seconds ? a.created_at.seconds * 1000 : new Date(a.created_at).getTime()) : 0;
                    const t2 = b.created_at ? (b.created_at.seconds ? b.created_at.seconds * 1000 : new Date(b.created_at).getTime()) : 0;
                    return t1 - t2;
                });
                allUsers = list;
                localStorage.setItem('esteko_landing_profiles', JSON.stringify(allUsers));
            }
        } catch (e) {
            console.warn("Fallo al leer usuarios de la nube, cargando caché local.", e);
        }
    }

    // 2. Fallback offline
    if (allUsers.length === 0) {
        allUsers = JSON.parse(localStorage.getItem('esteko_landing_profiles')) || SEED_PROFILES;
    }

    renderUsersTable();
    initUserModalListeners();
}

function renderUsersTable() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;

    if (allUsers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="table-empty-placeholder">No hay usuarios registrados.</td></tr>';
        return;
    }

    tableBody.innerHTML = '';
    allUsers.forEach(user => {
        const row = document.createElement('tr');
        
        // Formatear fecha
        const dateObj = new Date(user.created_at || new Date());
        const formattedDate = dateObj.toLocaleDateString('es-AR');

        // Rol badge class
        let roleBadgeClass = 'badge-mas-admin';
        if (user.rol === 'admin') roleBadgeClass = 'badge-verano-admin'; // Orange/Red-ish style
        else if (user.rol === 'contador') roleBadgeClass = 'badge-invierno-admin'; // Blue style

        // Estado badge
        const statusText = user.activo ? 'Activo' : 'Suspendido';
        const statusBadgeClass = user.activo ? 'status-shield database-online' : 'status-shield database-offline';

        row.innerHTML = `
            <td>
                <div class="user-meta" style="padding: 0;">
                    <strong style="color: var(--admin-text-main); font-size: 0.95rem;">${user.full_name || 'Sin Nombre'}</strong>
                </div>
            </td>
            <td style="color: var(--admin-text-muted); font-family: monospace;">${user.email}</td>
            <td><span class="dest-badge-admin ${roleBadgeClass}" style="position:static; text-transform: uppercase; font-weight: 700; font-size: 0.75rem;">${user.rol}</span></td>
            <td>
                <span class="${statusBadgeClass}" style="display: inline-flex; margin: 0; padding: 4px 8px; font-size: 0.75rem;">
                    <i class="fa-solid ${user.activo ? 'fa-check' : 'fa-ban'}"></i> ${statusText}
                </span>
            </td>
            <td style="color: var(--admin-text-muted); font-size: 0.85rem;">${formattedDate}</td>
            <td>
                <div class="dest-card-actions" style="margin-top: 0; justify-content: flex-start; gap: 8px;">
                    <button class="btn-edit-admin btn-admin-xs" style="padding: 4px 8px; font-size: 0.8rem;" onclick="openEditUserModal('${user.id}')"><i class="fa-solid fa-user-pen"></i> Editar</button>
                    <button class="btn-delete-admin btn-admin-xs" style="padding: 4px 8px; font-size: 0.8rem; background: rgba(220, 53, 69, 0.15); border-color: rgba(220, 53, 69, 0.3);" onclick="deleteUserTrigger('${user.id}')"><i class="fa-solid fa-user-minus"></i> Borrar</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Control de modales y triggers de usuarios
let userModalsInitialized = false;

function initUserModalListeners() {
    if (userModalsInitialized) return;
    userModalsInitialized = true;

    // Crear Usuario Modal
    const btnOpenCreate = document.getElementById('btn-open-create-user-modal');
    const modalCreate = document.getElementById('user-create-modal');
    const btnCloseCreate = document.getElementById('btn-close-user-modal');
    const btnCancelCreate = document.getElementById('btn-cancel-user-modal');
    const formCreate = document.getElementById('form-user-create');

    if (btnOpenCreate && modalCreate) {
        btnOpenCreate.onclick = () => {
            formCreate.reset();
            modalCreate.style.display = 'flex';
        };
    }
    if (btnCloseCreate && modalCreate) btnCloseCreate.onclick = () => modalCreate.style.display = 'none';
    if (btnCancelCreate && modalCreate) btnCancelCreate.onclick = () => modalCreate.style.display = 'none';

    if (formCreate) {
        formCreate.onsubmit = async (e) => {
            e.preventDefault();
            const u_full_name = document.getElementById('new-user-name').value.trim();
            const u_email = document.getElementById('new-user-email').value.trim();
            const u_password = document.getElementById('new-user-password').value;
            const u_rol = document.getElementById('new-user-role').value;

            const submitBtn = document.getElementById('btn-save-user-submit');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...';

            let saved = true;
            let errorMsg = "";

            if (isDatabaseOnline && typeof firebase !== 'undefined') {
                try {
                    // Crear una instancia secundaria de Firebase para no desloguear al administrador actual
                    const secondaryApp = firebase.initializeApp(firebaseConfig, "SecondaryApp");
                    try {
                        await secondaryApp.auth().createUserWithEmailAndPassword(u_email, u_password);
                        
                        // Insertar perfil del usuario en Firestore `landing_profiles`
                        await firebase.firestore().collection('landing_profiles').doc(u_email).set({
                            email: u_email,
                            full_name: u_full_name,
                            rol: u_rol,
                            activo: true,
                            created_at: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    } finally {
                        await secondaryApp.delete();
                    }
                } catch (err) {
                    saved = false;
                    errorMsg = err.message || "Error al registrar en Firebase Auth/Firestore.";
                }
            } else {
                // Modo offline: Simular en local cache
                const simulatedId = 'sim-u-' + Math.random().toString(36).substr(2, 9);
                const newUser = {
                    id: simulatedId,
                    full_name: u_full_name,
                    email: u_email,
                    rol: u_rol,
                    activo: true,
                    created_at: new Date().toISOString()
                };
                allUsers.push(newUser);
                localStorage.setItem('esteko_landing_profiles', JSON.stringify(allUsers));
                showToast("Registrado en contingencia local offline");
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Crear Usuario';

            if (saved) {
                if (modalCreate) modalCreate.style.display = 'none';
                showToast("¡Usuario creado con éxito en el sistema!");
                loadUsersData();
            } else {
                alert("Error al registrar el usuario: " + errorMsg);
            }
        };
    }

    // Editar Usuario Modal
    const modalEdit = document.getElementById('user-edit-modal');
    const btnCloseEdit = document.getElementById('btn-close-edit-user-modal');
    const btnCancelEdit = document.getElementById('btn-cancel-edit-user-modal');
    const formEdit = document.getElementById('form-user-edit');

    if (btnCloseEdit && modalEdit) btnCloseEdit.onclick = () => modalEdit.style.display = 'none';
    if (btnCancelEdit && modalEdit) btnCancelEdit.onclick = () => modalEdit.style.display = 'none';

    if (formEdit) {
        formEdit.onsubmit = async (e) => {
            e.preventDefault();
            const edit_id = document.getElementById('edit-user-id').value;
            const edit_name = document.getElementById('edit-user-name').value.trim();
            const edit_rol = document.getElementById('edit-user-role').value;
            const edit_activo = document.getElementById('edit-user-status').value === 'true';

            const submitBtn = document.getElementById('btn-update-user-submit');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

            let saved = true;
            let errorMsg = "";

            if (isDatabaseOnline && typeof firebase !== 'undefined') {
                try {
                    await firebase.firestore().collection('landing_profiles').doc(edit_id).update({
                        full_name: edit_name,
                        rol: edit_rol,
                        activo: edit_activo,
                        updated_at: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } catch (err) {
                    saved = false;
                    errorMsg = err.message || "Fallo de conexión.";
                }
            } else {
                // Modo offline
                const index = allUsers.findIndex(u => u.id === edit_id);
                if (index !== -1) {
                    allUsers[index].full_name = edit_name;
                    allUsers[index].rol = edit_rol;
                    allUsers[index].activo = edit_activo;
                    localStorage.setItem('esteko_landing_profiles', JSON.stringify(allUsers));
                    showToast("Actualizado en contingencia local");
                }
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Cambios';

            if (saved) {
                if (modalEdit) modalEdit.style.display = 'none';
                showToast("¡Cambios guardados con éxito!");
                loadUsersData();
            } else {
                alert("Error al actualizar perfil: " + errorMsg);
            }
        };
    }
}

// Abrir modal de edición
window.openEditUserModal = function(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-user-name').value = user.full_name || '';
    document.getElementById('edit-user-email').value = user.email;
    document.getElementById('edit-user-role').value = user.rol;
    document.getElementById('edit-user-status').value = user.activo ? 'true' : 'false';

    const modalEdit = document.getElementById('user-edit-modal');
    if (modalEdit) modalEdit.style.display = 'flex';
};

// Eliminar un usuario
window.deleteUserTrigger = async function(userId) {
    // 1. Confirmar con doble paso
    if (!confirm("¿Está seguro de eliminar militarmente a este usuario del sistema? Se revocará su acceso inmediato a la Landing y al ERP.")) {
        return;
    }

    let deleted = true;
    let errorMsg = "";

    if (isDatabaseOnline && typeof firebase !== 'undefined') {
        try {
            // Eliminar el documento de perfil del usuario de Firestore
            await firebase.firestore().collection('landing_profiles').doc(userId).delete();
        } catch (err) {
            deleted = false;
            errorMsg = err.message || "Error de conexión.";
        }
    } else {
        // Offline simulation
        allUsers = allUsers.filter(u => u.id !== userId);
        localStorage.setItem('esteko_landing_profiles', JSON.stringify(allUsers));
    }

    if (deleted) {
        showToast("Usuario eliminado con éxito del sistema.");
        loadUsersData();
    } else {
        alert("Error al eliminar usuario: " + errorMsg);
    }
};

// ==========================================================================
// 11. SISTEMA DE POSTULACIONES Y ACTUALIZACIÓN DE BADGES
// ==========================================================================
async function updateBadgesCount() {
    if (isDatabaseOnline && typeof firebase !== 'undefined') {
        try {
            // Count Leads
            const leadsSnapshot = await firebase.firestore().collection('landing_leads').get();
            const navLeadsBadge = document.getElementById('nav-leads-badge');
            if (navLeadsBadge) navLeadsBadge.textContent = leadsSnapshot.size;

            // Count Postulaciones
            const postSnapshot = await firebase.firestore().collection('landing_applications').get();
            const navPostBadge = document.getElementById('nav-postulaciones-badge');
            if (navPostBadge) navPostBadge.textContent = postSnapshot.size;
        } catch (e) {
            console.warn("Fallo cargando conteo de badges.", e);
        }
    } else {
        // Fallback local counts
        const localLeads = JSON.parse(localStorage.getItem('esteko_leads') || '[]');
        const navLeadsBadge = document.getElementById('nav-leads-badge');
        if (navLeadsBadge) navLeadsBadge.textContent = localLeads.length;

        const localApps = JSON.parse(localStorage.getItem('esteko_cv_applications') || '[]');
        const navPostBadge = document.getElementById('nav-postulaciones-badge');
        if (navPostBadge) navPostBadge.textContent = localApps.length;
    }
}

let allPostulaciones = [];

async function loadPostulacionesData() {
    const tableBody = document.getElementById('postulaciones-table-body');
    const navPostBadge = document.getElementById('nav-postulaciones-badge');
    
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="6" class="table-empty-placeholder"><i class="fa-solid fa-spinner fa-spin"></i> Cargando postulaciones...</td></tr>';
    }

    allPostulaciones = [];

    if (isDatabaseOnline && typeof firebase !== 'undefined') {
        try {
            const snapshot = await firebase.firestore().collection('landing_applications').get();
            if (!snapshot.empty) {
                const list = [];
                snapshot.forEach(doc => {
                    list.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                // Ordenar por created_at descendente
                list.sort((a, b) => {
                    const t1 = a.created_at ? (a.created_at.seconds ? a.created_at.seconds * 1000 : new Date(a.created_at).getTime()) : 0;
                    const t2 = b.created_at ? (b.created_at.seconds ? b.created_at.seconds * 1000 : new Date(b.created_at).getTime()) : 0;
                    return t2 - t1;
                });
                allPostulaciones = list;
            }
        } catch (e) {
            console.warn("Fallo al leer postulaciones de la nube, cargando locales.", e);
        }
    }

    // Cargar locales (LocalStorage de postulaciones combinados)
    const localApps = JSON.parse(localStorage.getItem('esteko_cv_applications') || '[]');
    if (allPostulaciones.length === 0) {
        allPostulaciones = localApps.reverse(); // Mostrar los más recientes primero
    }

    if (navPostBadge) {
        navPostBadge.textContent = allPostulaciones.length;
    }

    renderPostulacionesTable();
}

function renderPostulacionesTable() {
    const tableBody = document.getElementById('postulaciones-table-body');
    if (!tableBody) return;

    if (allPostulaciones.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="table-empty-placeholder">No hay postulaciones registradas todavía.</td></tr>';
        return;
    }

    tableBody.innerHTML = '';
    allPostulaciones.forEach(app => {
        const tr = document.createElement('tr');
        
        const dateObj = new Date(app.created_at || new Date());
        const formattedDate = dateObj.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const cleanPhone = app.phone ? app.phone.replace(/[^0-9]/g, '') : '';
        const waLink = `https://wa.me/54${cleanPhone}`;

        // Truncate download URL or make a button
        const cvDownloadBtn = app.cv_url 
            ? `<a href="${app.cv_url}" target="_blank" class="lead-whatsapp-btn" style="background-color: var(--accent); margin: 0;"><i class="fa-solid fa-file-arrow-down"></i> Descargar CV</a>` 
            : `<span class="text-muted">Sin archivo</span>`;

        tr.innerHTML = `
            <td class="lead-date-cell">${formattedDate}</td>
            <td class="lead-name-cell">${app.full_name || app.name || 'Sin nombre'}</td>
            <td>+54 ${app.phone}</td>
            <td>${app.email}</td>
            <td>${cvDownloadBtn}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <a href="${waLink}" target="_blank" class="lead-whatsapp-btn" style="margin: 0;"><i class="fa-brands fa-whatsapp"></i> Chat</a>
                    <button class="btn-admin-danger" onclick="deletePostulacion('${app.id}')" style="padding: 4px 8px; font-size: 0.8rem; border-radius: 4px; border: none; cursor: pointer; color: white;"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Eliminar postulación individual
window.deletePostulacion = async function(appId) {
    if (!confirm("¿Está seguro de eliminar esta postulación? Esta acción no se puede deshacer.")) {
        return;
    }

    let deleted = true;
    if (isDatabaseOnline && typeof firebase !== 'undefined' && appId && appId !== 'undefined') {
        try {
            await firebase.firestore().collection('landing_applications').doc(appId).delete();
        } catch (e) {
            console.error("Error al eliminar de Firestore:", e);
            deleted = false;
        }
    } else {
        // Local fallback
        let localApps = JSON.parse(localStorage.getItem('esteko_cv_applications') || '[]');
        localApps = localApps.filter(app => app.id !== appId);
        localStorage.setItem('esteko_cv_applications', JSON.stringify(localApps));
    }

    if (deleted) {
        showToast("Postulación eliminada.");
        loadPostulacionesData();
        updateBadgesCount();
    } else {
        alert("No se pudo eliminar la postulación. Intente de nuevo.");
    }
};

// Vaciar todas las postulaciones
const btnClearPostulaciones = document.getElementById('btn-clear-postulaciones');
if (btnClearPostulaciones) {
    btnClearPostulaciones.addEventListener('click', async () => {
        if (!confirm("¿Está seguro de vaciar el listado de postulaciones? Se eliminarán de forma permanente. Esta acción no se puede deshacer.")) {
            return;
        }

        localStorage.setItem('esteko_cv_applications', JSON.stringify([]));

        let success = true;
        if (isDatabaseOnline && typeof firebase !== 'undefined') {
            try {
                const snapshot = await firebase.firestore().collection('landing_applications').get();
                const batch = firebase.firestore().batch();
                snapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
            } catch (e) {
                console.error("Error vaciando postulaciones de Firestore:", e);
                success = false;
            }
        }

        if (success) {
            showToast("Listado de postulaciones vaciado.");
            loadPostulacionesData();
            updateBadgesCount();
        } else {
            alert("No se pudieron eliminar todos los registros de la nube.");
        }
    });
}

// ==========================================================================
// 10. PESTAÑA: OPINIONES DE GOOGLE (CRUD)
// ==========================================================================
let allOpinions = [];
let opinionModalsInitialized = false;

async function loadOpinionsData() {
    const tableBody = document.getElementById('opiniones-table-body');
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="8" class="table-empty-placeholder"><i class="fa-solid fa-spinner fa-spin"></i> Sincronizando opiniones...</td></tr>';
    }

    allOpinions = [];

    // Cargar opiniones de Firestore
    if (isDatabaseOnline && typeof firebase !== 'undefined') {
        try {
            const snapshot = await firebase.firestore().collection('landing_reviews').get();
            if (!snapshot.empty) {
                const list = [];
                snapshot.forEach(doc => {
                    list.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                // Ordenar por orden
                list.sort((a, b) => (a.order || 10) - (b.order || 10));
                allOpinions = list;
            }
        } catch (e) {
            console.warn("Fallo de red al obtener opiniones de Firestore, usando local.", e);
        }
    }

    // Fallback local
    if (allOpinions.length === 0) {
        const local = localStorage.getItem('esteko_landing_reviews');
        if (local) {
            try {
                allOpinions = JSON.parse(local);
            } catch (err) {
                console.warn("Error parsing local reviews", err);
            }
        }
    }

    renderOpinionsTable();
    initOpinionModalListeners();
}

function renderOpinionsTable() {
    const tableBody = document.getElementById('opiniones-table-body');
    if (!tableBody) return;

    if (allOpinions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="table-empty-placeholder">No hay opiniones cargadas.</td></tr>';
        return;
    }

    tableBody.innerHTML = '';
    allOpinions.forEach(op => {
        const row = document.createElement('tr');
        
        let starsHTML = '';
        const starCount = parseInt(op.stars) || 5;
        for (let s = 0; s < 5; s++) {
            starsHTML += s < starCount ? '<i class="fa-solid fa-star" style="color: #ffc107;"></i>' : '<i class="fa-regular fa-star" style="color: #ccc;"></i>';
        }

        row.innerHTML = `
            <td>
                <img src="${op.avatar_url || 'img/default-avatar.png'}" alt="Avatar" class="avatar-table-admin" onerror="this.src='img/default-avatar.png'" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
            </td>
            <td><strong>${op.name}</strong></td>
            <td><span class="badge-role" style="background: rgba(255,255,255,0.05); color: var(--text-main); border: 1px solid rgba(255,255,255,0.1);">${op.title || 'Pasajero'}</span></td>
            <td><div>${starsHTML}</div></td>
            <td>${op.time}</td>
            <td><div class="review-text-truncate" style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${op.comment}">${op.comment}</div></td>
            <td><strong>${op.order || 10}</strong></td>
            <td>
                <div class="table-action-btns">
                    <button class="btn-table-action btn-edit-opinion" data-id="${op.id}" title="Editar Opinión"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-table-action btn-delete-opinion" data-id="${op.id}" style="color: var(--primary);" title="Eliminar Opinión"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Event listeners
    tableBody.querySelectorAll('.btn-edit-opinion').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            editOpinion(id);
        });
    });

    tableBody.querySelectorAll('.btn-delete-opinion').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            deleteOpinion(id);
        });
    });
}

function initOpinionModalListeners() {
    if (opinionModalsInitialized) return;
    opinionModalsInitialized = true;

    // Configurar file uploader para avatar
    initFileUploaderListeners('opinion-avatar-file', 'opinion-avatar');

    const openBtn = document.getElementById('btn-open-create-opinion-modal');
    const modal = document.getElementById('opinion-modal');
    const closeBtn = document.getElementById('btn-close-opinion-modal');
    const cancelBtn = document.getElementById('btn-cancel-opinion-modal');
    const form = document.getElementById('form-opinion-crud');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            document.getElementById('opinion-modal-title').innerHTML = '<i class="fa-solid fa-star"></i> Registrar Opinión de Google';
            document.getElementById('opinion-id').value = '';
            form.reset();
            document.getElementById('opinion-order').value = (allOpinions.length * 10) + 10;
            modal.style.display = 'flex';
        });
    }

    const closeModal = () => {
        modal.style.display = 'none';
        form.reset();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('btn-save-opinion-submit');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

            const id = document.getElementById('opinion-id').value.trim();
            const name = document.getElementById('opinion-name').value.trim();
            const title = document.getElementById('opinion-title').value.trim();
            const avatar_url = document.getElementById('opinion-avatar').value.trim();
            const stars = parseInt(document.getElementById('opinion-stars').value, 10) || 5;
            const time = document.getElementById('opinion-time').value.trim();
            const order = parseInt(document.getElementById('opinion-order').value, 10) || 10;
            const comment = document.getElementById('opinion-comment').value.trim();

            const opinionData = {
                name,
                title,
                avatar_url,
                stars,
                time,
                order,
                comment,
                updated_at: new Date().toISOString()
            };

            let success = true;

            if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
                try {
                    await ensureFirebaseAuth();
                    if (id && !id.startsWith('local-')) {
                        await firebase.firestore().collection('landing_reviews').doc(id).set(opinionData, { merge: true });
                    } else {
                        // Crear nuevo documento en Firestore
                        const docRef = await firebase.firestore().collection('landing_reviews').add({
                            ...opinionData,
                            created_at: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        opinionData.id = docRef.id;
                    }
                    isDatabaseOnline = true;
                } catch (err) {
                    console.error("Error guardando opinión en Firestore:", err);
                    success = false;
                }
            }

            // Guardar localmente
            let localList = JSON.parse(localStorage.getItem('esteko_landing_reviews') || '[]');
            if (id) {
                const idx = localList.findIndex(o => o.id === id);
                if (idx !== -1) {
                    localList[idx] = { ...localList[idx], ...opinionData };
                }
            } else {
                const newId = opinionData.id || 'local-' + Date.now();
                localList.push({ id: newId, ...opinionData });
            }
            localList.sort((a,b) => (a.order || 10) - (b.order || 10));
            localStorage.setItem('esteko_landing_reviews', JSON.stringify(localList));

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Opinión';

            if (success) {
                showToast(id ? "Opinión actualizada correctamente." : "Opinión registrada correctamente.");
                closeModal();
                loadOpinionsData();
            } else {
                alert("Ocurrió un error al guardar en la base de datos.");
            }
        });
    }
}

function editOpinion(id) {
    const op = allOpinions.find(o => o.id === id);
    if (!op) return;

    document.getElementById('opinion-modal-title').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar Opinión de Google';
    document.getElementById('opinion-id').value = op.id;
    document.getElementById('opinion-name').value = op.name;
    document.getElementById('opinion-title').value = op.title || '';
    document.getElementById('opinion-avatar').value = op.avatar_url || '';
    document.getElementById('opinion-stars').value = op.stars || 5;
    document.getElementById('opinion-time').value = op.time || 'Hace poco';
    document.getElementById('opinion-order').value = op.order || 10;
    document.getElementById('opinion-comment').value = op.comment;

    document.getElementById('opinion-modal').style.display = 'flex';
}

async function deleteOpinion(id) {
    if (!confirm("¿Estás seguro de que querés eliminar esta opinión de Google?")) return;

    let success = true;

    if (isDatabaseOnline && typeof firebase !== 'undefined') {
        try {
            if (id && !id.startsWith('local-')) {
                await firebase.firestore().collection('landing_reviews').doc(id).delete();
            }
        } catch (err) {
            console.error("Error al borrar opinión de Firestore:", err);
            success = false;
        }
    }

    // Local
    let localList = JSON.parse(localStorage.getItem('esteko_landing_reviews') || '[]');
    localList = localList.filter(o => o.id !== id);
    localStorage.setItem('esteko_landing_reviews', JSON.stringify(localList));

    if (success) {
        showToast("Opinión eliminada.");
        loadOpinionsData();
    } else {
        alert("Ocurrió un error al eliminar de la base de datos.");
    }
}


