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
    path: '/activity',
    name: 'activity',
    component: require('./pages/Activity.vue')
  },

  {
    path: '/blog',
    name: 'blog',
    component: require('./pages/Blog.vue')
  },

  {
    path: '/store',
    name: 'store',
    component: require('./pages/Store.vue')
  },

  {
    path: '/team',
    name: 'team',
    component: require('./pages/Team.vue')
  }

]
