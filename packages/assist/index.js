import { data } from './lib/data.js'
import { getPath, isURL } from './lib/file.js'

export { plugin as assistPlugin } from './lib/plugin.js'

export const assistant = data.assistant

export const add = /** @type {{ (path: string | URL): string }} */ (assistant.add.bind(assistant))

export const currentPage = (/** @type {string} */ url = null) => url ? (data.currentPage = getPath(url)) : data.currentPage

export const resolve = (/** @type {Array<string | URL>} */ ...paths) => paths.reduce(
	(/** @type {URL} */ url, path) => isURL(path) && path.hostname === data.assistant.hostname ? new URL('.' + path.pathname, data.assistant.rootURL.href + data.assistant.pagesDir + '/') : new URL(getPath(path), url),
	new URL(data.assistant.pagesDir + '/', data.assistant.rootURL)
).pathname
