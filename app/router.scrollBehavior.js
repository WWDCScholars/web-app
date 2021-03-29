export default function(to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.

  if (savedPosition) {
    return savedPosition
  }

  // switching between different submissions
  if (from.name === 's-id-year' && to.name === 's-id-year') {
    return null
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    this.app.$root.$once('triggerScroll', () => {
      // if the resolved position is falsy or an empty object,
      // will retain current scroll position.

      // keep position when going back to scholars list
      if (from.name === 's-id-year' && to.name === 'index') {
        if (from.params?.id) {
          resolve({ selector: `#${from.params.id}` })
        }

        resolve(null)
      }

      resolve({ x: 0, y: 0 })
    })
  })
}
