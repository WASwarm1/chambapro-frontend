<script setup>

import TechnicianListComponent from '../components/technician-list.component.vue'
import ClienteNavbar from '../../../public/components/cliente-navbar.component.vue'

</script>

<template>
  <header>
    <ClienteNavbar/>
  </header>

  <TechnicianListComponent/>
</template>

<style scoped>
header {
  flex: 0 0 auto;
}

</style>