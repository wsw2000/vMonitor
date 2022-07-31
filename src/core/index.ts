/** @format */

import { DefaultConfigOptons, RequestOptions, MonitorConfig } from '../types/core'
import { EventMap } from '../types/event'
import { bindHistoryEvent, pageEventList, mouseEventList } from '../utils/event'
import { ishasSendBeacon } from '../utils/is'
import { on } from '../utils/listener'
import { qsStringify } from '../utils/qsStringify'
import { getParentsByAttrKey, getMonitorPaths } from '../utils/dom'
export default class Monitor {
  public defaultOptons: DefaultConfigOptons
  private version: string | undefined
  public requestOptions: RequestOptions

  public constructor(options: DefaultConfigOptons) {
    this.requestOptions = <RequestOptions>{}

    this.defaultOptons = this.initDef(options)

    this.installMonitor()
  }

  public setToken<T extends DefaultConfigOptons['token']>(token: T) {
    this.defaultOptons.token = token
  }

  //初始化配置参数,请求参数,版本号
  private initDef(options: DefaultConfigOptons): DefaultConfigOptons {
    this.version = MonitorConfig.version

    this.requestOptions = {
      app_id: options.app_id,
      app_name: options.app_name,
      token: options.token,
      ...options?.config, // 自定义参数 如 uuid之类的用户鉴权参数
      ...this.requestOptions
    }

    //添加pushState replaceState event
    window.history['pushState'] = bindHistoryEvent('pushState')
    window.history['replaceState'] = bindHistoryEvent('replaceState')

    return <DefaultConfigOptons>{
      sdkVersion: this.version,
      historyTracker: false,
      hashTracker: false,
      beaconTracker: false,
      domTracker: true,
      debug: false,
      jsErrorTracker: false,
      ...options
    }
  }

  //设置请求的参数选项
  public setRequestOptions(config: RequestOptions) {
    this.setConfig(config)
  }

  //配合公司老api
  public setConfig(config: RequestOptions) {
    this.requestOptions = {
      ...this.requestOptions,
      ...config
    }
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
    if (!this.defaultOptons.debug) {
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
        this.reportTracker({ ...data, type: event })
      })
    })
  }
  // Dom 事件自动上报
  private targetKeyReport<K extends keyof WindowEventMap>(eventList: K[]) {
    eventList.forEach(event => {
      on(window, event, e => {
        const target = e.target as HTMLElement
        this.clickTarget(target)

        // const targetValue = target.getAttribute('m_btn')
        // const matched = getParentsByAttrKey(target, 'm_p')
        // console.log('matched~~ ', matched)
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
      console.log('~~ monitorPaths', monitorPaths)
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
  // 手动push 上报
  public push(data: RequestOptions = this.requestOptions) {
    console.log('手动push 上报 ~~ ~  ', data)
    this.reportTracker(data)
  }

  // 上报
  private reportTracker<T extends RequestOptions>(data: T) {
    const requestUrl = this.defaultOptons.requestUrl || this.defaultOptons.url

    this.pushDebuggerLog(data)

    if (this.defaultOptons.beaconTracker && !!ishasSendBeacon) {
      this.requestByPost(requestUrl!, data)
      return
    }
    this.requestByGet(requestUrl!, data)
  }
  // navigator.sendBeacon 关闭浏览器还能请求
  private requestByPost<T extends RequestOptions>(requestUrl: string, data: T) {
    const params = Object.assign(this.getCurrInfo(), data, { time: new Date().getTime() })

    const headers = {
      type: 'application/x-www-form-urlencoded'
    }
    const blob = new Blob([JSON.stringify(params)], headers)
    navigator.sendBeacon(requestUrl, blob)
  }

  private requestByGet<T extends RequestOptions>(url: string, data: T) {
    const img = document.createElement('img')
    const params = qsStringify({
      ...this.getCurrInfo(),
      ...data,
      actions: JSON.stringify(data.actions)
    })
    console.log('params~~ ', params)

    img.src = `${url}?_t=${+new Date()}&${params}`
    img.style.display = 'none'

    document.body.appendChild(img)
    img.parentNode!.removeChild(img)
  }

  private installMonitor() {
    const { historyTracker, hashTracker, jsErrorTracker, pushPerformance, domTracker } =
      this.defaultOptons

    if (historyTracker) {
      this.captureEvents(['pushState', 'replaceState', 'popstate'])
    }
    if (hashTracker) {
      this.captureEvents(['hashchange'])
    }
    if (domTracker) {
      const { domEventList } = this.defaultOptons
      const eventList = domEventList?.length ? domEventList : mouseEventList
      this.targetKeyReport(eventList)
    }
    if (pushPerformance) {
    }
    if (jsErrorTracker) {
      console.log('开启js错误')
    }
  }
}
