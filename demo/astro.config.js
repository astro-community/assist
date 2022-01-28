import { assistPlugin } from '@astropub/assist'

/** @type {import('astro').AstroUserConfig} */
const config = {
	renderers: [],
	vite: {
		plugins: [
			assistPlugin()
		]
	}
}

export default config
