<script setup>
import { SITE } from '../config.js'
import { otherLang, t } from '../i18n/index.js'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer wrap">
    <p class="footer__video">
      {{ t.footer.video }}
      <a :href="SITE.videoSite">{{ t.footer.videoLink }}</a>
    </p>
    <p class="footer__legal">© {{ year }} BY HASKI. {{ t.footer.rights }}</p>
    <a class="footer__lang" :href="otherLang.href" :hreflang="otherLang.code" :lang="otherLang.code">
      {{ otherLang.label }}
    </a>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 12px 32px;
  padding-block: 40px;
  border-top: 1px solid var(--line);
  font-size: 0.9375rem;
  color: var(--ink-2);
}
.footer__video {
  margin-right: auto;
}
.footer a {
  color: var(--ink);
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
}
.footer__legal {
  color: var(--ink-3);
}
</style>
