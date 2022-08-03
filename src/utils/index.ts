/**
 * 去除对象key为空的情况
 */
type Obj = Record<string, any>
export const delEmptyQueryNodes = (obj: Obj) => {
  Object.keys(obj).forEach((key: keyof Obj) => {
    const value = obj[key]
    value && typeof value === 'object' && delEmptyQueryNodes(value)
    ;(value === '' ||
      value === null ||
      value === undefined ||
      value.length === 0 ||
      Object.keys(value).length === 0) &&
      delete obj[key]
  })
  return obj
}

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
