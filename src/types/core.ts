/**
 * @format
 * @url 请求的地址
 * @app_id 应用id
 * @app_name 应用名称
 * @token 请求的token
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker dom事件上报
 * @beaconTracker 是否使用navigator.sendBeacon(兼容性) post上报否则使用img get请求
 * @pushPerformance 页面性能上报
 * @jsErrorTracker js 和 promise 报错异常上报
 * @sdkVersionsdk 版本
 * @domEventList  Array<keyof WindowEventMap> ['click', 'dblclick','mousedown'] 默认['click']
 * @config 自定义配置
 */
export interface DefaultConfigOptons {
  requestUrl: string
  url?: string
  app_id?: string | undefined
  app_name?: string | undefined
  module?: string | undefined
  module_name?: string | undefined
  token?: string
  historyTracker?: boolean
  hashTracker?: boolean
  domTracker?: boolean
  beaconTracker?: boolean
  debug?: boolean
  pushPerformance?: boolean
  jsErrorTracker?: boolean
  sdkVersion?: string | number
  domEventList?: Array<keyof WindowEventMap>
  config?: Record<string, any> | undefined
}

/**
 * @module
 * @module_name 模块名称
 * @ua user-agent
 * @url href 当前 URL 地址
 * @domain 域名
 * @title 网页标题
 * @referrer 上一个访问页面 URL 地址
 * @actions 事件
 * @type 类型  例如 page (pv、uv) ，click（点击事件），input (输入框)，statistics (自定义统计)
 * @path_name 页面name
 * @event_name  '点击名称'
 * @event_value '点击按钮的值｜input的值'
 * @config 自定义配置
 */
export interface RequestOptions
  extends Pick<DefaultConfigOptons, 'app_id' | 'app_name' | 'token' | 'module' | 'module_name'> {
  ua?: string
  url?: string
  domain?: string
  title?: string
  referrer?: string
  actions?: string
  type?: string
  path_name?: string
  path?: string
  event_name?: string
  name?: string
  event_value?: string
  value?: string
  config?: Record<string, any> | undefined
}

//版本
export enum MonitorConfig {
  version = '1.0.0'
}
