<script setup>
import { useRouter } from 'vue-router'

/**
 * TechnicianCardComponent Component
 * Displays information about a technician including image, date, time, description, client, category, and a button to see more details.
 * Props:
 * - technician: Object containing details about the technician (date, time, description, client, category, infoUrl, image)
 */

const props = defineProps({
  technician: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const router = useRouter()

const goToProfile = () => {
  router.push(`/client/profile/${props.technician.id}`)
}
</script>


<template>
  <article class="techinician_card">
    <div class="techinician_image">
      <img :src="technician.image" alt="technician-image"/>
    </div>
    <div class="techinician_info">
      <header>
        <h3 class="techinician_name">{{ technician.name }} {{ technician.lastname }}</h3> <br>
        <h3 class="techinician_speciality">Especialista en {{ technician.speciality }}</h3>
      </header>

      <p class="techinician_description">{{ technician.description }}</p>

      <button class="profile_button" @click="goToProfile">Ver Perfil</button>
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
  margin-bottom: 1rem;
}
.profile_button {
  background-color: #1b9a92;
  color: black;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s;
}
.profile_button:hover {
  background-color: #17817d;
}
</style>