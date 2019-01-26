class Dope {
  constructor(render, update) {
    this._symbol = Symbol()
    this._state = {}
    this._onMount = null
    this._render = render
    this._update = () => update(this._symbol)
  }

  onMount(cb) {
    this._onMount = cb
  }

  make(element, props = {}) {
    // Check for children and convert to funcs accordingly.
    if (props.children) {
      props.children = props.children.map(child => {
        if (typeof child === 'function') {
          return child
        }
        // This element was instantiated inside a component rather...
        // ...than being returned by it, so cannot be componnet's root.
        child.isComponentRoot = false
        return () => child
      })
    }

    return {
      element,
      props,
      isComponentRoot: true,
      symbol: this._symbol,
      onMount: this._onMount
    }
  }

  // Initial state must be an object.
  set initialState(initialState) {
    // Only set initial state has not yet been set.
    // This is to avoid re-setting on re-renders.
    if (!Object.keys(this._state).length === 0) {
      this._state = initialState
    }
  }

  // New state must be an object.
  set state(newState) {
    this._state = {
      ...this._state,
      ...newState
    }
    this._update()
  }

  get state() {
    return this._state
  }

  router() {
    return {
      route: window.location.pathname,
      push: pathname => {
        window.history.pushState({}, pathname, window.location.origin + pathname)
        this._render()
      },
      redirect: pathname => {
        window.history.replaceState({}, pathname, window.location.origin + pathname)
        this._render()
      }
    }
  }
}

export default Dope
