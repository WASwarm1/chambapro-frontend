<script setup>
import LanguageSwitcher from '../components/language-switcher.component.vue'
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="brand-section">
        <div class="icon-wrapper">
          <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span class="brand-text">ChambaPro</span>
      </div>

      <div class="language-section">
        <LanguageSwitcher />
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #2E2E2E;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100vw;
  left: 0;
  top: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 1rem 2rem;
  box-sizing: border-box;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon {
  width: 32px;
  height: 32px;
  color: #ffffff;
}

.brand-text {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.language-section {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }

  .brand-text {
    font-size: 1.25rem;
  }

  .brand-icon {
    width: 28px;
    height: 28px;
  }
}
</style>