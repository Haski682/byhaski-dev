<script setup>
import { pick } from '../i18n/index.js'

// Diagrama de una automatización: los pasos del flujo dibujados como en una terminal.
defineProps({
  steps: { type: Array, required: true },
  size: { type: String, default: 'md' }, // 'sm' | 'md' | 'lg'
  caption: { type: String, default: '' },
})
</script>

<template>
  <figure class="flow" :class="`flow--${size}`">
    <ol class="flow__steps">
      <li v-for="(step, i) in steps" :key="i" class="flow__step">
        <span class="flow__box">{{ pick(step) }}</span>
        <span v-if="i < steps.length - 1" class="flow__arrow" aria-hidden="true">--&gt;</span>
      </li>
    </ol>
    <figcaption v-if="caption" class="flow__caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.flow {
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  gap: 20px;
  padding: 8%;
  background:
    radial-gradient(circle at 1px 1px, #262626 1px, transparent 0) 0 0 / 18px 18px,
    var(--surface);
  font-family: var(--font-osd);
  text-transform: uppercase; /* la VCR solo se lee bien en mayúsculas, como en la pantalla de una cámara */
  color: var(--ink);
}

.flow__steps {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px 0;
}
.flow__step {
  display: flex;
  align-items: center;
}

.flow__box {
  padding: 0.5em 0.8em;
  border: 1px solid var(--ink-2);
  background: var(--black);
  white-space: nowrap;
}
.flow__step:first-child .flow__box {
  border-color: var(--rec);
}

.flow__arrow {
  padding-inline: 0.5em;
  color: var(--ink-3);
}

.flow__caption {
  text-align: center;
  font-size: 0.75rem;
  color: var(--ink-3);
}

.flow--sm {
  font-size: 0.6875rem;
  padding: 6%;
}
.flow--md {
  font-size: 0.875rem;
}
.flow--lg {
  font-size: clamp(0.875rem, 0.6rem + 0.6vw, 1.125rem);
}
</style>
