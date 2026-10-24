import es from './es.js'
import en from './en.js'

// El idioma lo define cada página HTML con <html lang="...">.
export const lang = document.documentElement.lang === 'en' ? 'en' : 'es'
export const t = lang === 'en' ? en : es

export const otherLang =
  lang === 'en'
    ? { code: 'es', href: '/', label: 'Español', short: 'ES' }
    : { code: 'en', href: '/en/', label: 'English', short: 'EN' }

// Campos bilingües en los datos: { es: '...', en: '...' }.
export function pick(field) {
  if (field && typeof field === 'object') return field[lang] ?? field.es
  return field
}
