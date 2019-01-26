const getRouter = onRouteChange => {
  window.onpopstate = () => onRouteChange()
  return {
    location: {
      pathname: window.location.pathname,
      push: pathname => {
        window.history.pushState({}, pathname, window.location.origin + pathname)
        onRouteChange()
      },
      redirect: pathname => {
        window.history.replaceState({}, pathname, window.location.origin + pathname)
        onRouteChange()
      }
    }
  }
}

const withRouter = Component => {
  return (dope, prevProps) => {
    return Component(dope, { ...prevProps, ...getRouter(dope._render) })
  }
}

export default withRouter
