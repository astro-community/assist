// @ts-check

import { Duplex, escape, getFileName, getFileExtension, getFileType, getHash, getReady, mkdir, pathToFileURL, withTrailingSlash, writeFile } from './utils.js'

/** @type {import('.').Assist} */
export class Assist {
	/** @arg {import('.').AssistOptions} options */
	constructor(options) {
		this.assets = new Map
		this.ready = getReady()

		// @ts-ignore
		this.options = {}

		this.config(options)
	}

	/** @arg {string} pathname @arg {import('.').AssetOptions} options */
	addAsset(pathname, options = /** @type {Object.<unknown, import('.').AssetOptions>} */ (null)) {
		if (!this.ready.resolved) throw Error('Not ready.')

		options = Object.assign({}, options)
		options.headers = Object.assign({}, this.options.headers, options.headers)

		pathname = (
			pathname == null
				? 'file.bin'
			: 'pathname' in Object(pathname)
				? Object(pathname).pathname
			: String(pathname).replace(/^\//, this.options.rootDir)
		)

		const asset = new Asset(pathname, options)

		this.assets.set(asset.href, asset)

		return asset
	}

	/** @arg {import('.').AssistOptions} options */
	config(options) {
		options = Object.assign({}, /** @type {typeof import('.').Assist} */ (this.constructor).defaultOptions, options)

		options.cacheDir = withTrailingSlash(options.cacheDir)
		options.devDir = withTrailingSlash(options.devDir)
		options.headers = Object.assign({}, options.headers)

		Object.assign(this.options, options)
	}

	static defaultOptions = {
		cacheDir: 'node_modules/.cache/',
		devDir: '/@assets/',
		headers: {
			'Cache-Control': 'max-age=360000',
		},
		/** @arg {Buffer} buffer */
		process(buffer) {
			return buffer
		}
	}
}

/** @type {import('.').Asset} */
export class Asset {
	/** @arg {string} pathname @arg {import('.').AssetOptions} options */
	constructor(pathname, options) {
		options = Object.assign({}, assist.options, options)
		options.headers = Object.assign({}, options.headers)

		this.options = options
		this.name = getFileName(pathname)
		this.path = new URL(pathname, 'file:').pathname
		this.ext = options.extension || getFileExtension(pathname)
		this.hash = getHash(this.path) + '.' + this.ext
		this.type = getFileType(this.path)

		if (!options.headers['Content-Type']) options.headers['Content-Type'] = this.type

		this.cache = options.cacheDir + this.hash
		this.href = options.devDir + this.hash
	}

	/** @return {Promise<Buffer>} */
	toBuffer() {
		return fetch(this.cache).then(
			response => response.arrayBuffer().then(Buffer.from)
		).catch(
			() => fetch(this.path).then(
				response => response.arrayBuffer().then(Buffer.from).then(
					buffer => Promise.resolve(this.options.process(
						buffer, this
					)).then(
						buffer => writeFile(this.cache, buffer).then(
							() => buffer
						)
					)
				)
			)
		)
	}

	/** @arg {import('http').ServerResponse} response */
	pipe(response) {
		const stream = new Duplex()

		for (const [name, data] of Object.entries(this.options.headers)) {
			response.setHeader(name, String(data))
		}

		return this.toBuffer().then(
			buffer => {
				stream.push(buffer)
				stream.push(null)
				stream.pipe(response)
			}
		)
	}

	toString() {
		return this.href
	}
}

const name = '@astropub/assist'

/** @type {typeof import('.').assistPlugin} */
export const assistPlugin = (options) => {
	assist.config(Object(options))

	return {
		name: '@astropub/assist',
		configResolved(resolvedConfig) {
			const rootURL = pathToFileURL(String(resolvedConfig.inlineConfig.root))
			rootURL.pathname = withTrailingSlash(rootURL.pathname)

			const cacheURL = new URL(assist.options.cacheDir, rootURL)
			cacheURL.pathname = withTrailingSlash(cacheURL.pathname)

			assist.options.rootDir = rootURL.pathname
			assist.options.cacheDir = cacheURL.pathname
	
			mkdir(assist.options.cacheDir, { recursive: true }).then(
				() => assist.ready.resolve(undefined)
			)
		},
		configureServer(server) {
			server.middlewares.use((request, response, next) => {
				const url = String(request.url)

				if (!url.startsWith(assist.options.devDir)) return next()

				const asset = assist.assets.get(url)

				if (!asset) return next()

				return asset.pipe(response)
			})
		},
		async generateBundle(_options, bundle) {
			/** @type {import('.').BundledAssets} */
			const bundledAssets = []
	
			for (const [href, asset] of assist.assets) {
				bundledAssets.push(
					asset.toBuffer().then(
						buffer => [asset, buffer, escape(href)]
					)
				)
			}
	
			for (const [ asset, buffer, match ] of await Promise.all(bundledAssets)) {
				const emittedFileName = '/' + this.getFileName(this.emitFile({
					name: asset.name,
					type: 'asset',
					source: buffer,
				}))
	
				for (const [_file, info] of Object.entries(bundle)) {
					if ('source' in info && typeof info.source === 'string') {
						info.source = info.source.replace(match, emittedFileName)
					}
				}
			}
		}
	}
}

/** @type {typeof import('.').addAsset} */
export const addAsset = assistPlugin.addAsset = (path, options) => assist.addAsset(path, options)

/** @type {typeof import('.').assist} */
// @ts-ignore
export const assist = globalThis[Symbol.for(name)] = globalThis[Symbol.for(name)] || new Assist()

export default assistPlugin
