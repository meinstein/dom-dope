# **DomDope**

A dope JavaScript library for creating user interfaces.

## **Introduction**

DomDope supplies every component in your tree with a bit of dope so that you can more easily build user interfaces.

## **Installing**

```html
<!-- Expose DomDope as UMD -->
<script src="https://unpkg.com/domdope/dist/umd/index.js"></script>
```

```shell
npm i domdope
```

## **Getting Started**

```js
// UMD
const dope = new DomDope(...)
```

```js
// CommonJS
import Dope from 'domdope'
const dope = new Dope(...)
```

```js
// Give your component tree a bit of dope.
const rootElement = document.getElementById('root')
const dope = new DomDope(RootComponent, rootElement)
dope.render()
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
// Use dope to inject props.
const NavContent = (dope, props) => {
  return dope.make('div', { text: props.msg })
}

const Nav = dope => {
  const ContentWithProps = dope.inject(Content, { msg: '😎' })

  return dope.make('nav', {
    children: [Nav]
  })
}
```

```js
// Use dope as a router.
const Component = dope => {
  const router = dope.router()

  if (router.route !== '/') {
    router.redirect('/')
  }

  return dope.make('a', {
    text: 'Link to nowhere.',
    onClick: () => router.push('/nowhere')
  })
}
```

## **EXAMPLES**

- https://github.com/meinstein/domdope/blob/master/demo/index.html
- https://github.com/meinstein/blog
