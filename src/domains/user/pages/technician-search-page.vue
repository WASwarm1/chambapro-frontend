<script setup>

import TechnicianListComponent from '../components/technician-list.component.vue'
import ClientNavbarComponent from '../../../public/components/client-navbar.component.vue'

</script>

<template>
  <header>
    <ClientNavbarComponent/>
  </header>

  <TechnicianListComponent/>
</template>

<style scoped>
header {
  flex: 0 0 auto;
}

</style>