import Vue from 'vue';
import Router from 'vue-router';
import ExcelViewer from './views/ExcelViewer.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'excelviewer',
      component: ExcelViewer
    }
  ]
});
