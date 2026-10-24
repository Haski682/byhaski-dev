<script setup>
import { computed } from 'vue'
import { t } from '../i18n/index.js'
import FlowDiagram from './FlowDiagram.vue'

// Portada de un proyecto: la primera captura, o el diagrama si es una automatización sin pantalla.
const props = defineProps({
  project: { type: Object, required: true },
  size: { type: String, default: 'md' },
  eager: { type: Boolean, default: false },
})

const cover = computed(() => props.project.images?.[0])
</script>

<template>
  <div class="visual">
    <img
      v-if="cover"
      :src="cover"
      :alt="t.projects.screenshot(project.client, 1)"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      width="1600"
      height="1000"
    />
    <FlowDiagram
      v-else-if="project.flow?.length"
      :steps="project.flow"
      :size="size"
      :caption="size === 'sm' ? '' : t.projects.flowCaption"
    />
  </div>
</template>

<style scoped>
.visual {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--surface);
}
.visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}
</style>
