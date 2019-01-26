const withProps = (Component, props) => {
  return dope => {
    return Component(dope, props)
  }
}

export default withProps
