import { isServerRendering } from './is'
import { EventMap } from '../types/event'

export const NOOP = () => {
  return undefined
}

export const on = (() => {
  if (isServerRendering) {
    return NOOP
  }
  return <K extends keyof EventMap>(
    element: HTMLElement | Window,
    event: K,
    handler: (ev: EventMap[K]) => void,
    options: boolean | AddEventListenerOptions = false
  ) => {
    element.addEventListener(event, handler as EventListenerOrEventListenerObject, options)
  }
})()

export const off = (() => {
  if (isServerRendering) {
    return NOOP
  }
  return <K extends keyof EventMap>(
    element: HTMLElement | Window,
    type: K | string,
    handler: (ev: EventMap[K]) => void,
    options: boolean | EventListenerOptions = false
  ) => {
    element.removeEventListener(type, handler as EventListenerOrEventListenerObject, options)
  }
})()
