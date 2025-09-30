<script setup>
import { BarChart, Calendar, LogOut } from 'lucide-vue-next'

const menuItems = [
  { icon: BarChart, text: 'Estadisticas', id: 'stats' },
  { icon: Calendar, text: 'Agenda de Reservas', id: 'agenda' },
  { icon: LogOut, text: 'Cerrar Sesion', id: 'logout' }
];

const handleClick = (id) => {
  console.log(`Clicked: ${id}`);
};
</script>

<template>
  <div class="menu-container">
    <button
        v-for="item in menuItems"
        :key="item.id"
        @click="handleClick(item.id)"
        class="menu-item"
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
}

.menu-item:active {
  transform: scale(0.98);
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
</style>