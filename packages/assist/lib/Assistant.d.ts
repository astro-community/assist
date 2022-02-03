export class Assistant {
	import(path: URL | string): string
	importConfig(config): void
	add(path: URL | string): string

	assets: Assets
	assetsDir: string
	baseDir: string
	distDir: string
	hostname: string
	pagesDir: string
	port: number
	rootURL: URL
}

export class Assets extends Map<string, Asset> {
	add(path: string | URL): Asset
	get(path: string | URL): Asset | null
	getFromServer(path: string | URL): string | null

	hashnames: Map<string, Asset>
}

export class Asset {
	basename: string
	extension: string
	filename: string
	filetype: string
	hashname: string
	pathname: string
}
