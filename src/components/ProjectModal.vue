<script setup>
import { nextTick, ref, watch } from 'vue'
import { pick, t } from '../i18n/index.js'
import FlowDiagram from './FlowDiagram.vue'
import ProjectMeta from './ProjectMeta.vue'

// Detalle de un proyecto en un <dialog> nativo: Esc lo cierra y el foco vuelve solo al botón que lo abrió.
const props = defineProps({
  project: { type: Object, default: null },
})
const emit = defineEmits(['close'])

const dialog = ref(null)

watch(
  () => props.project,
  async (p) => {
    if (p) {
      await nextTick()
      if (!dialog.value.open) dialog.value.showModal()
      dialog.value.querySelector('.modal__scroll').scrollTop = 0
      document.documentElement.classList.add('is-locked')
    } else if (dialog.value?.open) {
      dialog.value.close()
    }
  },
)

function onClose() {
  document.documentElement.classList.remove('is-locked')
  emit('close')
}

// Clic fuera del contenido (sobre el fondo) cierra
function onClick(e) {
  if (e.target === dialog.value) dialog.value.close()
}
</script>

<template>
  <dialog
    ref="dialog"
    class="modal"
    :aria-labelledby="project ? 'modal-title' : undefined"
    @close="onClose"
    @click="onClick"
  >
    <div v-if="project" class="modal__inner">
      <div class="modal__scroll">
        <div class="modal__media">
          <template v-if="project.images?.length">
            <img
              v-for="(src, i) in project.images"
              :key="src"
              :src="src"
              :alt="t.projects.screenshot(project.client, i + 1)"
              width="1600"
              height="1000"
              loading="lazy"
            />
          </template>
          <div v-else-if="project.flow?.length" class="modal__flow">
            <FlowDiagram :steps="project.flow" size="lg" :caption="t.projects.flowCaption" />
          </div>
        </div>

        <div class="modal__info">
          <p class="modal__client">{{ project.client }}</p>
          <h3 id="modal-title" class="modal__title display">{{ pick(project.title) }}</h3>
          <p class="modal__summary">{{ pick(project.summary) }}</p>
          <ProjectMeta :project="project" />
        </div>
      </div>

      <button class="modal__close" type="button" @click="dialog.close()">
        <span class="visually-hidden">{{ t.a11y.close }}</span>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="1.6" />
        </svg>
      </button>
    </div>
  </dialog>
</template>

<style scoped>
.modal {
  width: min(1240px, calc(100vw - 2 * var(--gutter)));
  height: min(88svh, 900px);
  max-width: none;
  max-height: none;
  padding: 0;
  border: 1px solid var(--line);
  background: var(--black);
  color: var(--ink);
}
.modal::backdrop {
  background: rgb(0 0 0 / 0.82);
  backdrop-filter: blur(6px);
}
.modal[open] {
  animation: modal-in 0.28s var(--ease-out);
}
@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}

.modal__inner {
  position: relative;
  height: 100%;
}

.modal__scroll {
  height: 100%;
  overflow: auto;
  display: grid;
  grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
  overscroll-behavior: contain;
}

.modal__media {
  display: grid;
  gap: 1px;
  background: var(--line);
  align-content: start;
}
.modal__media img {
  width: 100%;
  height: auto;
  background: var(--surface);
}
.modal__flow {
  min-height: 100%;
  aspect-ratio: 4 / 3;
}

.modal__info {
  container: project-info / inline-size;
  position: sticky;
  top: 0;
  align-self: start;
  display: grid;
  gap: 18px;
  padding: clamp(28px, 3vw, 48px);
  padding-top: 72px;
}
.modal__client {
  color: var(--ink-3);
  font-size: 0.9375rem;
}
.modal__title {
  font-size: var(--step-4);
  text-wrap: balance;
}
.modal__summary {
  color: var(--ink-2);
  margin-bottom: 10px;
}

.modal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  background: var(--black);
  cursor: pointer;
}
.modal__close:hover {
  border-color: var(--ink);
}

@media (max-width: 900px) {
  .modal {
    width: 100vw;
    height: 100svh;
    max-width: 100vw;
    max-height: 100svh;
    border: 0;
  }
  .modal__scroll {
    grid-template-columns: 1fr;
  }
  .modal__info {
    position: static;
    padding-top: 28px;
  }
}
</style>
