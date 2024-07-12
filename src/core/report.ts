/** @format */

import { DefaultConfigOptions, RequestOptions, MonitorConfig } from '../types/core'
import { EventMap } from '../types/event'
import { bindHistoryEvent, pageEventList, mouseEventList } from '../utils/event'
import { isHasSendBeacon } from '../utils/is'
import { on } from '../utils/listener'
import { qsStringify, delEmptyQueryNodes } from '../utils'
import { getParentsByAttrKey, getMonitorPaths } from '../utils/dom'
import { performanceMonitor } from './performance'
import { errorEvent, promiseReject } from './error'

export default class Monitor {
  public defaultOptions: DefaultConfigOptions
  private version: string | undefined
  public requestOptions: RequestOptions

  public constructor(options: DefaultConfigOptions) {
    this.requestOptions = <RequestOptions>{}

    this.defaultOptions = this.initDef(options)

    this.installMonitor()
  }

  public setToken<T extends DefaultConfigOptions['token']>(token: T) {
    this.defaultOptions.token = token
  }

  //初始化配置参数,请求参数,版本号
  private initDef(options: DefaultConfigOptions): DefaultConfigOptions {
    this.version = MonitorConfig.version

    this.setRequestOptions(options)

    //添加pushState replaceState event
    window.history['pushState'] = bindHistoryEvent('pushState')
    window.history['replaceState'] = bindHistoryEvent('replaceState')

    return <DefaultConfigOptions>{
      sdkVersion: this.version,
      historyTracker: false,
      hashTracker: false,
      beaconTracker: false,
      pushPerformance: false,
      domTracker: true,
      debug: false,
      jsErrorTracker: true,
      ...options
    }
  }
  public setRequestOptions(options: RequestOptions) {
    this.requestOptions = {
      ...this.requestOptions,
      app_id: options?.app_id,
      app_name: options?.app_name,
      token: options?.token,
      module: options?.module,
      module_name: options?.module_name,
      ...options?.config // 自定义参数 如 uuid之类的用户鉴权参数
    }
  }

  //设置
  public setConfig(config: RequestOptions) {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...config
    }
    this.setRequestOptions(this.defaultOptions)
  }
  public getCurrInfo() {
    return <RequestOptions>{
      ...this.requestOptions,
      ua: navigator.userAgent,
      url: window.location.href,
      domain: document.domain || '',
      title: document.title,
      referrer: document.referrer || ''
    }
  }
  // 打印日志到控制台
  private pushDebuggerLog<T extends RequestOptions>(data: T) {
    if (!this.defaultOptions.debug) {
      return
    }

    console.log(`----------${data.type}------------`)
    if (pageEventList.indexOf(data.type!) !== -1) {
      console.log(data.app_name, ' ', data.module_name)
    } else {
      console.log(
        data.app_name || data.app_name,
        ' ',
        data.module_name || data.module_name,
        ' ',
        data.path_name,
        ' ',
        data.event_name
      )
    }
  }

  //pv自动上报
  private captureEvents<K extends keyof EventMap>(
    eventList: K[],
    data: RequestOptions = this.requestOptions
  ) {
    eventList.forEach(event => {
      on(window, event, () => {
        this.push({ ...data, type: event })
      })
    })
  }
  // Dom 事件自动上报
  private targetKeyReport<K extends keyof WindowEventMap>(eventList: K[]) {
    eventList.forEach(event => {
      on(window, event, e => {
        const target = e.target as HTMLElement
        this.clickTarget(target)
      })
    })
  }

  private clickTarget<T extends HTMLElement>(target: T) {
    const targetPushFn = (target: HTMLElement) => {
      const parents = getParentsByAttrKey(target, 'm_p')
      parents.unshift(target)
      const monitorPaths = getMonitorPaths(parents)
      const targetText = target.getAttribute('m_btn') || target.innerText
      const targetValue = target.getAttribute('m_val') || ''

      this.push({
        type: 'click',
        path_name: JSON.stringify(monitorPaths),
        event_name: targetText,
        event_value: targetValue,
        actions: JSON.stringify([
          {
            name: targetText
          }
        ])
      })
    }
    let mBtnsDomArr = []
    // 根据属性自动发起点击埋点
    if (target?.attributes?.getNamedItem('m_btn')) {
      mBtnsDomArr.push(target)
    }
    const targetParentsBtns = getParentsByAttrKey(target, 'm_btn')
    mBtnsDomArr = [...mBtnsDomArr, ...targetParentsBtns]
    mBtnsDomArr.forEach(e => targetPushFn(e))
  }
  public clickPush(data: RequestOptions = this.requestOptions) {
    this.push({
      type: 'click',
      path: data.path,
      actions: JSON.stringify([
        {
          name: data.name || '',
          value: data.value || ''
        }
      ])
    })
  }

  /**
   * 手动上报数据
   * @param {object} obj
   */
  public push(data: RequestOptions) {
    if (!data.path_name) {
      data.path_name = ''
      if (data.path) {
        if (Array.isArray(data.path)) {
          data.path_name = JSON.stringify(data.path)
        } else {
          data.path_name = data.path
        }
      }
    }

    if (!data.event_name && data.actions) {
      const actions = JSON.parse(data.actions)
      if (actions.length) {
        data.event_name = actions[0].name || ''
        data.event_value = actions[0].value || ''
      }
    }
    this.reportTracker(data)
  }

  // 上报
  private reportTracker<T extends RequestOptions>(data: T) {
    const requestUrl = this.defaultOptions.requestUrl || this.defaultOptions.url
    const params = Object.assign(
      this.getCurrInfo(),
      data,
      {
        time: new Date().getTime()
      },
      { actions: JSON.stringify(data.actions) },
      data?.config
    )
    delete params?.config
    const _params = delEmptyQueryNodes(params)
    this.pushDebuggerLog(_params)

    if (this.defaultOptions.beaconTracker && !!isHasSendBeacon) {
      this.requestByPost(requestUrl!, _params)
      return
    }
    this.requestByGet(requestUrl!, _params)
  }
  // navigator.sendBeacon 关闭浏览器还能请求
  private requestByPost<T extends RequestOptions>(requestUrl: string, data: T) {
    const headers = {
      type: 'application/x-www-form-urlencoded'
    }
    const blob = new Blob([JSON.stringify(data)], headers)
    navigator.sendBeacon(requestUrl, blob)
  }

  private requestByGet<T extends RequestOptions>(url: string, data: T) {
    const img = document.createElement('img')

    img.src = `${url}?_t=${+new Date()}&${qsStringify(data)}`
    img.style.display = 'none'

    document.body.appendChild(img)
    img.parentNode!.removeChild(img)
  }

  private installMonitor() {
    const { historyTracker, hashTracker, jsErrorTracker, pushPerformance, domTracker } =
      this.defaultOptions

    if (historyTracker) {
      this.captureEvents(['pushState', 'replaceState', 'popstate'])
    }
    if (hashTracker) {
      this.captureEvents(['hashchange'])
    }
    if (domTracker) {
      const { domEventList } = this.defaultOptions
      const eventList = domEventList?.length ? domEventList : mouseEventList
      this.targetKeyReport(eventList)
    }
    if (pushPerformance) {
      performanceMonitor.call(this)
    }
    if (jsErrorTracker) {
      errorEvent.call(this)
      promiseReject.call(this)
    }
  }
}
