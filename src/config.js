// Datos de contacto y rutas del sitio. Lo marcado PENDIENTE lo entrega Haski.
export const SITE = {
  url: 'https://dev.byhaski.com',
  videoSite: 'https://byhaski.com',

  // EmailJS: mismo service y public key que byhaski.com.
  // PENDIENTE: cambiar templateId por la plantilla "dev" cuando exista en EmailJS.
  emailjs: {
    serviceId: 'service_g71f9b9',
    templateId: 'template_qtjsy9k',
    publicKey: 'GDwlkqohEjVmKTGFb',
  },

  // WhatsApp en formato internacional, sin "+" ni espacios.
  whatsapp: '573117786702',
  // Correo de contacto para empresas.
  email: 'haski.audiovisual@gmail.com',

  // Video del inicio dibujado en ASCII. Vacío = el querubín del logo flotando (lo que eligió Haski).
  // El video del ángel con laptop para el inicio quedó guardado en flow-assets/hero-propuesta/.
  heroVideo: '',
  heroPoster: '',

  // El ángel con laptop, en video normal, junto a "Lo que hago".
  servicesVideo: '/hero/angel-float.mp4',
  servicesPoster: '/hero/angel-float-poster.webp',
}
