import { Assistant } from './Assistant.js'

const $$symbol = Symbol.for('@astropub/assist')

/** @type {{ isBundling: boolean, assistant: import('./Assistant').Assistant, currentPage: string }} */
export const data = global[$$symbol] || (global[$$symbol] = {
	assistant: new Assistant,
	currentPage: '/',
	isBundling: false,
})
