# dev.byhaski.com

Sitio de desarrollo de BY HASKI: páginas web, apps a medida, automatización e IA y tiendas
online para empresas. byhaski.com sigue siendo solo para video; este es un sitio aparte.

- Español en `/` e inglés en `/en/`. Cada uno tiene su propia vista previa al compartir el link.
- **Inicio:** el querubín del logo dibujado con símbolos de código en WebGL (three.js). Reacciona al
  mouse, y en la cámara dice HASKI con un efecto de neón.
- **"Lo que hago":** el ángel con laptop en video, junto a los servicios.
- **Proyectos:** destacados en tarjetas que se apilan, una grilla con filtro y el detalle en una ventana.
- **Contacto:** formulario por EmailJS (el mismo servicio que byhaski.com), WhatsApp y correo.

## Correrlo en tu computador

```bash
npm install
npm run dev        # http://localhost:5173  (y /en/ para inglés)
npm run build      # genera dist/
npm run preview    # sirve dist/ para revisarlo como en producción
```

## Dónde está cada cosa

| Qué | Dónde |
| --- | --- |
| Proyectos del portafolio | `src/data/projects.js`, con las capturas en `public/projects/<slug>/` |
| Textos en español / inglés | `src/i18n/es.js` y `src/i18n/en.js` |
| WhatsApp, correo, EmailJS | `src/config.js` |
| Título y descripción para Google y al compartir | `index.html` y `en/index.html` |
| Video del ángel ("Lo que hago") | `public/hero/angel-float.mp4` (ver `docs/video-angel.md`) |
| Colores y tipografías | `src/styles/base.css` |
| Efecto ASCII del inicio | `src/components/ascii/engine.js` |

## Agregar un proyecto

1. Toma las capturas y conviértelas con `scripts/proyecto-webp.sh` (paso a paso en `docs/proyectos.md`).
2. Agrega un objeto en `src/data/projects.js`. Los campos están explicados arriba del archivo.
   - Sitio público: `kind: 'web'` + `url`.
   - App interna: `kind: 'app'`, sin `url` (muestra "acceso privado").
   - Automatización sin pantalla: `kind: 'automation'` + `flow: ['Paso 1', 'Paso 2', ...]`.
   - `featured: true` para que salga en las tarjetas grandes (ideal 3 a 5).
3. `git push` y se publica solo.

## Pendiente

- [x] Proyectos reales: 11, con capturas de los sitios en vivo (ver `docs/proyectos.md`).
- [x] Video del ángel e imágenes para compartir (`public/og-es.png` / `og-en.png`).
- [x] WhatsApp y correo en `src/config.js`.
- [ ] Capturas de los paneles admin (808, MenioQR, Carmotos, tiendas).
- [ ] Plantilla "dev" en EmailJS, si se quiere distinguir los mensajes de los de byhaski.com.

## Publicar

El sitio vive en GitHub Pages (repo `Haski682/byhaski-dev`). El workflow
`.github/workflows/deploy.yml` compila y publica en cada push a `main`.

1. Repo creado, con Pages en modo "GitHub Actions" y el dominio `dev.byhaski.com` configurado.
2. En Hostinger (hPanel → Dominios → byhaski.com → DNS), agregar un registro **CNAME**:
   nombre `dev`, apunta a `haski682.github.io`.
3. Cuando el dominio responda, activar **Enforce HTTPS** en Settings → Pages.
4. Revisar la vista previa del link en español e inglés (por ejemplo con opengraph.xyz).
5. Solo entonces, agregar el enlace en byhaski.com (Footer y About).
