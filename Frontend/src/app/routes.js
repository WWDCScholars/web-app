export default [

  {
    path: '/',
    name: 'welcome',
    component: require('./pages/Welcome.vue'),
    meta: { requiresAuth: true }
  },

  {
    path: '/signin',
    name: 'signin',
    component: require('./pages/Signin.vue'),
    meta: { requiresAnonymous: true }
  }

]
