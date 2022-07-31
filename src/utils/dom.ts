/**
 * 通过attrKey查找父级元素
 * @param {htmlElement} elem
 * @param {string} attrKey
 * @returns
 */
export function getParentsByAttrKey(elem: HTMLElement, attrKey: string): Array<HTMLElement> {
  const matched = []

  while ((elem = elem['parentNode'] as HTMLElement) && elem.nodeType !== 9) {
    if (elem.nodeType === 1 && elem.getAttribute(attrKey)) {
      matched.push(elem)
    }
  }
  return matched
}

/**
 * 获取Monitor路径
 * @param {htmlElement Array} elements
 */
export function getMonitorPaths(elements: Array<HTMLElement> = []) {
  const res: any[] = []
  elements.forEach(el => {
    const str = el.getAttribute('m_p') || ''
    const splitStrs = str.split('|')
    res.push(...splitStrs.reverse())
  })

  return res
    .filter(str => {
      return !!str
    })
    .reverse()
}
