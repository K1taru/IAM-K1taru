const startViewTransition = document.startViewTransition

if (typeof startViewTransition === 'function') {
  document.startViewTransition = function (this: Document, options) {
    const transition = startViewTransition.call(this, options)
    // The bundled React recognizes the older Chromium wording for these skips.
    // React #37669 tracks the newer messages. Keep other transition failures visible.
    const ready = transition.ready.catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'InvalidStateError') {
        const message = error.message.trim()
        if (
          message === 'Transition was aborted because of invalid state. Document hidden' ||
          message === 'Transition was aborted because of invalid state. Viewport size changed'
        ) {
          throw new DOMException('Transition was aborted because of invalid state', error.name)
        }
      }
      throw error
    })
    Object.defineProperty(transition, 'ready', { value: ready })
    return transition
  }
}
