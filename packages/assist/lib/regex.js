/** @type {import('./types').GetString} */
export const escape = (value) => new RegExp(value.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')
