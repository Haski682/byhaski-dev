<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { t } from '../i18n/index.js'
import { SITE } from '../config.js'

// El ángel flota en loop solo mientras se ve; fuera de pantalla se pausa.
const angel = ref(null)
let io = null

onMounted(() => {
  const v = angel.value
  if (!v) return
  io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) v.play().catch(() => {})
      else v.pause()
    },
    { rootMargin: '200px 0px' },
  )
  io.observe(v)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <section id="servicios" class="services wrap" aria-labelledby="services-heading">
    <div class="services__aside">
      <h2 id="services-heading" class="services__heading display">{{ t.services.heading }}</h2>
      <video
        ref="angel"
        class="services__angel"
        :src="SITE.servicesVideo"
        :poster="SITE.servicesPoster"
        width="820"
        height="720"
        muted
        loop
        playsinline
        preload="none"
        disablepictureinpicture
        aria-hidden="true"
        tabindex="-1"
      />
    </div>
    <ul class="services__list">
      <li v-for="s in t.services.items" :key="s.key" class="services__item">
        <h3 class="services__name display">{{ s.name }}</h3>
        <p class="services__text">{{ s.text }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.services {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  gap: clamp(24px, 4vw, 64px);
  padding-block: clamp(96px, 16vh, 180px);
}

/* Título y ángel bajan juntos mientras pasan los servicios */
.services__aside {
  align-self: start;
  position: sticky;
  top: calc(var(--header-h) + 24px);
  display: grid;
  gap: clamp(16px, 2vw, 28px);
}

.services__heading {
  font-size: var(--step-5);
}

/* El fondo del video es negro puro, igual que la página: no se nota el borde. */
.services__angel {
  display: block;
  width: 100%;
  height: auto;
  max-height: calc(100vh - var(--header-h) - 200px);
  aspect-ratio: 15 / 16;
  object-fit: contain;
  background: var(--black);
  pointer-events: none;
}

.services__item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px 32px;
  align-items: baseline;
  padding-block: clamp(22px, 3.2vw, 40px);
  border-top: 1px solid var(--line);
}
.services__item:last-child {
  border-bottom: 1px solid var(--line);
}

.services__name {
  font-size: var(--step-4);
  font-weight: 800;
}

.services__text {
  color: var(--ink-2);
  max-width: 44ch;
}

@media (max-width: 900px) {
  .services {
    grid-template-columns: 1fr;
  }
  .services__aside {
    position: static;
  }
  .services__angel {
    max-width: 420px;
    max-height: none;
  }
  .services__item {
    grid-template-columns: 1fr;
  }
}
</style>
