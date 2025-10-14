import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import router from './router/index.js'

import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'

import Card from "primevue/card";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Password from "primevue/password";

import Aura from '@primeuix/themes/aura';

const defaultLocale = localStorage.getItem('language') || 'es'

const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: 'en',
    messages: {
        es,
        en
    },
    globalInjection: true,
    allowComposition: true
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false
        }
    }
})

app.use(i18n)
app.use(router)

app.component('pv-card', Card)
app.component('pv-button', Button)
app.component('pv-dropdown', Dropdown)
app.component('pv-input-text', InputText)
app.component('pv-textarea', Textarea)
app.component('pv-data-table', DataTable)
app.component('pv-column', Column)
app.component('pv-tag', Tag)
app.component('pv-password', Password)

app.mount('#app')

export default i18n