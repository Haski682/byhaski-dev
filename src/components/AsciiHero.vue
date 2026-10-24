<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SITE } from '../config.js'
import cherubUrl from '../assets/cherub.webp'

const canvas = ref(null)
const mode = ref('webgl') // 'webgl' | 'poster' | 'none'

let hero = null
let io = null
let video = null
let visible = true
let pointerTarget = null

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

function loadVideo(src) {
  return new Promise((resolve) => {
    const v = document.createElement('video')
    v.muted = true
    v.loop = true
    v.playsInline = true
    v.preload = 'auto'
    v.crossOrigin = 'anonymous'
    v.addEventListener('loadeddata', () => resolve(v), { once: true })
    v.addEventListener('error', () => resolve(null), { once: true })
    v.src = src
  })
}

function onPointerMove(e) {
  hero?.pointerMove(e.clientX, e.clientY)
}
function onPointerLeave() {
  hero?.pointerLeave()
}
function onVisibility() {
  if (!hero) return
  if (document.hidden) {
    hero.stop()
    video?.pause()
  } else if (visible) {
    video?.play().catch(() => {})
    hero.start()
  }
}

onMounted(async () => {
  const coarse = matchMedia('(pointer: coarse)').matches

  if (!hasWebGL()) {
    mode.value = SITE.heroPoster ? 'poster' : 'none'
    return
  }

  try {
    await document.fonts.load('48px "VCR"')
    const [{ createAsciiHero }, { createCherubSource }] = await Promise.all([
      import('./ascii/engine.js'),
      import('./ascii/cherubSource.js'),
    ])

    hero = createAsciiHero(canvas.value, {
      interactive: !coarse,
      cell: coarse ? 9 : 12,
      fps: coarse ? 30 : 60,
    })
    hero.setCanvasSource(await createCherubSource(cherubUrl))

    // Si config.js indica un video, reemplaza al querubín del logo.
    if (SITE.heroVideo) loadVideo(SITE.heroVideo).then((v) => {
      if (!v || !hero) return
      video = v
      hero.setVideo(v)
      if (visible && !document.hidden) v.play().catch(() => {})
    })

    // Con "reducir movimiento" (Windows con animaciones apagadas) el querubín igual flota y
    // reacciona al mouse: Haski lo quiere así, y el efecto solo pasa cuando la persona mueve el mouse.
    if (!coarse) {
      // El mouse se escucha en todo el hero (marcado con data-pointer-root), no solo en el canvas.
      pointerTarget = canvas.value.closest('[data-pointer-root]') || canvas.value
      pointerTarget.addEventListener('pointermove', onPointerMove, { passive: true })
      pointerTarget.addEventListener('pointerleave', onPointerLeave)
    }

    io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !document.hidden) {
        video?.play().catch(() => {})
        hero.start()
      } else {
        hero.stop()
        video?.pause()
      }
    })
    io.observe(canvas.value)
    document.addEventListener('visibilitychange', onVisibility)
  } catch (err) {
    console.warn('[hero] WebGL no disponible, se usa la imagen fija.', err)
    hero?.dispose()
    hero = null
    mode.value = 'poster'
  }
})

onBeforeUnmount(() => {
  io?.disconnect()
  document.removeEventListener('visibilitychange', onVisibility)
  pointerTarget?.removeEventListener('pointermove', onPointerMove)
  pointerTarget?.removeEventListener('pointerleave', onPointerLeave)
  video?.pause()
  hero?.dispose()
})
</script>

<template>
  <div class="ascii" aria-hidden="true">
    <canvas v-if="mode === 'webgl'" ref="canvas" class="ascii__canvas" />
    <img
      v-else-if="mode === 'poster'"
      class="ascii__poster"
      :src="SITE.heroPoster"
      alt=""
      @error="mode = 'none'"
    />
  </div>
</template>

<style scoped>
.ascii {
  position: absolute;
  inset: 0;
  background: var(--black);
}
.ascii__canvas,
.ascii__poster {
  display: block;
  width: 100%;
  height: 100%;
}
.ascii__poster {
  object-fit: cover;
  opacity: 0.85;
}
</style>
