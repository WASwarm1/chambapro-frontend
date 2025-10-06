<script setup>
/**
 * TecnicoCard Component
 * Displays information about a technician including image, date, time, description, client, category, and a button to see more details.
 * Props:
 * - tecnico: Object containing details about the technician (date, time, description, client, category, infoUrl, image)
 */

const props = defineProps({
  tecnico: {
    type: Object,
    required: true,
    default: () => ({})
  }
})
</script>


<template>
  <article class="techinician_card">
    <div class="techinician_image">
      <img :src="tecnico.image"/>
    </div>
    <div class="techinician_info">
      <header>
        <h3 class="techinician_name">{{ tecnico.name }} {{ tecnico.lastname }}</h3> <br>
        <h3 class="techinician_speciality">Especialista en {{ tecnico.speciality }}</h3>
      </header>

      <p class="techinician_description">{{ tecnico.description }}</p>
    </div>
  </article>
</template>


<style scoped>
.techinician_card {
  display: flex;
  max-width: 850px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.techinician_name {
  margin: 0 0 0.50rem 0;
  text-align: left;
}
.techinician_speciality {
  margin: 0 0 0.50rem 0;
  color: #444;
  text-align: left;
}
.techinician_description {
  color: #333;
  text-align: justify;
  font-size: 1.0rem;
}
</style>