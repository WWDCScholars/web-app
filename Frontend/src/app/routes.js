export default [

  {
    path: '/',
    name: 'scholars',
    component: require('./pages/Scholars.vue')
  },

  {
    path: '/scholar/:recordName',
    name: 'profile',
    component: require('./pages/ScholarProfile.vue')
  }

]
