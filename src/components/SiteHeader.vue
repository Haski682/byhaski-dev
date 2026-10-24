<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { lang, otherLang, t } from '../i18n/index.js'
import cherubUrl from '../assets/cherub.webp'

// Sobre el hero el header es transparente; después del hero toma fondo negro
// para no mezclarse con el texto y las capturas.
const solid = ref(false)
let raf = 0

function update() {
  raf = 0
  solid.value = window.scrollY > window.innerHeight - 80
}
function onScroll() {
  if (!raf) raf = requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <header class="header" :class="{ 'is-solid': solid }">
    <a class="header__brand" :href="lang === 'en' ? '/en/' : '/'" :aria-label="t.a11y.home">
      <img :src="cherubUrl" alt="" width="34" height="38" />
      <span class="header__name">BY HASKI DEV</span>
    </a>
    <nav class="header__nav" :aria-label="lang === 'en' ? 'Main' : 'Principal'">
      <a href="#servicios">{{ t.nav.services }}</a>
      <a href="#proyectos">{{ t.nav.projects }}</a>
      <a href="#contacto">{{ t.nav.contact }}</a>
      <a class="header__lang osd" :href="otherLang.href" :hreflang="otherLang.code" :lang="otherLang.code">
        <span aria-hidden="true">{{ otherLang.short }}</span>
        <span class="visually-hidden">{{ otherLang.label }}</span>
      </a>
    </nav>
  </header>
</template>

<style scoped>
/* "difference" mantiene el header legible sobre el ángel y sobre el título blanco */
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  height: var(--header-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-inline: var(--gutter);
  mix-blend-mode: difference;
  color: #fff;
  border-bottom: 1px solid transparent;
  transition: background-color 0.2s, border-color 0.2s;
}
.header.is-solid {
  mix-blend-mode: normal;
  background: var(--black);
  border-bottom-color: var(--line);
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.header__brand img {
  width: 30px;
  height: auto;
}
.header__name {
  font-stretch: 125%;
  font-weight: 700;
  font-size: var(--step--1);
  letter-spacing: 0.04em;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2.4vw, 32px);
  font-size: 0.9375rem;
  font-weight: 500;
}
.header__nav a {
  text-decoration: none;
  padding-block: 8px;
}
.header__nav a:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-thickness: 1px;
}
.header__lang {
  font-size: 0.875rem;
}

@media (max-width: 520px) {
  .header__name {
    display: none;
  }
  .header__nav {
    font-size: 0.875rem;
  }
}
</style>
