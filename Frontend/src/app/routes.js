export default [

  {
    path: '/',
    name: 'winners',
    component: require('./pages/Winners.vue')
  },

  {
    path: '/scholar/:recordName',
    name: 'profile',
    component: require('./pages/ScholarProfile.vue')
  }

]
