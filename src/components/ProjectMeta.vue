<script setup>
import { computed } from 'vue'
import { pick, t } from '../i18n/index.js'

// Servicios, tecnologías, año y la acción principal de un proyecto.
const props = defineProps({
  project: { type: Object, required: true },
})

const serviceNames = computed(() =>
  props.project.services
    .map((key) => t.services.items.find((s) => s.key === key)?.name)
    .filter(Boolean)
    .join(', '),
)
</script>

<template>
  <dl class="meta">
    <div>
      <dt>{{ t.projects.services }}</dt>
      <dd>{{ serviceNames }}</dd>
    </div>
    <div>
      <dt>{{ t.projects.stack }}</dt>
      <dd>{{ project.stack.join(', ') }}</dd>
    </div>
    <div>
      <dt>{{ t.projects.year }}</dt>
      <dd>{{ project.year }}</dd>
    </div>
  </dl>
  <p v-if="project.kind === 'app'" class="meta__private">
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M4 7V5a4 4 0 1 1 8 0v2h1v8H3V7h1Zm2 0h4V5a2 2 0 1 0-4 0v2Z" fill="currentColor" />
    </svg>
    {{ t.projects.private }}
  </p>
  <a v-else-if="project.url" class="meta__visit" :href="project.url" target="_blank" rel="noopener">
    {{ t.projects.visit }}
    <span class="visually-hidden">: {{ pick(project.title) }}</span>
  </a>
</template>

<style scoped>
.meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, auto));
  justify-content: start;
  gap: 8px clamp(20px, 3vw, 40px);
  font-size: 0.9375rem;
}
.meta dt {
  color: var(--ink-3);
  font-size: var(--step--1);
}
.meta dd {
  margin: 2px 0 0;
}

.meta__private {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 28px;
  color: var(--ink-2);
  font-size: 0.9375rem;
}

.meta__visit {
  display: inline-block;
  margin-top: 28px;
  padding: 12px 20px;
  border: 1px solid var(--ink);
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.15s, color 0.15s;
}
.meta__visit:hover {
  background: var(--ink);
  color: var(--black);
}

/* En columnas angostas (modal, celular) cada dato va en su propia fila */
@container project-info (max-width: 400px) {
  .meta {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
