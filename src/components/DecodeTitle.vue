<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Título que aparece "descifrándose": cada letra pasa por símbolos de código antes de quedarse.
const props = defineProps({
  text: { type: String, required: true },
  delay: { type: Number, default: 250 },
})

const SCRAMBLE = '{}<>/;=+*#[]()_'
const chars = ref(
  [...props.text].map((c) => ({ final: c, shown: c, settled: c === ' ' })),
)
let timer = 0

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Sin animación: el título aparece completo de una vez.
    chars.value.forEach((c) => {
      c.settled = true
      c.shown = c.final
    })
    return
  }
  chars.value.forEach((c) => {
    if (c.final !== ' ') c.settled = false
  })
  const start = performance.now() + props.delay
  timer = setInterval(() => {
    const elapsed = performance.now() - start
    let pending = 0
    chars.value.forEach((c, i) => {
      if (c.settled) return
      if (elapsed > 380 + i * 85) {
        c.settled = true
        c.shown = c.final
      } else {
        pending++
        c.shown = elapsed < 0 ? '' : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
      }
    })
    if (!pending) clearInterval(timer)
  }, 45)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <span class="decode" :aria-label="text">
    <span
      v-for="(c, i) in chars"
      :key="i"
      class="decode__char"
      :class="{ 'is-space': c.final === ' ' }"
      aria-hidden="true"
    >
      <span class="decode__final" :style="{ opacity: c.settled ? 1 : 0 }">{{ c.final }}</span>
      <span v-if="!c.settled" class="decode__scramble">{{ c.shown }}</span>
    </span>
  </span>
</template>

<style scoped>
.decode {
  display: inline-flex;
  white-space: nowrap;
}
.decode__char {
  position: relative;
  display: inline-block;
}
.decode__char.is-space {
  width: 0.18em;
}
.decode__scramble {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--font-osd);
  font-size: 0.62em;
  font-weight: 400;
  color: var(--rec);
}
</style>
