<script setup>
import { t } from './i18n/index.js'
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <a class="skip" href="#main">{{ t.a11y.skip }}</a>
  <SiteHeader />
  <main id="main">
    <HeroSection />
    <ServicesSection />
    <ProjectsSection />
    <ContactSection />
  </main>
  <SiteFooter />
</template>
