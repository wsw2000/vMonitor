/**
 * 添加history原生并没有支持的pushState和replaceState的事件监听
 * @param type
 * @returns
 */
export const bindHistoryEvent = <T extends keyof History>(type: T): (() => any) => {
  const historyEvent = history[type]
  return function (this: any) {
    // eslint-disable-next-line prefer-rest-params
    const newEvent = historyEvent.apply(this, arguments) //执行history函数
    const e = new Event(type) //声明自定义事件
    ;(e as any).arguments = arguments
    window.dispatchEvent(e) //抛出事件
    return newEvent //返回方法，用于重写history的方法
  }
}

//我司只有dom的click事件上报  可以在config的domEventList字段加上
export const mouseEventList: Array<keyof WindowEventMap> = [
  'click'
  // 'dblclick',
  // 'contextmenu',
  // 'mousedown',
  // 'mouseup',
  // 'mouseenter',
  // 'mouseout',
  // 'mouseover'
]

export const pageEventList: Array<string> = [
  'page',
  'hashchange',
  'popstate',
  'pushState',
  'replaceState',
  'performance'
]
