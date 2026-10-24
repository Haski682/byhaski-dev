<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { pick, t } from '../i18n/index.js'
import ProjectVisual from './ProjectVisual.vue'
import ProjectMeta from './ProjectMeta.vue'

// Destacados: tarjetas que se quedan fijas y se apilan al hacer scroll.
// La tarjeta que queda debajo se encoge y oscurece un poco.
defineProps({
  projects: { type: Array, required: true },
})
const emit = defineEmits(['open'])

const isDev = import.meta.env.DEV
const list = ref(null)
let raf = 0
let reduced = false

function update() {
  raf = 0
  const els = list.value ? [...list.value.children] : []
  for (let i = 0; i < els.length; i++) {
    const el = els[i]
    const next = els[i + 1]
    let p = 0
    if (next) {
      const top = parseFloat(getComputedStyle(el).top) || 0
      const h = el.offsetHeight
      p = Math.min(1, Math.max(0, (top + h - next.getBoundingClientRect().top) / h))
    }
    el.style.setProperty('--covered', p.toFixed(3))
  }
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(update)
}

onMounted(() => {
  reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  update()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <ol ref="list" class="stack">
    <li
      v-for="(p, i) in projects"
      :key="p.slug"
      class="stack__item"
      :style="{ '--i': i }"
    >
      <article class="stack__card" :aria-labelledby="`featured-${p.slug}`">
        <div class="stack__visual">
          <ProjectVisual :project="p" size="lg" />
        </div>
        <div class="stack__info">
          <p class="stack__client">
            {{ p.client }}
            <span v-if="isDev && p.placeholder" class="stack__example osd">{{ t.projects.example }}</span>
          </p>
          <h3 :id="`featured-${p.slug}`" class="stack__title display">{{ pick(p.title) }}</h3>
          <p class="stack__summary">{{ pick(p.summary) }}</p>
          <ProjectMeta :project="p" />
          <button class="stack__details" type="button" @click="emit('open', p)">
            {{ t.projects.details }}
            <span class="visually-hidden">: {{ pick(p.title) }}</span>
          </button>
        </div>
        <div class="stack__shade" aria-hidden="true" />
      </article>
    </li>
  </ol>
</template>

<style scoped>
.stack__item {
  position: sticky;
  top: calc(var(--header-h) + 8px + var(--i) * 14px);
  margin-bottom: 14vh;
}
.stack__item:last-child {
  margin-bottom: 0;
}

.stack__card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  background: var(--black);
  border: 1px solid var(--line);
  transform-origin: 50% 0;
  transform: scale(calc(1 - var(--covered, 0) * 0.06));
  will-change: transform;
}

/* La imagen va en 16:10, igual que las capturas, para que no se recorte a los lados.
   Si el texto de al lado es más alto, la tarjeta crece y la imagen se estira con ella. */
.stack__visual {
  min-height: 0;
  aspect-ratio: 16 / 10;
  align-self: stretch;
  border-right: 1px solid var(--line);
}

.stack__info {
  container: project-info / inline-size;
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 18px;
  padding: clamp(24px, 3vw, 48px);
  min-height: 0;
  overflow: auto;
}

.stack__client {
  color: var(--ink-3);
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  gap: 10px;
}
.stack__example {
  font-size: 0.6875rem;
  color: var(--rec);
  border: 1px solid currentColor;
  padding: 1px 6px;
}

.stack__title {
  font-size: var(--step-4);
  text-wrap: balance;
}

.stack__summary {
  color: var(--ink-2);
  max-width: 46ch;
  margin-bottom: 8px;
}

.stack__details {
  align-self: start;
  margin-top: 4px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--ink-2);
  font-size: 0.9375rem;
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-thickness: 1px;
  cursor: pointer;
}
.stack__details:hover {
  color: var(--ink);
}

.stack__shade {
  position: absolute;
  inset: 0;
  background: var(--black);
  opacity: calc(var(--covered, 0) * 0.65);
  pointer-events: none;
}

@media (max-width: 900px) {
  .stack {
    display: grid;
    gap: 56px;
  }
  .stack__item {
    position: static;
    height: auto;
    margin: 0;
  }
  .stack__card {
    grid-template-columns: 1fr;
    transform: none;
  }
  .stack__visual {
    aspect-ratio: 16 / 10;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .stack__shade {
    display: none;
  }
}
</style>
