<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../stores/auth.store.js';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const loading = computed(() => authStore.loading);
const error = computed(() => authStore.error);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  lastname: '',
  phone: '',
  specialty: '',
  experience: '',
  description: '',
  hourlyRate: ''
});

const specialtyOptions = computed(() => [
  { label: t('auth.selectSpecialty'), value: '' },
  { label: t('search.plumbing'), value: 'Plumbing' },
  { label: t('search.electricity'), value: 'Electrical' },
  { label: t('search.carpentry'), value: 'Carpentry' },
  { label: t('search.painting'), value: 'Painting' }
]);

async function handleSubmit() {
  if (isLogin.value) {
    const result = await authStore.login(formData.value.email, formData.value.password, 'technician');
    if (result.success) {
      router.push('/tech/agenda');
    }
  } else {
    if (formData.value.password !== formData.value.confirmPassword) {
      authStore.error = t('auth.passwordsDoNotMatch');
      return;
    }

    const result = await authStore.register(formData.value, 'technician');
    if (result.success) {
      router.push('/tech/agenda');
    }
  }
}

function toggleMode() {
  isLogin.value = !isLogin.value;
  authStore.error = null;
  formData.value = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    lastname: '',
    phone: '',
    specialty: '',
    experience: '',
    description: '',
    hourlyRate: ''
  };
}
</script>

<template>
  <div class="page-background">
    <main class="auth-container">
      <div class="auth-header">
        <h1>{{ isLogin ? t('auth.technicianLogin') : t('auth.technicianRegister') }}</h1>
        <p class="auth-subtitle">
          {{ isLogin ? t('auth.welcomeBackTechnician') : t('auth.createTechnicianAccount') }}
        </p>
      </div>

      <pv-card class="auth-card">
        <template #content>
          <form @submit.prevent="handleSubmit" class="auth-form">
            <div v-if="!isLogin" class="field-group">
              <div class="field">
                <label for="name" class="input-label">{{ t('auth.name') }}</label>
                <pv-input-text
                    id="name"
                    v-model="formData.name"
                    :placeholder="t('auth.enterName')"
                    required
                    class="input-field"
                />
              </div>
              <div class="field">
                <label for="lastname" class="input-label">{{ t('auth.lastname') }}</label>
                <pv-input-text
                    id="lastname"
                    v-model="formData.lastname"
                    :placeholder="t('auth.enterLastname')"
                    required
                    class="input-field"
                />
              </div>
            </div>

            <div class="field">
              <label for="email" class="input-label">{{ t('auth.email') }}</label>
              <pv-input-text
                  id="email"
                  v-model="formData.email"
                  type="email"
                  :placeholder="t('auth.enterEmail')"
                  required
                  class="input-field"
              />
            </div>

            <div class="field">
              <label for="password" class="input-label">{{ t('auth.password') }}</label>
              <div class="password-container">
                <pv-input-text
                    id="password"
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    :placeholder="t('auth.enterPassword')"
                    required
                    class="input-field password-input"
                />
                <button
                    type="button"
                    class="password-toggle"
                    @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>

            <div v-if="!isLogin" class="field">
              <label for="confirmPassword" class="input-label">{{ t('auth.confirmPassword') }}</label>
              <div class="password-container">
                <pv-input-text
                    id="confirmPassword"
                    v-model="formData.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :placeholder="t('auth.confirmPassword')"
                    required
                    class="input-field password-input"
                />
                <button
                    type="button"
                    class="password-toggle"
                    @click="showConfirmPassword = !showConfirmPassword"
                >
                  <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>

            <div v-if="!isLogin" class="field-group">
              <div class="field">
                <label for="phone" class="input-label">{{ t('auth.phone') }}</label>
                <pv-input-text
                    id="phone"
                    v-model="formData.phone"
                    :placeholder="t('auth.enterPhone')"
                    class="input-field"
                />
              </div>
              <div class="field">
                <label for="specialty" class="input-label">{{ t('auth.specialty') }}</label>
                <pv-dropdown
                    id="specialty"
                    v-model="formData.specialty"
                    :options="specialtyOptions"
                    optionLabel="label"
                    optionValue="value"
                    :placeholder="t('auth.selectSpecialty')"
                    class="input-field"
                />
              </div>
            </div>

            <div v-if="!isLogin" class="field">
              <label for="experience" class="input-label">{{ t('auth.experience') }}</label>
              <pv-input-text
                  id="experience"
                  v-model="formData.experience"
                  :placeholder="t('auth.enterExperience')"
                  class="input-field"
              />
            </div>

            <div v-if="!isLogin" class="field">
              <label for="description" class="input-label">{{ t('auth.description') }}</label>
              <pv-textarea
                  id="description"
                  v-model="formData.description"
                  :placeholder="t('auth.enterDescription')"
                  rows="3"
                  class="input-field"
              />
            </div>

            <div v-if="!isLogin" class="field">
              <label for="hourlyRate" class="input-label">{{ t('auth.hourlyRate') }}</label>
              <pv-input-text
                  id="hourlyRate"
                  v-model="formData.hourlyRate"
                  type="number"
                  :placeholder="t('auth.enterHourlyRate')"
                  required
                  class="input-field"
              />
            </div>

            <div v-if="error" class="error-message">
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ error }}</span>
            </div>

            <pv-button
                type="submit"
                :label="isLogin ? t('auth.login') : t('auth.register')"
                :loading="loading"
                class="auth-button"
            />
          </form>
        </template>
      </pv-card>

      <div class="auth-footer">
        <p class="auth-switch-text">
          {{ isLogin ? t('auth.noAccount') : t('auth.haveAccount') }}
          <a href="#" @click.prevent="toggleMode" class="auth-link">
            {{ isLogin ? t('auth.registerHere') : t('auth.loginHere') }}
          </a>
        </p>

        <div class="user-type-switch">
          <span>{{ t('auth.areYouClient') }}</span>
          <router-link to="/client/auth" class="switch-link">
            {{ t('auth.switchToClient') }}
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-background {
  background-color: #f0f2f5;
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  max-width: 550px;
  width: 100%;
  text-align: center;
}

.auth-header {
  margin-bottom: 2rem;
}

.auth-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
}

.auth-subtitle {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
}

.auth-card {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: left;
  margin-bottom: 1.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.input-label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.input-field {
  width: 100%;
}

.password-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  padding-right: 2.5rem;
}

.password-toggle {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;
}

.password-toggle:hover {
  color: #333;
}

.error-message {
  background-color: #fee;
  color: #dc3545;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.auth-button {
  width: 100%;
  background-color: #16a085;
  border-color: #16a085;
  padding: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
}

.auth-button:hover {
  background-color: #117a65;
  border-color: #117a65;
}

.auth-footer {
  text-align: center;
}

.auth-switch-text {
  margin: 0 0 1rem 0;
  color: #666;
}

.auth-link {
  color: #16a085;
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
}

.user-type-switch {
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-type-switch span {
  color: #666;
  margin-right: 0.5rem;
}

.switch-link {
  color: #16a085;
  text-decoration: none;
  font-weight: 600;
}

.switch-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-container {
    max-width: 100%;
  }

  .field-group {
    grid-template-columns: 1fr;
  }
}
</style>
