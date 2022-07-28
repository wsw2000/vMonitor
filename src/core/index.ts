/** @format */

import {ConfigOptons, RequestOptions, MonitorConfig} from '../types/core'

export default class Monitor {
  public configOptons: ConfigOptons
  private version: string | undefined
  public requestOptions: RequestOptions

  public constructor(options: ConfigOptons) {
    this.configOptons = Object.assign(this.initDef(), options)

    this.requestOptions = <RequestOptions>{}
  }
  private initDef(): ConfigOptons {
    this.version = MonitorConfig.version

    this.requestOptions = <RequestOptions>{
      app_id: this.configOptons.app_id,
      app_name: this.configOptons.app_name,
      token: this.configOptons.token,
      ...this.requestOptions,
    }

    return <ConfigOptons>{
      sdkVersion: this.version,
      historyTracker: false,
      hashTracker: false,
      domTracker: true,
      debug: false,
      jsErrorTracker: false,
    }
  }
  public setConfig(config: RequestOptions) {
    this.requestOptions = {
      ...this.requestOptions,
      ...config,
    }
  }
}
