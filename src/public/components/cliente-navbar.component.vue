<script setup>
import { Search, Clock, LogOut } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { computed } from "vue";
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../domains/iam/stores/auth.store.js'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const menuItems = computed(() => [
  { icon: Search, text: t('menu.searchTechnicians'), id: 'searchTechnicians', path: '/client/techsearch' },
  { icon: Clock, text: t('menu.serviceHistory'), id: 'serviceHistory', path: '/client/history' },
  { icon: LogOut, text: t('menu.logout'), id: 'logout' }
]);

const handleClick = (item) => {
  console.log(`Clicked: ${item.id}`);

  if (item.id === 'logout') {
    authStore.logout();
    router.push('/client/auth');
  } else if (item.path) {
    router.push(item.path);
  }
};
</script>

<template>
  <div class="menu-container">
    <div class="user-info" v-if="authStore.isAuthenticated">
      <p class="welcome-text">Hola, {{ authStore.user?.name }}</p>
    </div>

    <button
        v-for="item in menuItems"
        :key="item.id"
        @click="handleClick(item)"
        class="menu-item"
        :class="{ 'logout-item': item.id === 'logout' }"
    >
      <component :is="item.icon" class="menu-icon" />
      <span class="menu-text">
        {{ item.text }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.menu-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  min-height: 20vh;
  width: 100vw;
  left: 50%;
  position: relative;
  transform: translateX(-50%);
  background-color: #F5F5F5;
  box-sizing: border-box;
}

.user-info {
  text-align: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #e8f5e8;
  border-radius: 0.5rem;
  border: 1px solid #20B2AA;
}

.welcome-text {
  margin: 0;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  background-color: #20B2AA;
  color: #F5F5F5;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  width: 100%;
}

.menu-item:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.menu-item:active {
  transform: scale(0.98);
}

.menu-item.logout-item {
  background-color: #20B2AA;
}


.menu-icon {
  width: 24px;
  height: 24px;
  color: #000000;
}

.menu-text {
  font-weight: 500;
  font-size: 1.125rem;
  color: #000000;
}

@media (max-width: 768px) {
  .menu-container {
    padding: 1rem;
  }

  .menu-text {
    font-size: 1rem;
  }
}
</style>