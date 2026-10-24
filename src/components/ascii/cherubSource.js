// Fuente provisional del inicio: el querubín del logo de BY HASKI flotando.
// Es la fuente del inicio mientras SITE.heroVideo (src/config.js) esté vacío.

// Recorta el margen transparente del logo para que el querubín ocupe el cuadro.
function contentBox(img) {
  const c = document.createElement('canvas')
  c.width = img.width
  c.height = img.height
  const ctx = c.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0)
  const { data } = ctx.getImageData(0, 0, c.width, c.height)
  let minX = c.width
  let minY = c.height
  let maxX = 0
  let maxY = 0
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      if (data[(y * c.width + x) * 4 + 3] > 24) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX <= minX || maxY <= minY) return { x: 0, y: 0, w: img.width, h: img.height }
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 }
}

export async function createCherubSource(imageUrl, { width = 1280, height = 720 } = {}) {
  const img = new Image()
  img.src = imageUrl
  await img.decode()
  const box = contentBox(img)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const drawH = height * 0.78
  const drawW = (box.w / box.h) * drawH

  // Flota: sube y baja, y se inclina un poco
  let bob = 0
  let tilt = 0

  function draw(now) {
    const t = now / 1000
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    bob = Math.sin(t * 1.1) * height * 0.02
    tilt = Math.sin(t * 0.7) * 0.03

    ctx.save()
    ctx.translate(width / 2, height / 2 + bob)
    ctx.rotate(tilt)
    ctx.drawImage(img, box.x, box.y, box.w, box.h, -drawW / 2, -drawH / 2, drawW, drawH)
    ctx.restore()
  }

  // Dónde está, en el cuadro actual, el "HASKI" escrito en la cámara del logo
  // (fracción del canvas, y hacia abajo) y cuánto mide de ancho el cuerpo de la cámara.
  // Así el motor lo vuelve a escribir en letras.
  const bodyW = (CAMERA_LABEL.bodyW / box.w) * (drawW / width)
  function label() {
    const lx = ((CAMERA_LABEL.x - box.x) / box.w - 0.5) * drawW
    const ly = ((CAMERA_LABEL.y - box.y) / box.h - 0.5) * drawH
    const cos = Math.cos(tilt)
    const sin = Math.sin(tilt)
    return {
      x: (width / 2 + lx * cos - ly * sin) / width,
      y: (height / 2 + bob + lx * sin + ly * cos) / height,
      w: bodyW,
    }
  }

  return { canvas, draw, label }
}

// Centro del texto "HASKI" de la cámara y ancho del cuerpo de la cámara,
// en píxeles de src/assets/cherub.webp (524×584).
const CAMERA_LABEL = { x: 364, y: 214, bodyW: 72 }
