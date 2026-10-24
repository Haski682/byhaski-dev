# Cómo se agrega un proyecto

Los proyectos están en `src/data/projects.js`. Cada uno tiene su ficha en español e inglés y sus
capturas en `public/projects/<slug>/`, como `1.webp`, `2.webp`... La primera es la portada.

## Capturas (24-oct-2026)

Se toman del sitio en vivo con Playwright:

- **Escritorio:** ventana de 1600×1000, sin la barra de scroll. Se toman dos o tres:
  - la portada;
  - la sección que mejor muestra el trabajo, como el inventario, el catálogo o el panel.

  Para que terminen las animaciones de entrada, antes de capturar se baja de a poco y se esperan
  ~2.5 s.
- **Celular:** tres pantallas de 390×844 a 2× (iPhone). Puede ser el inicio, una página interna y
  una ficha de producto.
- Si el sitio tiene pantalla de entrada, primero se toca. Pasa en el 808 ("TOCA PARA ENTRAR").

Luego se convierten con:

```bash
sh scripts/proyecto-webp.sh <carpeta-con-capturas> <slug> d1 d2
```

Ese script:
- pasa las de escritorio a webp de 1600×1000;
- agrega al final una imagen con las tres de celular lado a lado, con esquinas redondeadas, sobre
  `#0d0d0d`.

Cada imagen pesa entre 30 y 200 KB.

## Lo que falta

- Capturas de los paneles admin (808, MenioQR, Carmotos y las tiendas). Hoy solo se mencionan en
  el texto, porque están detrás de un login. Haski puede entrar en una ventana del navegador y ahí
  se capturan, difuminando los datos de personas.
- Revisar los años: todos los proyectos dicen 2026 porque así aparece en el pie de cada sitio.
