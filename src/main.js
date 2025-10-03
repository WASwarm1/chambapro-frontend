import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Card from 'primevue/card';


import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'

const defaultLocale = localStorage.getItem('language') || 'es'

const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: 'en',
    messages: {
        es,
        en
    }
})

createApp(App)
    .use(PrimeVue, {
    })
    .use(i18n)
    .component('Card', Card)
    .mount('#app')
