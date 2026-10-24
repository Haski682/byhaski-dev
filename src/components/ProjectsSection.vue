<script setup>
import { computed, ref } from 'vue'
import { t } from '../i18n/index.js'
import { projects } from '../data/projects.js'
import FeaturedStack from './FeaturedStack.vue'
import ProjectGrid from './ProjectGrid.vue'
import ProjectModal from './ProjectModal.vue'

// En producción nunca se muestran los proyectos de ejemplo.
const list = import.meta.env.DEV ? projects : projects.filter((p) => !p.placeholder)
const featured = computed(() => list.filter((p) => p.featured))
const selected = ref(null)
</script>

<template>
  <section id="proyectos" class="projects wrap" aria-labelledby="projects-heading">
    <header class="projects__head">
      <h2 id="projects-heading" class="projects__heading display">{{ t.projects.heading }}</h2>
      <p class="projects__intro">{{ t.projects.intro }}</p>
    </header>

    <FeaturedStack v-if="featured.length" :projects="featured" @open="selected = $event" />
    <ProjectGrid :projects="list" @open="selected = $event" />
    <ProjectModal :project="selected" @close="selected = null" />
  </section>
</template>

<style scoped>
.projects {
  padding-bottom: clamp(96px, 16vh, 180px);
}

.projects__head {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  gap: clamp(24px, 4vw, 64px);
  align-items: end;
  margin-bottom: clamp(40px, 6vw, 72px);
}
.projects__heading {
  font-size: var(--step-5);
}
.projects__intro {
  color: var(--ink-2);
  max-width: 52ch;
}

@media (max-width: 900px) {
  .projects__head {
    grid-template-columns: 1fr;
  }
}
</style>
