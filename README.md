# Astro Assist

**Astro Assist** is a library of tools to help you develop with Astro.

## Usage

Install **Astro Assist** to your project.

```shell
npm install @astropub/assist
```

Add **Astro Assist** to your Astro configuration.

```js
// astro.config.js
import assist from '@astropub/assist'

/** @type {import('astro').AstroUserConfig} */
const config = {
  vite: {
    plugins: [
      assist()
    ]
  }
}

export default config
```

Enjoy!

## Features

### addAsset

The `addAsset` method lets you add an asset to the project. The asset will be
available in develoment and automatically bundle during build.

**Example**:

```astro
---
// src/pages/kitten.astro
import * as assist from '@astropub/assist'

const kitten = assist.addAsset(Astro.resolve('kitten.jpg'))
---
<img src={kitten} alt="kitten" />
```

**Example in a Component**:

```astro
---
// src/components/Image.astro
import * as assist from '@astropub/assist'

const src = assist.addAsset(Astro.resolve(Astro.props.src))
---
<img {...Astro.props} {src} />
```

### process

The `process` method lets you modify an asset that is added to the project.
The modified asset will be cached to avoid any repetitive expensive processing.

The `process` method provides the asset source as a `Buffer` and the asset
details as an `Object` and returns a new `Buffer`.

**Example**:

```js
// astro.config.js
import assist from '@astropub/assist'

/** @type {import('astro').AstroUserConfig} */
const config = {
  vite: {
    plugins: [
      assist({
        async process(buffer, asset) {
          return await doSomethingWith(buffer)
        }
      })
    ]
  }
}

export default config
```

**Example in a Component**:

```astro
---
import * as assist from '@astropub/assist'

const src = assist.addAsset(Astro.resolve(Astro.props.src), {
  async process(buffer, asset) {
    return await doSomethingWithTheImage(buffer)
  }
})
---
<img {...Astro.props} {src} />
```

## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```raw
/
├── demo/
│   ├── public/
│   └── src/
│       └── pages/
│           └── index.astro
└── packages/
    └── my-plugin/
        ├── index.js
        └── package.json
```

This project uses **workspaces** to develop a single package, `@astropub/assist`.

It also includes a minimal Astro project, `demo`, for developing and demonstrating the plugin.

## Commands

All commands are run from the root of the project, from a terminal:

| Command         | Action                                       |
|:----------------|:---------------------------------------------|
| `npm install`   | Installs dependencies                        |
| `npm run start` | Starts local dev server at `localhost:3000`  |
| `npm run build` | Build your production site to `./dist/`      |
| `npm run serve` | Preview your build locally, before deploying |

Want to learn more?
Read [our documentation][docs-url] or jump into our [Discord server][chat-url].

[chat-url]: https://astro.build/chat
[docs-url]: https://github.com/withastro/astro
[open-img]: https://developer.stackblitz.com/img/open_in_stackblitz.svg
[open-url]: https://stackblitz.com/github/withastro/astro/tree/latest/examples/plugin
