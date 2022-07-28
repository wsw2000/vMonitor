/** @format */

import {DefaultConfigOptons, RequestOptions, MonitorConfig} from '../types/core'

export default class Monitor {
  public defaultOptons: DefaultConfigOptons
  private version: string | undefined
  public requestOptions: RequestOptions

  public constructor(options: DefaultConfigOptons) {
    this.defaultOptons = Object.assign(this.initDef(), options)

    this.requestOptions = <RequestOptions>{}

    this.installMonitor()
  }

  public setToken<T extends DefaultConfigOptons['token']>(token: T) {
    this.defaultOptons.token = token
  }

  //初始化配置参数,请求参数,版本号
  private initDef(): DefaultConfigOptons {
    this.version = MonitorConfig.version

    // this.requestOptions = <RequestOptions>{
    //   app_id: this.defaultOptons.app_id,
    //   app_name: this.defaultOptons.app_name,
    //   token: this.defaultOptons.token,
    //   ...this.requestOptions,
    // }

    return <DefaultConfigOptons>{
      sdkVersion: this.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: true,
      debug: false,
      jsErrorTracker: false
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

  private installMonitor() {
    const {historyTracker, hashTracker, jsErrorTracker, debug, pushPerformance, domTracker} =
      this.defaultOptons

    if (historyTracker) {
      console.log('监听historyTracker')
    }
    if (hashTracker) {
      console.log('监听hashTracker')
    }
    if (domTracker) {
    }
    if (pushPerformance) {
    }
    if (jsErrorTracker) {
      console.log('开启js错误')
    }
    if (debug) {
      console.log('开启debug')
    }
  }
}
