export class Assist {
	assets: Map<string, Asset>
	loaded: Promise<void>
	options: AssistOptions
	root: string

	constructor(options?: Partial<AssistOptions>)

	addAsset(path: string, options?: Partial<AssetOptions>): Promise<Asset>
	config(options?: Partial<AssistOptions>): void
	configResolved(config: import('vite').ResolvedConfig): Promise<void>
	configureServer(server: import('vite').ViteDevServer): void
	generateBundle(context: import('rollup').PluginContext, bundle: import('rollup').OutputBundle): void | Promise<void>
	load(value: any): void

	ready: Promise<void> & {
		resolve(value: any): void
		resolved: boolean
	}

	static from(target: any): Assist

	static defaultOptions = {
		cacheDir: 'node_modules/.cache/',
		rootDir: '/',
		devDir: '/@assets/',
		headers: {
			'Cache-Control': 'max-age=360000',
		},
	}
}

export interface AssistOptions {
	cacheDir: string
	rootDir: string
	devDir: string
	headers: {
		[key: string]: boolean | number | string
	}
	process(buffer: Buffer, asset?: Asset): Promise<Buffer>
}

export class Asset {
	constructor(pathname: string, options: AssetOptions)

	toBuffer(): Promise<Buffer>
	pipe(response: import('http').ServerResponse): Promise<void>

	cache: string
	ext: string
	hash: string
	href: string
	name: string
	path: string

	options: AssetOptions
}

export interface AssetOptions extends AssistOptions {
	extension: string
}

export interface Headers {
	[key: string]: boolean | number | string
}

export type BundledAsset = [ Asset, Buffer, RegExp ]

export type BundledAssets = Promise<BundledAsset>[]

export interface Ready extends Promise<void> {
	resolve(arg: any): void
	resolved: boolean
}

export const assist: Assist

export const assistPlugin: {
	(options?: Partial<AssistOptions>): import('vite').Plugin

	addAsset: Assist['addAsset']
}

export const addAsset: Assist['addAsset']

export default assistPlugin
