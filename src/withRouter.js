class Router {
  constructor(render) {
    this._render = render
    window.onpopstate = render
  }

  get pathname() {
    return window.location.pathname
  }

  goTo(pathname) {
    window.history.pushState({}, pathname, window.location.origin + pathname)
    this._render()
  }

  redirectTo(pathname) {
    window.history.replaceState({}, pathname, window.location.origin + pathname)
    this._render()
  }
}

const withRouter = Component => {
  return (dope, props) => {
    // Instantiate a router and add give logical namespace.
    const router = {
      router: new Router(dope._render)
    }
    // Mix router in with any other component props.
    return Component(dope, { ...props, ...router })
  }
}

export default withRouter
