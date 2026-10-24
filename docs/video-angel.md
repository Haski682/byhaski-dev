# Video del ángel

## Dónde está hoy (23-oct-2026, decisión de Haski)

- **Inicio:** el querubín del logo (el de la cámara) flotando en ASCII, como estaba al principio.
  `SITE.heroVideo` está vacío en `src/config.js`. Si se le pone una ruta de video, el inicio la
  dibuja en ASCII en lugar del querubín.
  - Sobre la cámara dice "HASKI" en blanco con el efecto del "EL HACKER" de el808fest.com:
    resplandor y, a cada lado, un carácter al azar que cambia cada 80 ms. (Se probó también en el
    título grande en rojo neón, y Haski prefirió dejar el título como estaba.) Lo pinta
    `createNeonLabel()` en `engine.js` en un canvas 2D. La posición sale de `CAMERA_LABEL` en
    `cherubSource.js`, y el tamaño se ajusta a ~75 % del ancho de la cámara. La palabra se cambia
    con la opción `label` del motor y el color con `labelColor`.
- **"Lo que hago":** el ángel con laptop en video normal, bajo el título, en `public/hero/angel-float.mp4`
  y `angel-float-poster.webp`. Mide 820×720, dura 4 s con el mismo loop, pesa ~360 KB, va sin filtros y
  se pausa fuera de pantalla. Sale del clip de Flow recortado alrededor de la figura:
  `ffmpeg -i flow-assets/clip1.mp4 -an -vf "trim=start_frame=66:end_frame=163,setpts=PTS-STARTPTS,crop=820:720:215:0" -r 24 -c:v libx264 -crf 21 -preset slow -pix_fmt yuv420p -movflags +faststart public/hero/angel-float.mp4`
- Las versiones que se probaron para el inicio quedaron guardadas en `flow-assets/`, que no se sube a git:
  - `hero-propuesta/`: el ángel en ASCII con contorno, descrito abajo.
  - `hero-caballo/`: estilo "Orange Horse", con mosaico, estela roja y barrido rojo. Haski la descartó.

## El video del ángel para el inicio, versión con contorno (no se usa)

- Proyecto de Google Flow **"BY HASKI DEV - Ángel del hero"** (en la cuenta de Google de Haski).
- Se probaron 4 imágenes con Nano Banana Pro (0 puntos): L1 y L2 con laptop, C1 y C2 con cámara.
  Las de cámara salieron con cámara de fotos, no con la de cine del logo. **Quedó L1** (laptop).
- Animación: Omni 1.1 Flash, modo Fotogramas con **L1 como primer y último cuadro**, 720p, 8 s,
  x1, **12 puntos**. Salió bien al primer intento y no hizo falta otro clip.
- Loop: del clip de 8 s se tomaron los cuadros 66 a 162 (4 s). Ahí la figura casi repite la pose y
  el empalme no se nota: el salto del último al primer cuadro es menor que el movimiento normal entre
  cuadros. No se usó ida y vuelta.
- Encuadre y contraste para ASCII: tal como salió de Flow, el ángel ocupaba el 84 % del alto. En
  pantallas anchas se le cortaba la cabeza y el título "BY HASKI" le tapaba el cuerpo. Además, la
  porcelana en sombra quedaba gris y en ASCII se veía como una mancha. Por eso el video se achica al
  60 % y se sube, para que quede entero encima del título. También se aclara el cuerpo con una curva
  y se le suma un contorno blanco (edgedetect).
- Archivos: `flow-assets/hero-propuesta/angel-loop.mp4` (1280×720, 24 fps, crf 22, sin audio,
  ~390 KB) y `angel-poster.webp`. Para usarlo, cópialos a `public/hero/` y pon sus rutas en
  `heroVideo`/`heroPoster`, y además `subjectWidth: 0.4` en el motor (con el querubín va en 0.68).
  Los originales de Flow están en `flow-assets/`.
- Las imágenes para compartir (`public/og-es.png`, `public/og-en.png`) muestran hoy el querubín del logo.
- Con "reducir movimiento" (por ejemplo, Windows con "Efectos de animación" apagados), el inicio
  igual se anima y reacciona al mouse (Haski lo pidió así, 24-oct-2026). Solo el título deja de
  descifrarse. En pantallas táctiles no hay efecto de mouse.

Comando que se usó para el loop:

```bash
ffmpeg -i flow-assets/clip1.mp4 -an -filter_complex "[0:v]trim=start_frame=66:end_frame=163,setpts=PTS-STARTPTS,scale=768:432,pad=1280:720:266:80:black,format=gray,curves=all='0/0 0.06/0 0.25/0.55 0.55/0.9 1/1',split[a][b];[b]edgedetect=low=0.06:high=0.2:mode=wires,format=gray[e];[a][e]blend=all_mode=lighten,format=yuv420p" -r 24 -c:v libx264 -crf 22 -preset slow -pix_fmt yuv420p -movflags +faststart public/hero/angel-loop.mp4
ffmpeg -i public/hero/angel-loop.mp4 -frames:v 1 -c:v libwebp -quality 85 public/hero/angel-poster.webp
```

Si cambias el video por otro, deja la figura en ~55–60 % del alto, en la mitad de arriba del cuadro
y con ~30–40 % del ancho (el motor asume `subjectWidth: 0.4` para que quepa en celular).

Prompt de la animación (el del Paso 2, más una frase para que termine en la pose inicial):

```
Animate this exact frame as live-action footage. Locked-off tripod, camera does not move. The cherub's small wings beat steadily, one gentle flap about every second, while the figure hovers in place with a subtle up-and-down bob of a few centimeters. The head, hands and the laptop stay still. At the end the figure is back in exactly the same pose and position as in the first frame. The background stays pure black; the lighting does not change, no particles, no smoke, no glow appears. Real-time live-action footage, 24 fps, 180-degree shutter, natural motion blur, real-world physics and weight. Preserve the exact texture, film grain, sharpness, colors and lighting of the source image; do not re-render, smooth, sharpen or add detail. One continuous take, no cuts, no transitions, no new objects, no text.
```

Lo de abajo es la guía original, por si hay que rehacerlo.

**Idea:** el querubín del logo de BY HASKI, pero en vez de la cámara sostiene una laptop
abierta: la versión "dev" del logo. Una figura blanca, con volumen, sobre negro puro se ve mucho
mejor en ASCII que el dibujo de líneas del logo, porque las sombras dan variedad de símbolos.

## Qué necesita el video para verse bien en ASCII

- Fondo **negro puro**, sin piso, sin paisaje, sin luces de fondo.
- Figura **blanca o muy clara**, alto contraste, centrada, ocupando ~75 % del alto del cuadro.
- Movimiento **lento y pequeño** (alas, flotación). Nada de cortes ni cambios de cámara.
- 16:9, 5 a 8 segundos, sin texto, sin audio.

## Paso 1 · Imagen fija (Nano Banana en Flow)

Sube el logo (`src/assets/cherub.webp`) como referencia.

```
A white porcelain sculpture of a chubby baby cherub with short curly hair and two small feathered wings, the same character and pose as the reference logo, flying toward the right. Instead of the film camera, the cherub holds an open laptop with both hands, the screen facing the cherub. Pure black background, no floor, no environment. One soft key light from the upper left and a thin white rim light on the wings, high contrast, deep black shadows. The figure is centered and fills about 75 percent of the frame height, nothing touches the edges. Product photograph, sharp focus, 16:9. No text, no logo on the laptop.
```

Variante, para conservar la cámara del logo: reemplaza la segunda frase por
`The cherub holds the same vintage film camera as in the reference logo.`

## Paso 2 · Animación (Omni Flash / Veo en Flow, imagen a video)

Usa la imagen del paso 1 como primer cuadro.

```
Animate this exact frame as live-action footage. Locked-off tripod, camera does not move. The cherub's two small wings beat steadily, one gentle flap about every second, while the figure hovers in place with a subtle up-and-down bob of a few centimeters. The head, hands and the laptop stay still. The background stays pure black; the lighting does not change, no particles, no smoke, no glow appears. Real-time live-action footage, 24 fps, 180-degree shutter, natural motion blur, real-world physics and weight. Preserve the exact texture, film grain, sharpness, colors and lighting of the source image; do not re-render, smooth, sharpen or add detail. One continuous take, no cuts, no transitions, no new objects, no text.
```

Genera 2 o 3 clips y elige el que tenga las alas más limpias (sin plumas que se deformen).

## Paso 3 · Hacerlo loop y exportar

Si el final no empalma con el inicio, haz un loop de ida y vuelta (las alas lo disimulan bien):

```bash
ffmpeg -i clip.mp4 -filter_complex "[0:v]reverse[r];[0:v][r]concat=n=2:v=1[out]" -map "[out]" -an pingpong.mp4
```

Exporta liviano para la web (queda en 1–3 MB):

```bash
ffmpeg -i pingpong.mp4 -an -vf "scale=1280:-2,fps=30" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart public/hero/angel-loop.mp4
ffmpeg -i public/hero/angel-loop.mp4 -frames:v 1 -vf "scale=1280:-2" public/hero/angel-poster.webp
```

Con esos dos archivos en `public/hero/`, el sitio usa el video solo. No hay que tocar código.
Después vuelve a generar las imágenes para compartir (`public/og-es.png` y `public/og-en.png`),
que hoy muestran el querubín del logo.
