export type MouseEvent =
  | 'click'
  | 'dblclick'
  | 'contextmenu'
  | 'mousedown'
  | 'mouseup'
  | 'mouseenter'
  | 'mouseout'
  | 'mouseover'

export type pageEvent = 'page' | 'hashchange' | 'popstate' | 'pushState' | 'replaceState'

export type EventMap = WindowEventMap & HTMLElementEventMap & History
