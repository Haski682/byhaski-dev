<script setup>
import { t } from '../i18n/index.js'
import AsciiHero from './AsciiHero.vue'
import DecodeTitle from './DecodeTitle.vue'
</script>

<template>
  <section class="hero" data-pointer-root>
    <AsciiHero />

    <div class="hero__content">
      <h1 class="hero__lead">
        <span class="hero__caption"
          ><span class="hero__bracket" aria-hidden="true">[ </span>{{ t.hero.lead
          }}<span class="hero__bracket" aria-hidden="true"> ]</span></span
        >
      </h1>

      <div class="hero__bottom">
        <div class="hero__meta">
          <p class="hero__status">
            <span class="hero__dot" aria-hidden="true" />
            {{ t.hero.status }}
          </p>
          <a class="hero__scroll" href="#servicios">
            <span class="visually-hidden">{{ t.hero.scroll }}</span>
            <svg viewBox="0 0 16 40" width="16" height="40" fill="none" aria-hidden="true">
              <path d="M8 1v37M2.5 32.5 8 38l5.5-5.5" stroke="currentColor" stroke-width="1.5" />
            </svg>
          </a>
        </div>
        <p class="hero__title display">
          <DecodeTitle text="BY HASKI" />
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
}

.hero__content {
  position: relative;
  z-index: 1;
  min-height: 100svh;
  display: grid;
  grid-template-rows: 1fr auto;
  padding: calc(var(--header-h) + clamp(24px, 8vh, 96px)) var(--gutter) 0;
  pointer-events: none;
}
.hero__content a {
  pointer-events: auto;
}

.hero__lead {
  align-self: start;
  max-width: 28ch;
  font-size: var(--step-1);
  font-weight: 500;
  line-height: 1.3;
  text-wrap: balance;
}
.hero__bracket {
  color: var(--ink-3);
  font-weight: 300;
}
/* Fondo negro por línea, como un subtítulo: el texto se lee aunque el ángel pase por detrás */
.hero__caption {
  background: var(--black);
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  padding: 0.06em 0.3em;
  margin-left: -0.3em;
}

.hero__bottom {
  display: grid;
  gap: 12px;
}

.hero__meta {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.hero__status {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9375rem;
  font-weight: 500;
}
.hero__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--rec);
  animation: rec 1.6s steps(2, jump-none) infinite;
}
@keyframes rec {
  50% {
    opacity: 0.2;
  }
}

.hero__scroll {
  color: var(--ink);
  padding: 8px;
  margin-right: -8px;
}

/* El nombre ocupa todo el ancho de la pantalla, como una firma al pie del cuadro */
.hero__title {
  font-size: min(28.6vw, 36svh);
  line-height: 0.78;
  margin-inline: -0.04em;
  padding-bottom: clamp(12px, 2vw, 28px);
  font-weight: 900;
  letter-spacing: -0.015em;
  white-space: nowrap;
}

@media (max-width: 720px) {
  .hero__lead {
    font-size: 1.1875rem;
  }
  .hero__status {
    font-size: 0.8125rem;
  }
}
</style>
