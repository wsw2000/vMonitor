/** @format */

import { DefaultConfigOptons, RequestOptions, MonitorConfig } from '../types/core'
import { EventMap } from '../types/event'
import { bindHistoryEvent, pageEventList } from '../utils/event'
import { ishasSendBeacon } from '../utils/is'
import { on } from '../utils/listener'
import { qsStringify } from '../utils'
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

  // private targetKeyReport() {
  //   let evTimeStamp = 0
  //   window.addEventListener(
  //     'click',
  //     e => {
  //       e = e || window.event

  //       // 50毫秒内不能触发多次
  //       const now = +new Date()
  //       if (now - evTimeStamp < 50) {
  //         return
  //       }
  //       evTimeStamp = now

  //       const targetPushFn = target => {
  //         const parents = getParentsByAttrKey(target, 'm_p')
  //         parents.unshift(target)
  //         const monitorPaths = getMonitorPaths(parents)
  //         const targetText = target.getAttribute('m_btn') || target.innerText
  //         const targetValue = target.getAttribute('m_val') || ''

  //         let path = monitorPaths

  //         // 拼接开始路径
  //         if (this.defaults.startPath) {
  //           if (monitorPaths && monitorPaths.length) {
  //             path = [...this.defaults.startPath, ...monitorPaths]
  //           } else {
  //             path = this.defaults.startPath
  //           }
  //         }

  //         this.push({
  //           type: 'click',
  //           path_name: JSON.stringify(path),
  //           event_name: targetText,
  //           event_value: targetValue,
  //           actions: JSON.stringify([
  //             {
  //               name: targetText
  //             }
  //           ])
  //         })
  //       }
  //       const target = e.srcElement ? e.srcElement : e.target

  //       let mBtnsArr = []
  //       // 根据属性自动发起点击埋点
  //       if (target && target.attributes.getNamedItem && target.attributes.getNamedItem('m_btn')) {
  //         mBtnsArr.push(target)
  //       }
  //       const targetParentsBtns = getParentsByAttrKey(target, 'm_btn')
  //       mBtnsArr = mBtnsArr.concat(targetParentsBtns)
  //       mBtnsArr.forEach(el => {
  //         targetPushFn(el)
  //       })

  //       if (!this.autoPush || mBtnsArr.length) {
  //         return
  //       }

  //       const _actions = this.getStorageAction()
  //       const currHtml = this.getCurrHtml(e)
  //       let actionData = this.getBindingData(e)

  //       if (!currHtml) return

  //       try {
  //         actionData = JSON.parse(actionData)
  //       } catch (err) {
  //         // err
  //       }

  //       _actions.push({
  //         type: e.type,
  //         html: currHtml,
  //         data: actionData,
  //         time: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:sss')
  //       })

  //       this.store
  //         ? this.setStorageAction(_actions)
  //         : this.push({
  //             type: 'click',
  //             actions: JSON.stringify([actionData])
  //           })
  //     },
  //     true
  //   )
  // }

  //上报
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
      // this.targetKeyReport()
    }
    if (pushPerformance) {
    }
    if (jsErrorTracker) {
      console.log('开启js错误')
    }
  }
}
