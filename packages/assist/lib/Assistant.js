// @ts-check

import { data } from './data.js'
import * as file from './file.js'

const hashMap = new WeakMap

export class Assets extends Map {
	constructor() {
		super()

		this.hashnames = new Map
	}
	/** @this {import('./Assistant').Assets} @arg {string | URL} path @return {Asset} */
	add(path) {
		const pathname = file.getPath(path)

		if (super.has(pathname)) return super.get(pathname)

		const asset = new Asset(pathname)

		super.set(pathname, asset)

		this.hashnames.set(asset.hashname, asset)

		return asset
	}

	/** @this {import('./Assistant').Assets} @arg {string | URL} path @return {Asset | null} */
	get(path) {
		const pathname = file.getPath(path)

		if (super.has(pathname)) return super.get(pathname)

		return null
	}

	/** @this {import('./Assistant').Assets} @arg {string | URL} path @return {string | null} */
	getFromServer(path) {
		const pathname = file.getPath(path)

		return this.hashnames.get(pathname).pathname
	}
}

export class Assistant {
	assets = new Assets

	/** @this {import('./Assistant').Assistant} @arg {{ base: string, root: string, build: { outDir: string, assetsDir: string } }} config */
	importConfig(config) {
		this.baseDir = config.base.replace(/^\/|\/$/g, '')
		this.rootURL = new URL(file.getPath(config.root) + '/', 'file:')
		this.distDir = config.build.outDir
		this.assetsDir = config.build.assetsDir
		this.pagesDir = 'src/pages'
		this.hostname = Object(Object(config).server).host || 'localhost'
	}

	/** @this {import('./Assistant').Assistant} @arg {string | URL} path */
	add(path) {
		const asset = this.assets.add(path)
		const emitted = [ this.baseDir ? '/' + this.baseDir : '', this.assetsDir, asset.hashname ].join('/')

		return emitted
	}

	/** @this {import('./Assistant').Assistant} @arg {string | URL} path */
	get(path) {
		const asset = this.assets.get(path)
		const emitted = [ this.baseDir ? '/' + this.baseDir : '', this.assetsDir, asset.hashname ].join('/')

		return emitted
	}
}

export class Asset {
	/** @this {import('./Assistant').Asset} @arg {string} pathname */
	constructor(pathname) {
		this.pathname = pathname
		this.filename = this.pathname.split('/').at(-1)
		this.extension = this.filename.replace(/^[^.]+\.?/, '')
		this.basename = this.filename.slice(0, -this.extension.length)
		this.hashname = this.basename + file.getHash(this.basename) + '.' + this.extension
		this.filetype = file.getType(this.extension)
	}
}
