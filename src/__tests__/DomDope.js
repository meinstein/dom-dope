import DomDope, { withProps } from '..'

/**
 * Helpers
 */
const findDope = (dopeDOm, targetComponent) => {
  let targetDope = null
  Object.getOwnPropertySymbols(dopeDOm._components).forEach(symbol => {
    const { component, dope } = dopeDOm._components[symbol]
    if (targetComponent === component) {
      targetDope = dope
    }
  })
  return targetDope
}

/**
 * Tests
 */
let rootEl = null

beforeEach(() => {
  document.body.innerHTML = `<div id="root"></div>`
  rootEl = document.getElementById('root')
})

test('Can render', () => {
  const Root = dope => dope.make('p', { text: 'Hello world!' })
  const dope = new DomDope(Root, rootEl)
  dope.render()
  expect(rootEl.innerHTML).toEqual(`<p>Hello world!</p>`)
})

test('Can make null', () => {
  // Child one
  const ChildOne = dope => dope.make('p', { id: 'child-one' })
  // Child two
  const ChildTwo = dope => {
    dope.initialState = { loaded: false }
    if (!dope.state.loaded) {
      return dope.make(null)
    }
    return dope.make('p', { id: 'child-two' })
  }
  // Parent
  const Parent = dope => dope.make('div', { children: [ChildOne, ChildTwo] })
  // Root
  const Root = dope => dope.make('div', { children: [Parent] })
  // Give components dope.
  const dope = new DomDope(Root, rootEl)
  // Mount tree.
  dope.render()
  // See correct dom result.
  expect(rootEl.innerHTML).toEqual(`<div><div><p id="child-one"></p></div></div>`)
  // Find ChildTwo's dope instance
  const childTwoDope = findDope(dope, ChildTwo)
  // Flip ChildTwo's state
  childTwoDope.state.loaded = true
  // Update child two.
  childTwoDope._update()
  // See correct dom result.
  expect(rootEl.innerHTML).toEqual(`<div><div><p id="child-one"></p><p id="child-two"></p></div></div>`)
})

test('Can pass props', () => {
  // Child
  const Child = (dope, props) => {
    return dope.make('p', { text: props.msg })
  }
  // Root
  const Root = dope => {
    const ChildWithProps = withProps(Child, { msg: 'More dope.' })
    return dope.make('div', { children: [ChildWithProps] })
  }
  // Render
  new DomDope(Root, rootEl).render()
  // Expect
  expect(rootEl.innerHTML).toEqual(`<div><p>More dope.</p></div>`)
})

test('Can fetch data on mount', () => {
  const Component = dope => {
    dope.initialState = { data: null }
    dope.onMount(() => {
      dope.state.data = 'Hello world!'
    })
    return dope.make('pre', {
      text: dope.state.data
    })
  }
  const dope = new DomDope(Component, rootEl)
  dope.render()
  // Find Components dope instance
  const componentDope = findDope(dope, Component)
  // Update component.
  componentDope._update()
  expect(rootEl.innerHTML).toEqual(`<pre>Hello world!</pre>`)
})
