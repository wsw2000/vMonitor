import { isObject, isArray } from './is'
export const qsStringify = (data: any, flag?: boolean | string) => {
  let str = '',
    originData,
    encodeData
  for (const i in data) {
    if (data.hasOwnProperty(i)) {
      originData = data[i]
      if (isObject(originData) || isArray(originData)) {
        str += qsStringify(originData, i)
      } else {
        encodeData = encodeURIComponent(originData)
        if (isObject(data) && flag) {
          str += `${flag}[${i}]=${encodeData}&`
        } else if (isArray(data) && flag) {
          str += `${flag}[${i}]=${encodeData}&`
          // str += `${flag}=${encodeData}&`
        } else {
          if (str.length > 0 && str[str.length - 1] !== '&') str += '&'
          str += `${i}=${encodeData}&`
        }
      }
    }
  }
  return str[str.length - 1] === '&' ? str.slice(0, -1) : str
}
