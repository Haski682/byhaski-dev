// Portafolio de desarrollo. El orden de la lista es el orden en el sitio.
//
// Campos:
//   slug       identificador único; las capturas van en public/projects/<slug>/
//   client     nombre del cliente
//   kind       'web' (sitio público), 'app' (app interna) o 'automation' (sin pantalla)
//   featured   true = aparece en la galería grande de destacados (ideal 3 a 5)
//   title      { es, en }
//   summary    { es, en } qué se hizo, en una o dos frases
//   services   claves de servicio: 'web', 'app', 'automation', 'shop' (sirven para el filtro)
//   stack      tecnologías usadas
//   year       año de entrega
//   url        link en vivo (solo sitios públicos)
//   images     rutas de capturas, la primera es la portada
//   flow       pasos del flujo (solo automatizaciones sin pantalla); cada paso puede ser texto o { es, en }
//   placeholder true = proyecto de ejemplo; borrar antes de publicar
//
// Capturas: 1600×1000 en webp. Las de escritorio salen del sitio en vivo a 1600×1000 y la
// última de cada proyecto junta tres pantallas de celular (cómo se hizo: docs/proyectos.md).

const shots = (slug, n = 3) => Array.from({ length: n }, (_, i) => `/projects/${slug}/${i + 1}.webp`)

export const projects = [
  {
    slug: 'qbrir',
    client: 'QBRIR',
    kind: 'web',
    featured: true,
    title: { es: 'Estructuras para eventos, en 3D', en: 'Event structures, in 3D' },
    summary: {
      es: 'Sitio para alquiler de pérgolas, pabellones y graneros para eventos. El montaje se arma en 3D mientras bajas por la página, y la cotización se pide en tres pasos y llega por WhatsApp.',
      en: 'Website for renting pergolas, pavilions and barns for events. The build assembles in 3D as you scroll, and quotes take three steps and arrive on WhatsApp.',
    },
    services: ['web'],
    stack: ['Next.js', 'Three.js', 'GSAP'],
    year: 2026,
    url: 'https://qbrir.com/',
    images: shots('qbrir', 4),
  },
  {
    slug: 'menioqr',
    client: 'MenioQR',
    kind: 'web',
    featured: true,
    title: { es: 'Menú digital por QR para restaurantes', en: 'QR digital menus for restaurants' },
    summary: {
      es: 'Sistema completo de cartas digitales: cada restaurante tiene su menú en un link o código QR, con su identidad, y lo actualiza desde un panel de administración. Culpables Fries ya sirve su carta con MenioQR.',
      en: 'A full digital menu system: each restaurant gets its menu on a link or QR code, in its own style, and updates it from an admin panel. Culpables Fries already serves its menu with MenioQR.',
    },
    services: ['app', 'web'],
    stack: ['Next.js', 'Supabase', 'Netlify'],
    year: 2026,
    url: 'https://menioqr.com/',
    images: shots('menioqr'),
  },
  {
    slug: 'grupo-euskadi',
    client: 'Grupo Euskadi',
    kind: 'web',
    featured: true,
    title: { es: 'Un sitio para Chile y otro para Colombia', en: 'One site for Chile, one for Colombia' },
    summary: {
      es: 'Sitio de seguridad privada y facility services. Al entrar se elige el país y cada uno tiene sus servicios, oficinas y solicitud de cotización.',
      en: 'Website for private security and facility services. Visitors pick their country first, and each one has its own services, offices and quote request.',
    },
    services: ['web'],
    stack: ['Next.js'],
    year: 2026,
    url: 'https://www.grupoeuskadi.com/',
    images: shots('grupo-euskadi'),
  },
  {
    slug: '808-fest',
    client: '808 FEST',
    kind: 'web',
    title: { es: 'Sitio, panel y boletas de un festival', en: 'Festival website, admin and tickets' },
    summary: {
      es: 'Sitio del festival con artistas, galería y equipo, más un panel de administración y el registro de asistentes con boletas que se validan en la entrada del evento.',
      en: 'Festival website with artists, gallery and team, plus an admin panel and attendee registration with tickets that are checked at the event entrance.',
    },
    services: ['web', 'app'],
    stack: ['Astro', 'React'],
    year: 2026,
    url: 'https://el808fest.com/',
    images: shots('808-fest', 4),
  },
  {
    slug: 'carmotos-del-eje',
    client: 'Carmotos del Eje',
    kind: 'web',
    title: { es: 'Inventario de carros y motos con panel', en: 'Car and motorbike inventory with admin' },
    summary: {
      es: 'Sitio para comprar, vender y permutar vehículos en Pereira: inventario con filtros, ficha de cada vehículo, simulador de financiación y un panel para manejar el inventario.',
      en: 'Website to buy, sell and trade vehicles in Pereira: filterable inventory, a page per vehicle, a financing calculator and an admin panel to manage stock.',
    },
    services: ['web', 'app'],
    stack: ['Next.js'],
    year: 2026,
    url: 'https://carmotosdeleje.com/',
    images: shots('carmotos-del-eje'),
  },
  {
    slug: 'architec-smile',
    client: 'Architec Smile',
    kind: 'web',
    title: { es: 'Clínica dental, en español e inglés', en: 'Dental clinic, in Spanish and English' },
    summary: {
      es: 'Sitio bilingüe para una clínica de odontología digital en El Poblado: tratamientos, cómo se decide cada caso, de qué depende el valor y agenda de valoración.',
      en: 'Bilingual website for a digital dentistry clinic in El Poblado: treatments, how each case is decided, what drives the cost and booking a first visit.',
    },
    services: ['web'],
    stack: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
    year: 2026,
    url: 'https://architecsmile.com/',
    images: shots('architec-smile'),
  },
  {
    slug: 'ma-beauty-salon',
    client: 'María Ángel Beauty Salon',
    kind: 'web',
    title: { es: 'Salón de belleza con precios y reservas', en: 'Beauty salon with prices and booking' },
    summary: {
      es: 'Sitio para un salón en Pinares, Pereira, con la carta de servicios y sus precios publicados, diagnóstico capilar gratis y reserva en línea paso a paso.',
      en: 'Website for a salon in Pinares, Pereira, with its full service list and published prices, a free hair diagnosis and step-by-step online booking.',
    },
    services: ['web'],
    stack: ['Next.js'],
    year: 2026,
    url: 'https://mabeautysalon.com/',
    images: shots('ma-beauty-salon'),
  },
  {
    slug: 'conectmedia',
    client: 'ConectMedia',
    kind: 'web',
    title: { es: 'Agencia de contenido visual', en: 'Visual content agency' },
    summary: {
      es: 'Sitio para una agencia de video, fotografía, drone y branding en Puerto Vallarta, con sus especialidades, portafolio en foto y video, y preguntas frecuentes.',
      en: 'Website for a video, photo, drone and branding agency in Puerto Vallarta, with its specialties, a photo and video portfolio, and an FAQ.',
    },
    services: ['web'],
    stack: ['React', 'Vite'],
    year: 2026,
    url: 'https://conectmedia.com/',
    images: shots('conectmedia'),
  },
  {
    slug: 'agogo',
    client: 'Agogó',
    kind: 'web',
    title: { es: 'Tienda de tenis con pedido por WhatsApp', en: 'Sneaker store with WhatsApp ordering' },
    summary: {
      es: 'Tienda de tenis, bolsos y gorras: el pedido se arma en un minuto sin registrarse y se cierra por WhatsApp. Tiene panel para manejar los productos.',
      en: 'Store for sneakers, bags and caps: customers build their order in a minute without signing up and close it on WhatsApp. Includes an admin panel for products.',
    },
    services: ['shop', 'app'],
    stack: ['Astro'],
    year: 2026,
    url: 'https://agogotienda.co/',
    images: shots('agogo'),
  },
  {
    slug: 'sauze-store',
    client: 'Sauze Store',
    kind: 'web',
    title: { es: 'Perfumería, bolsos y arte', en: 'Perfume, bags and art' },
    summary: {
      es: 'Tienda de perfumería de nicho, árabe y nacional, bolsos y obra de arte, con catálogo filtrable, asesoría y pedidos por WhatsApp y panel para el catálogo.',
      en: 'Store for niche, Arabic and local perfume, bags and artwork, with a filterable catalog, advice and orders on WhatsApp, and an admin panel for the catalog.',
    },
    services: ['shop', 'app'],
    stack: ['HTML', 'CSS', 'JavaScript', 'Cloudflare'],
    year: 2026,
    url: 'https://sauzestore.com/',
    images: shots('sauze-store'),
  },
  {
    slug: 'mindset',
    client: 'Mindset',
    kind: 'web',
    title: { es: 'Tienda de una marca de ropa', en: 'Clothing brand store' },
    summary: {
      es: 'Tienda para el primer drop de gorras y bandanas de la marca, con manifiesto, pago contraentrega y panel de productos.',
      en: "Store for the brand's first drop of caps and bandanas, with a manifesto, cash on delivery and a product admin panel.",
    },
    services: ['shop', 'app'],
    stack: ['Next.js', 'Vercel'],
    year: 2026,
    url: 'https://mindset-web-eight.vercel.app/',
    images: shots('mindset'),
  },
]
