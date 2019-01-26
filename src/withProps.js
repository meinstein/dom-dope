// Takes a Component and an object of props to add.
const withProps = (Component, addProps) => {
  // A component is a func that takes an instance of Dope and props.
  return (dope, props) => {
    // Mix existing props with the additional props.
    return Component(dope, { ...props, ...addProps })
  }
}

export default withProps
