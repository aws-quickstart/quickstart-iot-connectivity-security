import Vue from 'vue';
import VueRouter from 'vue-router';
import Register from '../views/Register';
import Devices from '../views/Devices';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Register',
    component: Register
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/devices',
    name: 'Devices',
    component: Devices
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
