import { Vue, router, store, Raven } from './boot/core'
import App from './components/App.vue'

// window.addEventListener('cloudkitloaded', async () => {
//   try {
//     await store.auth.init()
//   } catch (error) {
//     handleError(error)
//   }
// })

try {
  /* eslint-disable no-new */
  new Vue({
    router,
    el: '#app',
    render: h => h(App),
    data: { store },
    mounted () {
      store.auth.vm = this
    }
  })
} catch (error) {
  handleError(error)
}

function handleError (error) {
  if (error.length) {
    for (var i = 0; i < error.length; i++) {
      Raven.captureException(error[i])
    }
  } else {
    Raven.captureException(error)
  }

  router.replace({ name: 'error' })
}

export { router }
