<script setup>
import { computed, ref } from 'vue'
import emailjs from '@emailjs/browser'
import { SITE } from '../config.js'
import { lang, t } from '../i18n/index.js'

const form = ref({ name: '', email: '', company: '', need: '', message: '' })
const state = ref('idle') // idle | sending | sent | error

const isDev = import.meta.env.DEV
const whatsappHref = computed(() => (SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}` : ''))
const emailHref = computed(() => (SITE.email ? `mailto:${SITE.email}` : ''))

async function submit() {
  if (state.value === 'sending') return
  state.value = 'sending'
  const f = form.value
  const needLabel = t.contact.needOptions[f.need] || f.need
  // La plantilla actual de EmailJS usa user_name, user_email y message;
  // el resto de datos va dentro del mensaje para que no se pierda.
  const message = [
    `[dev.byhaski.com · ${lang.toUpperCase()}]`,
    `${t.contact.need} ${needLabel}`,
    f.company ? `${t.contact.company}: ${f.company}` : '',
    '',
    f.message,
  ]
    .filter((line, i) => line !== '' || i === 3)
    .join('\n')

  try {
    await emailjs.send(
      SITE.emailjs.serviceId,
      SITE.emailjs.templateId,
      {
        user_name: f.name,
        user_email: f.email,
        message,
        company: f.company,
        need: needLabel,
        source: 'dev.byhaski.com',
      },
      { publicKey: SITE.emailjs.publicKey },
    )
    state.value = 'sent'
    form.value = { name: '', email: '', company: '', need: '', message: '' }
  } catch (err) {
    console.warn('[contacto] EmailJS falló', err)
    state.value = 'error'
  }
}
</script>

<template>
  <section id="contacto" class="contact wrap" aria-labelledby="contact-heading">
    <div class="contact__intro">
      <h2 id="contact-heading" class="contact__heading display">{{ t.contact.heading }}</h2>
      <p class="contact__lead">{{ t.contact.intro }}</p>

      <div class="contact__direct">
        <p class="contact__direct-label">{{ t.contact.direct }}</p>
        <ul>
          <li v-if="whatsappHref || isDev">
            <a v-if="whatsappHref" :href="whatsappHref" target="_blank" rel="noopener">{{ t.contact.whatsapp }}</a>
            <span v-else class="contact__pending osd">{{ t.contact.whatsapp }}: {{ t.contact.pending }}</span>
          </li>
          <li v-if="emailHref || isDev">
            <a v-if="emailHref" :href="emailHref">{{ SITE.email }}</a>
            <span v-else class="contact__pending osd">{{ t.contact.emailLabel }}: {{ t.contact.pending }}</span>
          </li>
        </ul>
      </div>
    </div>

    <form class="form" @submit.prevent="submit">
      <div class="form__row">
        <label class="field">
          <span class="field__label">{{ t.contact.name }}</span>
          <input v-model.trim="form.name" name="user_name" type="text" autocomplete="name" required />
        </label>
        <label class="field">
          <span class="field__label">{{ t.contact.email }}</span>
          <input v-model.trim="form.email" name="user_email" type="email" autocomplete="email" required />
        </label>
      </div>
      <div class="form__row">
        <label class="field">
          <span class="field__label">
            {{ t.contact.company }} <span class="field__optional">({{ t.contact.optional }})</span>
          </span>
          <input v-model.trim="form.company" name="company" type="text" autocomplete="organization" />
        </label>
        <label class="field">
          <span class="field__label">{{ t.contact.need }}</span>
          <select v-model="form.need" name="need" required>
            <option value="" disabled />
            <option v-for="(label, key) in t.contact.needOptions" :key="key" :value="key">{{ label }}</option>
          </select>
        </label>
      </div>
      <label class="field">
        <span class="field__label">{{ t.contact.message }}</span>
        <textarea
          v-model.trim="form.message"
          name="message"
          rows="5"
          required
          :placeholder="t.contact.messageHint"
        />
      </label>

      <div class="form__actions">
        <button class="form__submit" type="submit" :disabled="state === 'sending'">
          {{ state === 'sending' ? t.contact.sending : t.contact.send }}
        </button>
        <p class="form__status" :class="`is-${state}`" role="status">
          <template v-if="state === 'sent'">{{ t.contact.sent }}</template>
          <template v-else-if="state === 'error'">{{ t.contact.error }}</template>
        </p>
      </div>
    </form>
  </section>
</template>

<style scoped>
.contact {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(40px, 6vw, 96px);
  padding-block: clamp(96px, 14vh, 160px);
  border-top: 1px solid var(--line);
}

.contact__heading {
  font-size: var(--step-5);
  text-wrap: balance;
}
.contact__lead {
  margin-top: 20px;
  color: var(--ink-2);
  max-width: 40ch;
}

.contact__direct {
  margin-top: 48px;
}
.contact__direct-label {
  color: var(--ink-3);
  font-size: 0.9375rem;
  margin-bottom: 10px;
}
.contact__direct ul {
  display: grid;
  gap: 6px;
  font-size: var(--step-1);
}
.contact__direct a {
  text-decoration: underline;
  text-underline-offset: 6px;
  text-decoration-thickness: 1px;
}
.contact__pending {
  font-size: 0.8125rem;
  color: var(--rec);
}

.form {
  display: grid;
  gap: 28px;
  align-content: start;
}
.form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}

.field {
  display: grid;
  gap: 8px;
}
.field__label {
  font-size: 0.9375rem;
  color: var(--ink-2);
}
.field__optional {
  color: var(--ink-3);
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 10px 0;
  border: 0;
  border-bottom: 1px solid var(--ink-3);
  border-radius: 0;
  background: transparent;
  font-size: var(--step-0);
  transition: border-color 0.15s;
}
.field select {
  appearance: none;
  background: transparent
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23b8b8b8' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")
    no-repeat right 4px center;
  padding-right: 24px;
}
.field select option {
  background: var(--black);
}
.field textarea {
  resize: vertical;
  min-height: 140px;
  line-height: 1.5;
}
.field textarea::placeholder {
  color: var(--ink-3);
}
.field input:focus-visible,
.field select:focus-visible,
.field textarea:focus-visible {
  outline: none;
  border-bottom-color: var(--ink);
  box-shadow: 0 1px 0 0 var(--ink);
}
.field :user-invalid {
  border-bottom-color: var(--rec);
}

.form__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
}
.form__submit {
  padding: 16px 28px;
  border: 1px solid var(--ink);
  background: var(--ink);
  color: var(--black);
  font-weight: 650;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}
.form__submit:hover {
  background: transparent;
  color: var(--ink);
}
.form__submit:disabled {
  opacity: 0.6;
  cursor: progress;
}
.form__status {
  font-size: 0.9375rem;
  max-width: 44ch;
}
.form__status.is-error {
  color: #f87171;
}

@media (max-width: 900px) {
  .contact {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 560px) {
  .form__row {
    grid-template-columns: 1fr;
  }
}
</style>
