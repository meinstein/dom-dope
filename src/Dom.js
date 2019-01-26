import Dope from './Dope.js'

class DomDope {
  constructor(rootComponent, rootNode) {
    this._components = {}
    this._rootComponent = rootComponent
    this._rootNode = rootNode
    // These methods are passed to new instances of Dope.
    // Must bind here in order to have correct this ref.
    this._update = this._update.bind(this)
    this._render = this._render.bind(this)
  }

  get _symbols() {
    return Object.getOwnPropertySymbols(this._components)
  }

  get _dope() {
    // Pass render and upate hooks to dope.
    return new Dope(this._update, this._render)
  }

  _findOrCreateDope(component) {
    let dope = null

    this._symbols.some(symbol => {
      if (this._components[symbol].component === component) {
        dope = this._components[symbol].dope
        return true
      }
    })

    return dope ? dope : this._dope
  }

  _createElement({ component, parentSymbol, dope }) {
    // A component is a function that gets a dope instance as its first arg.
    const node = component(dope)
    // Place el var into scope.
    let el = null
    // Continue element creation logic if an element present. Could be null.
    if (node.element) {
      el = document.createElement(node.element)

      if (node.props) {
        const { style, text, children, onClick, ...rest } = node.props

        if (style) {
          const properties = Object.keys(style)
          properties.forEach(property => (el.style[property] = style[property]))
        }

        if (text) {
          const textNode = document.createTextNode(text)
          el.appendChild(textNode)
        }

        if (children) {
          children.forEach(child => {
            //
            const childDope = this._findOrCreateDope(child)
            // Create element from each child.
            const childNode = this._createElement({ component: child, parentSymbol: node.symbol, dope: childDope })
            // Make sure a valid DOM node was generated. Could be null.
            if (childNode) {
              el.appendChild(childNode)
            }
          })
        }

        if (onClick) {
          el.addEventListener('click', onClick)
        }

        if (rest) {
          const attributes = Object.keys(rest)
          attributes.forEach(attribute => (el[attribute] = rest[attribute]))
        }
      }
    }

    // Add the root node from each component to the map.
    if (node.isComponentRoot) {
      // Do not reset onMount if symbol has been seen before.
      const hasSymbol = this._components[node.symbol]
      this._components[node.symbol] = {
        dope,
        element: el,
        component,
        parentSymbol,
        withRouter: node._withRouter,
        onMount: hasSymbol ? null : node.onMount
      }
    }

    return el
  }

  _invokeOnMount() {
    this._symbols.forEach(symbol => {
      const { onMount } = this._components[symbol]
      if (onMount) {
        onMount()
      }
    })
  }

  _update(symbol) {
    const { element: oldChild, component, parentSymbol } = this._components[symbol]
    // If the symbol is associated with dom node that was already previously rendered
    if (oldChild) {
      const newChild = this._createElement({ component, parentSymbol, dope: this._components[symbol].dope })
      const { parentNode } = oldChild
      parentNode.replaceChild(newChild, oldChild)
    } else if (parentSymbol) {
      // Otherwise, find parent in the nodeMap and re-render it.
      this._update(parentSymbol)
    } else {
      // The root component has no parentSymbol, so re-render entire tree.
      this._render()
    }
    // Handle any onMounts.
    this._invokeOnMount()
  }

  _render() {
    const newChild = this._createElement({ component: this._rootComponent, dope: this._dope })
    // Clear any previous html before re-appending root child.
    this._rootNode.innerHTML = ''
    this._rootNode.appendChild(newChild)
    this._invokeOnMount()
  }

  render() {
    this._render()
  }
}

export default DomDope
