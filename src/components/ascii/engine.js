import {
  CanvasTexture,
  Color,
  DataTexture,
  HalfFloatType,
  LinearFilter,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector4,
  VideoTexture,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three'

// Dibuja una fuente (video o canvas) como caracteres de código en un <canvas> WebGL.
//
// Tres pasadas por cuadro:
//   1. Estela del mouse: un campo de velocidad de baja resolución que se desvanece.
//   2. Celdas: promedia el brillo de la fuente dentro de cada celda (ya desplazada por la estela).
//   3. ASCII: dibuja en cada celda el glifo cuyo "peso" visual corresponde a ese brillo.

const CODE_GLYPHS = ' .,:;-_=+*/\\|<>()[]{}#'

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const TRAIL_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uPrev;
  uniform vec2 uPointer;
  uniform vec2 uDelta;
  uniform float uAspect;
  uniform float uRadius;
  uniform float uDissipation;
  uniform float uForce;
  varying vec2 vUv;

  void main() {
    vec2 prev = texture2D(uPrev, vUv).xy;
    vec2 vel = texture2D(uPrev, vUv - prev * 0.012).xy * uDissipation;
    vec2 d = vUv - uPointer;
    d.x *= uAspect;
    float splat = exp(-dot(d, d) / (uRadius * uRadius));
    vel += uDelta * uForce * splat;
    gl_FragColor = vec4(clamp(vel, -1.0, 1.0), 0.0, 1.0);
  }
`

const CELL_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uSource;
  uniform sampler2D uTrail;
  uniform vec2 uGrid;
  uniform vec2 uResolution;
  uniform float uCell;
  uniform vec2 uSourceSize;
  uniform float uZoom;
  uniform float uGain;
  uniform float uGamma;
  uniform float uDistortion;
  uniform vec2 uOffset;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    uv -= uOffset;
    float screenAspect = uResolution.x / uResolution.y;
    float sourceAspect = uSourceSize.x / uSourceSize.y;
    vec2 scale = screenAspect > sourceAspect
      ? vec2(1.0, sourceAspect / screenAspect)
      : vec2(screenAspect / sourceAspect, 1.0);
    return (uv - 0.5) * scale / uZoom + 0.5;
  }

  float luminance(vec2 suv) {
    float inside = step(0.0, suv.x) * step(suv.x, 1.0) * step(0.0, suv.y) * step(suv.y, 1.0);
    vec3 c = texture2D(uSource, clamp(suv, 0.0, 1.0)).rgb;
    return dot(c, vec3(0.2126, 0.7152, 0.0722)) * inside;
  }

  void main() {
    vec2 cell = floor(vUv * uGrid);
    vec2 cellUv = vec2(uCell) / uResolution;
    vec2 center = (cell + 0.5) * cellUv;

    vec2 vel = texture2D(uTrail, center).xy;
    float speed = length(vel);
    vec2 base = center - vel * uDistortion;

    float sum = 0.0;
    for (int y = 0; y < 4; y++) {
      for (int x = 0; x < 4; x++) {
        vec2 o = (vec2(float(x), float(y)) + 0.5) / 4.0 - 0.5;
        sum += luminance(coverUv(base + o * cellUv));
      }
    }
    float lum = pow(clamp(sum / 16.0 * uGain, 0.0, 1.0), uGamma);
    lum = clamp((lum - 0.05) / 0.95 + speed * 0.25, 0.0, 1.0);
    gl_FragColor = vec4(lum, clamp(speed * 2.0, 0.0, 1.0), 0.0, 1.0);
  }
`

const ASCII_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uCells;
  uniform sampler2D uAtlas;
  uniform float uGlyphCount;
  uniform vec2 uGrid;
  uniform vec2 uResolution;
  uniform float uCell;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform sampler2D uLabelTex;
  uniform vec4 uLabel; // xy: celda de abajo a la izquierda de la etiqueta; zw: ancho y alto en celdas (0 = no hay)
  varying vec2 vUv;

  void main() {
    vec2 frag = vUv * uResolution;
    vec2 cell = floor(frag / uCell);
    vec2 local = fract(frag / uCell);
    vec4 data = texture2D(uCells, (cell + 0.5) / uGrid);
    float lum = data.r;
    float heat = smoothstep(0.12, 0.7, data.g);

    float index = floor(lum * (uGlyphCount - 1.0) + 0.5);
    float glyph = texture2D(uAtlas, vec2((index + local.x) / uGlyphCount, local.y)).r;

    vec2 p = vUv - 0.5;
    p.x *= uResolution.x / uResolution.y;
    float vignette = 1.0 - smoothstep(0.45, 1.15, length(p)) * 0.7;

    vec3 ink = mix(uInk, uAccent, heat);
    vec3 color = ink * glyph * mix(0.4, 1.0, lum) * vignette;

    // Etiqueta de la cámara: "HASKI" en rojo neón (textura de createNeonLabel). Donde brilla,
    // los glifos de abajo se oscurecen para que se lea sobre los # del cuerpo.
    vec2 lc = cell - uLabel.xy;
    float inLabel = step(0.0, lc.x) * step(lc.x, uLabel.z - 1.0) * step(0.0, lc.y) * step(lc.y, uLabel.w - 1.0);
    vec4 neon = texture2D(uLabelTex, (lc + local) / max(uLabel.zw, vec2(1.0))) * inLabel;
    color = color * (1.0 - smoothstep(0.0, 0.25, neon.a) * 0.95) + neon.rgb * neon.a;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Ordena los glifos por cuánta tinta tienen, para que el brillo elija el glifo correcto.
function buildAtlas(fontFamily, glyphs) {
  const size = 64
  const font = `${Math.round(size * 0.74)}px ${fontFamily}`
  const probe = document.createElement('canvas')
  probe.width = probe.height = size
  const pctx = probe.getContext('2d', { willReadFrequently: true })
  pctx.font = font
  pctx.textAlign = 'center'
  pctx.textBaseline = 'middle'
  pctx.fillStyle = '#fff'

  const ranked = [...new Set(glyphs)]
    .map((ch) => {
      pctx.clearRect(0, 0, size, size)
      pctx.fillText(ch, size / 2, size / 2)
      const data = pctx.getImageData(0, 0, size, size).data
      let ink = 0
      for (let i = 3; i < data.length; i += 4) ink += data[i]
      return { ch, ink }
    })
    .sort((a, b) => a.ink - b.ink)

  const canvas = document.createElement('canvas')
  canvas.width = size * ranked.length
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
  ranked.forEach((g, i) => ctx.fillText(g.ch, i * size + size / 2, size / 2))

  const texture = new CanvasTexture(canvas)
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.generateMipmaps = false
  return { texture, count: ranked.length }
}

// Etiqueta de neón, como el "EL HACKER" de el808fest.com: la palabra con resplandor y, a cada
// lado, un carácter al azar que cambia cada 80 ms. Se pinta en un canvas 2D que el shader pone
// sobre los glifos, al tamaño exacto en píxeles del rectángulo de celdas que ocupa.
const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>/?'

function createNeonLabel(fontFamily, word, color) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext('2d')
  const randomChar = () => SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
  const makeTexture = () => {
    const t = new CanvasTexture(canvas)
    t.minFilter = LinearFilter
    t.magFilter = LinearFilter
    t.generateMipmaps = false
    return t
  }

  let texture = makeTexture()
  let fontPx = 0
  let cols = 0
  let rows = 0
  let m = null
  let left = randomChar()
  let right = randomChar()
  let lastSwap = 0

  // Medidas con letra de `px`: los caracteres de los lados van en un espacio fijo
  // para que la palabra no se mueva al cambiar.
  function measure(px) {
    ctx.font = `${px}px ${fontFamily}`
    const slot = ctx.measureText('W').width
    const gap = px * 0.45
    const wordW = ctx.measureText(word).width
    const cap = ctx.measureText('H').actualBoundingBoxAscent || px * 0.7
    return { slot, gap, wordW, cap, width: slot * 2 + gap * 2 + wordW }
  }
  const widthPerPx = measure(100).width / 100

  function paint() {
    const { width: w, height: h } = canvas
    ctx.clearRect(0, 0, w, h)
    ctx.font = `${fontPx}px ${fontFamily}`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = color
    ctx.shadowColor = color
    const x = (w - m.width) / 2
    const y = (h + m.cap) / 2
    const row = () => {
      ctx.globalAlpha = 0.7
      ctx.fillText(left, x + (m.slot - ctx.measureText(left).width) / 2, y)
      const rx = x + m.slot + m.gap * 2 + m.wordW
      ctx.fillText(right, rx + (m.slot - ctx.measureText(right).width) / 2, y)
      ctx.globalAlpha = 1
      ctx.fillText(word, x + m.slot + m.gap, y)
    }
    ctx.shadowBlur = fontPx * 0.9 // halo amplio, dos veces para que brille como el neón
    row()
    row()
    ctx.shadowBlur = fontPx * 0.25 // núcleo nítido
    row()
    ctx.shadowBlur = 0
    texture.needsUpdate = true
  }

  // Ajusta el canvas a una letra de `px` (px de pantalla). Solo hace algo si el tamaño cambió.
  function layout(px, cellPx) {
    px = Math.round(px)
    if (px === fontPx) return
    fontPx = px
    m = measure(px)
    const pad = px * 1.2 // espacio para que el resplandor se apague antes del borde
    cols = Math.ceil((m.width + pad * 2) / cellPx)
    rows = Math.ceil((m.cap + pad * 2) / cellPx)
    canvas.width = Math.round(cols * cellPx)
    canvas.height = Math.round(rows * cellPx)
    texture.dispose()
    texture = makeTexture()
    paint()
  }

  function tick(now) {
    if (!m || now - lastSwap < 80) return
    lastSwap = now
    left = randomChar()
    right = randomChar()
    paint()
  }

  return {
    get texture() {
      return texture
    },
    get cols() {
      return cols
    },
    get rows() {
      return rows
    },
    widthPerPx,
    layout,
    tick,
    dispose: () => texture.dispose(),
  }
}

function fullscreenMaterial(fragmentShader, uniforms) {
  return new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader,
    uniforms,
    depthTest: false,
    depthWrite: false,
  })
}

export function createAsciiHero(canvas, options = {}) {
  const o = {
    cell: 14, // tamaño de celda en px CSS
    interactive: true,
    fps: 60,
    ink: '#ffffff',
    accent: '#dc2626',
    glyphs: CODE_GLYPHS,
    label: 'HASKI', // palabra que se escribe en la cámara si la fuente dice dónde va
    labelColor: '#ffffff', // blanco, como el resto del querubín (el rojo neón va en el título)
    font: '"VCR", ui-monospace, monospace',
    gain: 1.45,
    gamma: 0.85,
    offsetX: 0.08, // corrimiento horizontal del sujeto en pantallas anchas (fracción del ancho)
    subjectWidth: 0.68, // ancho del sujeto dentro de la fuente, para que no se corte en pantallas verticales
    ...options,
  }

  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance',
  })
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  renderer.setPixelRatio(dpr)
  renderer.setClearColor(0x000000, 1)
  renderer.autoClear = false

  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const scene = new Scene()
  const quad = new Mesh(new PlaneGeometry(2, 2))
  quad.frustumCulled = false
  scene.add(quad)

  const atlas = buildAtlas(o.font, o.glyphs)
  const neon = createNeonLabel(o.font, o.label, o.labelColor)

  const blank = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1)
  blank.needsUpdate = true

  // Fuente
  let sourceTexture = null
  let drawSource = null
  let labelSource = null
  let sourceSize = new Vector2(16, 9)

  // Estela del mouse (solo en modo interactivo)
  const trailSize = new Vector2(128, 80)
  const targetOpts = {
    type: HalfFloatType,
    format: RGBAFormat,
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    depthBuffer: false,
  }
  let trailA = null
  let trailB = null
  const trailMat = fullscreenMaterial(TRAIL_FRAG, {
    uPrev: { value: blank },
    uPointer: { value: new Vector2(-10, -10) },
    uDelta: { value: new Vector2() },
    uAspect: { value: 1 },
    uRadius: { value: 0.06 },
    uDissipation: { value: 0.94 },
    uForce: { value: 9 },
  })
  if (o.interactive) {
    trailA = new WebGLRenderTarget(trailSize.x, trailSize.y, targetOpts)
    trailB = new WebGLRenderTarget(trailSize.x, trailSize.y, targetOpts)
  }

  // Celdas
  let cellTarget = new WebGLRenderTarget(1, 1, {
    minFilter: NearestFilter,
    magFilter: NearestFilter,
    depthBuffer: false,
  })
  const grid = new Vector2(1, 1)
  const resolution = new Vector2(1, 1)

  const cellMat = fullscreenMaterial(CELL_FRAG, {
    uSource: { value: blank },
    uTrail: { value: blank },
    uGrid: { value: grid },
    uResolution: { value: resolution },
    uCell: { value: o.cell * dpr },
    uSourceSize: { value: sourceSize },
    uZoom: { value: 1 },
    uGain: { value: o.gain },
    uGamma: { value: o.gamma },
    uDistortion: { value: 0.07 },
    uOffset: { value: new Vector2() },
  })

  const asciiMat = fullscreenMaterial(ASCII_FRAG, {
    uCells: { value: cellTarget.texture },
    uAtlas: { value: atlas.texture },
    uGlyphCount: { value: atlas.count },
    uGrid: { value: grid },
    uResolution: { value: resolution },
    uCell: { value: o.cell * dpr },
    uInk: { value: new Color(o.ink) },
    uAccent: { value: new Color(o.accent) },
    uLabelTex: { value: neon.texture },
    uLabel: { value: new Vector4(0, 0, 0, 0) },
  })

  // Lleva el punto de la etiqueta (en la fuente) a las celdas de pantalla que ocupa.
  // Es la inversa de coverUv() del shader de celdas.
  function updateLabel(now) {
    const u = asciiMat.uniforms.uLabel.value
    if (!labelSource) {
      u.set(0, 0, 0, 0)
      return
    }
    const p = labelSource()
    const screenAspect = resolution.x / resolution.y
    const sourceAspect = sourceSize.x / sourceSize.y
    const sx = screenAspect > sourceAspect ? 1 : screenAspect / sourceAspect
    const sy = screenAspect > sourceAspect ? sourceAspect / screenAspect : 1
    const zoom = cellMat.uniforms.uZoom.value
    const off = cellMat.uniforms.uOffset.value
    const ux = ((p.x - 0.5) * zoom) / sx + 0.5 + off.x
    const uy = ((1 - p.y - 0.5) * zoom) / sy + 0.5 + off.y
    const cellPx = o.cell * dpr
    const cx = (ux * resolution.x) / cellPx
    const cy = (uy * resolution.y) / cellPx
    // La letra se ajusta para que el texto ocupe ~75 % del cuerpo de la cámara.
    const bodyPx = (((p.w || 0) * zoom) / sx) * resolution.x
    const px = Math.min(cellPx * 2.2, Math.max(cellPx * 0.9, (bodyPx * 0.75) / neon.widthPerPx))
    neon.layout(px, cellPx)
    neon.tick(now)
    asciiMat.uniforms.uLabelTex.value = neon.texture
    u.set(Math.floor(cx - neon.cols / 2 + 0.5), Math.floor(cy - neon.rows / 2 + 0.5), neon.cols, neon.rows)
  }

  function updateZoom() {
    // En pantallas verticales se aleja la cámara para que el sujeto quepa completo.
    const screenAspect = resolution.x / resolution.y
    const sourceAspect = sourceSize.x / sourceSize.y
    cellMat.uniforms.uZoom.value = Math.min(1, screenAspect / (sourceAspect * o.subjectWidth))
    // En pantallas anchas el sujeto se corre a la derecha para dejar aire al texto de la izquierda.
    cellMat.uniforms.uOffset.value.set(screenAspect > 1.2 ? o.offsetX : 0, 0)
  }

  function resize() {
    const w = Math.max(1, canvas.clientWidth)
    const h = Math.max(1, canvas.clientHeight)
    renderer.setSize(w, h, false)
    resolution.set(w * dpr, h * dpr)
    grid.set(Math.ceil(w / o.cell), Math.ceil(h / o.cell))
    cellTarget.setSize(grid.x, grid.y)
    trailMat.uniforms.uAspect.value = w / h
    if (trailA) {
      trailSize.set(128, Math.max(32, Math.round((128 * h) / w)))
      trailA.setSize(trailSize.x, trailSize.y)
      trailB.setSize(trailSize.x, trailSize.y)
    }
    updateZoom()
    if (!running) renderFrame(performance.now())
  }

  // Puntero
  const pointer = new Vector2(-10, -10)
  const delta = new Vector2()
  let hasPointer = false

  function pointerMove(clientX, clientY) {
    if (!o.interactive) return
    const rect = canvas.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width
    const y = 1 - (clientY - rect.top) / rect.height
    if (hasPointer) delta.add(new Vector2(x - pointer.x, y - pointer.y))
    pointer.set(x, y)
    hasPointer = true
  }

  function pointerLeave() {
    hasPointer = false
  }

  // Loop
  let running = false
  let raf = 0
  let last = 0
  let frames = 0

  function renderFrame(now) {
    if (drawSource) {
      drawSource(now)
      sourceTexture.needsUpdate = true
    }
    updateLabel(now)

    if (trailA) {
      trailMat.uniforms.uPrev.value = trailA.texture
      trailMat.uniforms.uPointer.value.copy(pointer)
      trailMat.uniforms.uDelta.value.copy(delta)
      quad.material = trailMat
      renderer.setRenderTarget(trailB)
      renderer.render(scene, camera)
      ;[trailA, trailB] = [trailB, trailA]
      delta.set(0, 0)
      cellMat.uniforms.uTrail.value = trailA.texture
    }

    cellMat.uniforms.uSource.value = sourceTexture || blank
    quad.material = cellMat
    renderer.setRenderTarget(cellTarget)
    renderer.render(scene, camera)

    quad.material = asciiMat
    renderer.setRenderTarget(null)
    renderer.clear()
    renderer.render(scene, camera)

    frames++
    window.__asciiFrames = frames
  }

  function loop(now) {
    if (!running) return
    raf = requestAnimationFrame(loop)
    if (now - last < 1000 / o.fps - 2) return
    last = now
    renderFrame(now)
  }

  function start() {
    if (running) return
    running = true
    last = 0
    raf = requestAnimationFrame(loop)
  }

  function stop() {
    running = false
    cancelAnimationFrame(raf)
  }

  function replaceSource(texture, size, draw = null, label = null) {
    const previous = sourceTexture
    sourceTexture = texture
    sourceSize.set(size.width, size.height)
    drawSource = draw
    labelSource = label
    updateZoom()
    if (previous) previous.dispose()
    if (!running) renderFrame(performance.now())
  }

  function setCanvasSource(source) {
    const texture = new CanvasTexture(source.canvas)
    texture.minFilter = LinearFilter
    texture.generateMipmaps = false
    source.draw(performance.now())
    replaceSource(texture, source.canvas, source.draw, source.label || null)
  }

  function setVideo(video) {
    const texture = new VideoTexture(video)
    texture.minFilter = LinearFilter
    texture.generateMipmaps = false
    // VideoTexture solo sube cuadros nuevos mientras el video corre. Con el video quieto
    // (movimiento reducido) hay que subir el primero a mano o el hero queda en negro.
    texture.needsUpdate = true
    replaceSource(texture, { width: video.videoWidth, height: video.videoHeight })
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  resize()

  function dispose() {
    stop()
    resizeObserver.disconnect()
    sourceTexture?.dispose()
    atlas.texture.dispose()
    neon.dispose()
    blank.dispose()
    trailA?.dispose()
    trailB?.dispose()
    cellTarget.dispose()
    trailMat.dispose()
    cellMat.dispose()
    asciiMat.dispose()
    quad.geometry.dispose()
    renderer.dispose()
  }

  return {
    start,
    stop,
    renderOnce: () => renderFrame(performance.now()),
    setCanvasSource,
    setVideo,
    pointerMove,
    pointerLeave,
    dispose,
  }
}
