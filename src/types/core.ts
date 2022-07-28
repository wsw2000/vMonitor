/**
 * @format
 * @url 请求的地址
 * @app_id 应用id
 * @app_name 应用名称
 * @token 请求的token
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker dom事件上报
 * @sdkVersionsdk 版本
 * @pushPerformance 页面性能上报
 * @jsErrorTracker js 和 promise 报错异常上报
 */

export interface ConfigOptons {
  url: string
  app_id?: string | undefined
  app_name?: string | undefined
  token?: string
  historyTracker?: boolean
  hashTracker?: boolean
  domTracker?: boolean
  sdkVersion?: string | number
  debug?: boolean
  pushPerformance?: boolean
  jsErrorTracker?: boolean
  config?: Record<string, any> | undefined
}

/**
 *
 */
export interface RequestOptions {
  app_id?: string | undefined
  app_name?: string | undefined
  module?: string | undefined
  module_name?: string | undefined
  token?: string
  ua: string
  url: string
  domain: string
  title: string
  referrer: string
  actions?: string
  type: string
  path_name: string
  event_name: string
  event_value: string
  config?: Record<string, any> | undefined
}

//版本
export enum MonitorConfig {
  version = '1.0.0',
}
