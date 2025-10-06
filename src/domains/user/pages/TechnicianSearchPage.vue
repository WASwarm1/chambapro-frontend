<script setup>

import TecnicoList from '../components/TecnicoList.component.vue'
import ClienteNavbar from '../../../public/components/cliente-navbar.component.vue'

</script>

<template>
  <header>
    <ClienteNavbar/>
  </header>

  <TecnicoList/>
</template>

<style scoped>
header {
  flex: 0 0 auto;
}

</style>