class Dope {
  constructor(update, render) {
    this._symbol = Symbol()
    this._state = {}
    this._onMount = null
    this._update = () => update(this._symbol)
    this._render = render
  }

  set initialState(initialState) {
    // This check is to avoid resetting on each new render.
    if (!Object.keys(this._state).length === 0) {
      this._state = initialState
    }
  }

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

  onMount(cb) {
    this._onMount = cb
  }

  make(element, props = {}) {
    if (props.children) {
      props.children = props.children.map(child => {
        if (typeof child === 'function') {
          return child
        }
        // The element was made inside a component rather than being...
        // ...returned by it. Therefore, it cannot component root.
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
}

export default Dope
