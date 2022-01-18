import { createApp } from 'vue'

import VueDsfr from '@laruiss/vue-dsfr'

import '@laruiss/vue-dsfr/dist/vue-dsfr-fonts.css'
import '@laruiss/vue-dsfr/dist/vue-dsfr.css'

import App from './App.vue'
import router from './router/index.js'

createApp(App)
  .use(router)
  .use(VueDsfr)
  .mount('#app')
