import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import router from './router';
import { createStore } from '@/store';
import './registerServiceWorker';
import vuetify from './plugins/vuetify';

Vue.use(Vuex);

Vue.config.productionTip = false;
const store = createStore();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
