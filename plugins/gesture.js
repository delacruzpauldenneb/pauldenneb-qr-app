export default ({ app }, inject) => {
  app.directive('swipe', {
    bind(el, binding) {
      let startX = null

      function onTouchStart(e) {
        startX = e.touches ? e.touches[0].clientX : e.clientX
      }

      function onTouchEnd(e) {
        if (startX === null) return

        const endX = e.changedTouches
          ? e.changedTouches[0].clientX
          : e.clientX
        const deltaX = endX - startX

        // threshold of 50px
        if (deltaX > 50 && binding.arg === 'right') {
          binding.value(e)
        } else if (deltaX < -50 && binding.arg === 'left') {
          binding.value(e)
        }

        startX = null
      }

      el.addEventListener('touchstart', onTouchStart)
      el.addEventListener('touchend', onTouchEnd)

      // store cleanup for unbind hook
      el.__swipeCleanup = () => {
        el.removeEventListener('touchstart', onTouchStart)
        el.removeEventListener('touchend', onTouchEnd)
      }
    },

    unbind(el) {
      if (el.__swipeCleanup) {
        el.__swipeCleanup()
        delete el.__swipeCleanup
      }
    }
  })
}