import { data } from './data.js'
import { createReadStream, promises as fs } from 'node:fs'

/** @type {typeof import('./plugin').plugin} */
export const plugin = () => {
	return {
		name: '@astropub/assist',
		enforce: 'pre',
		configResolved(config) {
			data.assistant.importConfig(config)
			data.isBundling = false
		},
		configureServer(server) {
			server.middlewares.use((request, response, next) => {
				const url = String(request.url)
				const baseDir = data.assistant.baseDir ? '/' + data.assistant.baseDir + '/' : '/'
				const assetsDir = baseDir + data.assistant.assetsDir + '/'

				if (url.startsWith(assetsDir)) {
					const assetFile = data.assistant.assets.getFromServer(url.slice(assetsDir.length))

					createReadStream(assetFile).pipe(response)
				} else {
					next()
				}
			})
		},
		writeBundle() {
			data.isBundling = true
		},
		async buildEnd() {
			for (const [path, asset] of data.assistant.assets) {
				const assetSourceURL = new URL(path, data.assistant.rootURL)
				const assetResultDir = new URL((data.assistant.baseDir ? data.assistant.baseDir + '/' : '') + data.assistant.distDir + '/' + data.assistant.assetsDir + '/', data.assistant.rootURL)
				const assetResultURL = new URL((data.assistant.baseDir ? data.assistant.baseDir + '/' : '') + data.assistant.distDir + '/' + [ data.assistant.assetsDir, asset.hashname ].join('/'), data.assistant.rootURL)

				await fs.mkdir(assetResultDir, { recursive: true })
				await fs.copyFile(assetSourceURL, assetResultURL)
			}
		},
	}
}
