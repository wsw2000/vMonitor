const stringifyPrimitive = function (v: string) {
  switch (typeof v) {
    case 'string':
      return v

    case 'boolean':
      return v ? 'true' : 'false'

    case 'number':
      return isFinite(v) ? v : ''

    default:
      return ''
  }
}
/**
 *
 * @param obj
 * @param sep
 * @param eq
 * @param name
 * @returns
 */
export const qsStringify = (obj: any, sep?: string, eq?: string, name?: string) => {
  sep = sep || '&'
  eq = eq || '='
  if (obj === null) {
    obj = undefined
  }

  if (typeof obj === 'object') {
    return Object.keys(obj)
      .map(function (k) {
        const ks = encodeURIComponent(stringifyPrimitive(k)) + eq
        if (Array.isArray(obj[k])) {
          return obj[k]
            .map(function (v: string) {
              return ks + encodeURIComponent(stringifyPrimitive(v))
            })
            .join(sep)
        }
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]))
      })
      .filter(Boolean)
      .join(sep)
  }

  if (!name) return ''
  return (
    encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj))
  )
}
