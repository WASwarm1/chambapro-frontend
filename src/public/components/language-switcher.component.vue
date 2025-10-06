<script setup>
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

function toggleLanguage() {
  const newLocale = locale.value === 'en' ? 'es' : 'en'
  locale.value = newLocale
  localStorage.setItem('language', newLocale)
}
</script>

<template>
  <div class="language-switcher">
    <button
        @click="toggleLanguage"
        class="lang-button"
    >
      {{ t('language.code') }}
    </button>
  </div>
</template>

<style scoped>

</style>