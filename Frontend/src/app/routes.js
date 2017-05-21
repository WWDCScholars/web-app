export default [

  {
    path: '/',
    name: 'scholars',
    component: require('./pages/Scholars.vue')
  },

  {
    path: '/scholar/:recordName',
    name: 'profile',
    component: require('./pages/ScholarProfile.vue'),
    meta: { menu: 'scholars' }
  },

  {
    path: '/blog',
    name: 'blog',
    component: null
  },

  {
    path: '/team',
    name: 'team',
    component: null
  }

]
