# **DomDope**

A dope JavaScript library for creating user interfaces.

## **Introduction**

DomDope supplies every component in your tree with a bit of dope so that you can more easily build user interfaces.

## **Getting Started**

```html
<script type="module">
  // No need for bundlers!
  import DomDope from 'https://unpkg.com/domdope/src/index.js'
  // The Root component
  const RootComponent = dope => dope.make('div')
  // The root element where everything gets mounted.
  const rootElement = document.getElementById('root')
  // Instantiate DomDope with above roots.
  const dope = new DomDope(RootComponent, rootElement)
  // Render to give your component tree a bit of dope.
  dope.render()
</script>
```

## **Interface**

```js
// Use dope to make component.
const Component = dope => {
  return dope.make('p', {
    text: 'This is dope!'
  })
}
```

```js
// Use dope to fetch data.
const Component = dope => {
  dope.initialState = { data: null }

  dope.onMount(async () => {
    const response = await fetch('../data/is/dope')
    const data = await response.json()
    dope.state = { data }
  })

  if (!dope.state.data) {
    return dope.make(null)
  }

  return dope.make('pre', {
    text: JSON.stringfy(dope.state.data)
  })
}
```

```js
// Use withProps to inject props into components.
import { withProps } from 'https://unpkg.com/domdope/src/index.js'

const NavContent = (dope, props) => {
  return dope.make('div', { text: props.msg })
}

const Nav = dope => {
  const ContentWithProps = withProps(Content, { msg: '😎' })

  return dope.make('nav', {
    children: [Nav]
  })
}
```

```js
// Use withRouter to inject routing-related props into components.
import { withRouter } from 'https://unpkg.com/domdope/src/index.js'

// Use dope as a router.
const Component = (dope, props) => {
  if (props.router.pathname !== '/') {
    props.router.redirectTo('/')
  }

  return dope.make('a', {
    text: 'Link to nowhere.',
    onClick: () => props.router.goTo('/nowhere')
  })
}

export default withRouter(Component)
```

## **Demo**

Run a simple HTTP server this project's root folder:

```
python -m SimpleHTTPServer 8080
```

And go to `localhost:8080/demo/index.html`

## **Examples**

- https://github.com/meinstein/blog
- https://github.com/meinstein/turn-me-on-lamps
