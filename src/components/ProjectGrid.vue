<script setup>
import { computed, ref } from 'vue'
import { pick, t } from '../i18n/index.js'
import ProjectVisual from './ProjectVisual.vue'

const props = defineProps({
  projects: { type: Array, required: true },
})
const emit = defineEmits(['open'])

const isDev = import.meta.env.DEV
const FILTERS = ['all', 'web', 'app', 'automation', 'shop']
const active = ref('all')

// Solo se muestran los filtros que tienen al menos un proyecto.
const filters = computed(() =>
  FILTERS.filter((f) => f === 'all' || props.projects.some((p) => p.services.includes(f))),
)

const visible = computed(() =>
  active.value === 'all'
    ? props.projects
    : props.projects.filter((p) => p.services.includes(active.value)),
)

function status(p) {
  if (p.kind === 'app') return t.projects.private
  if (p.url) return t.projects.live
  return t.services.items.find((s) => s.key === 'automation').name
}
</script>

<template>
  <div class="grid-block">
    <div class="grid-block__bar">
      <h3 id="all-projects" class="grid-block__heading display">{{ t.projects.allHeading }}</h3>
      <div class="filters" role="group" :aria-label="t.projects.filterLabel">
        <button
          v-for="f in filters"
          :key="f"
          type="button"
          class="filters__btn"
          :aria-pressed="active === f"
          @click="active = f"
        >
          {{ t.projects.filters[f] }}
        </button>
      </div>
      <p class="grid-block__count" aria-live="polite">{{ t.projects.count(visible.length) }}</p>
    </div>

    <ul v-if="visible.length" class="cards" aria-labelledby="all-projects">
      <li v-for="p in visible" :key="p.slug" class="card">
        <div class="card__visual">
          <ProjectVisual :project="p" size="sm" />
        </div>
        <p class="card__client">
          {{ p.client }}
          <span v-if="isDev && p.placeholder" class="card__example osd">{{ t.projects.example }}</span>
        </p>
        <h4 class="card__title">
          <button type="button" class="card__open" @click="emit('open', p)">
            {{ pick(p.title) }}
          </button>
        </h4>
        <p class="card__status">{{ status(p) }} <span aria-hidden="true">/</span> {{ p.year }}</p>
      </li>
    </ul>
    <p v-else class="grid-block__empty">{{ t.projects.empty }}</p>
  </div>
</template>

<style scoped>
.grid-block {
  margin-top: clamp(96px, 16vh, 180px);
}

.grid-block__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 16px 32px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 40px;
}
.grid-block__heading {
  font-size: var(--step-4);
  margin-right: auto;
}
.grid-block__count {
  color: var(--ink-3);
  font-size: 0.9375rem;
  min-width: 10ch;
  text-align: right;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.filters__btn {
  padding: 8px 14px;
  border: 1px solid var(--line);
  background: transparent;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s, color 0.15s;
}
.filters__btn:hover {
  border-color: var(--ink-2);
}
.filters__btn[aria-pressed='true'] {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--black);
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 48px 24px;
}

.card {
  position: relative;
  display: grid;
  gap: 6px;
  align-content: start;
}
.card__visual {
  aspect-ratio: 16 / 10;
  margin-bottom: 10px;
  border: 1px solid var(--line);
  transition: border-color 0.2s;
}
.card:hover .card__visual {
  border-color: var(--ink-3);
}

.card__client {
  color: var(--ink-3);
  font-size: 0.875rem;
  display: flex;
  gap: 8px;
  align-items: center;
}
.card__example {
  font-size: 0.625rem;
  color: var(--rec);
  border: 1px solid currentColor;
  padding: 0 5px;
}

.card__title {
  font-size: var(--step-1);
  font-weight: 650;
  line-height: 1.25;
}
/* El botón del título cubre toda la tarjeta */
.card__open {
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
}
.card__open::after {
  content: '';
  position: absolute;
  inset: 0;
}
.card__open:focus-visible {
  outline: none;
}
.card:has(.card__open:focus-visible) {
  outline: 2px solid var(--ink);
  outline-offset: 6px;
}

.card__status {
  color: var(--ink-2);
  font-size: 0.875rem;
}

.grid-block__empty {
  color: var(--ink-2);
  padding-block: 48px;
}
</style>
