<script setup>
import Header from './public/components/header-content.component.vue'


</script>

<template>
  <div>
    <Header/>

  </div>
  <main>
    <router-view/>
  </main>
</template>

<style scoped>

header {
  flex: 0 0 auto;
}

main {
  padding: 5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

</style>
