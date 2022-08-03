import Monitor from './index'

export function performanceMonitor(this: Monitor) {
  console.log(this, 'performance')
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded~~ ', performance)

    if (!performance) {
      // 当前浏览器不支持
      console.log('你的浏览器不支持 performance 接口')
      return
    }

    const timing = performance.timing
    const start = timing.navigationStart
    let dnsTime = 0,
      tcpTime = 0,
      firstPaintTime = 0,
      domRenderTime = 0

    dnsTime = timing.domainLookupEnd - timing.domainLookupStart
    tcpTime = timing.connectEnd - timing.connectStart
    console.log('dnsTime~~ ', dnsTime)
    console.log('tcpTime~~ ', tcpTime)

    firstPaintTime = timing.responseStart - start
    domRenderTime = timing.domContentLoadedEventEnd - start

    // dom渲染
    this.push({
      type: 'performance',
      config: {
        performance_time: domRenderTime,
        performance_type: 'page_dom_ready_time'
      }
    })

    // 首屏时间
    this.push({
      type: 'performance',
      config: {
        performance_type: 'page_first_paint_time',
        performance_time: firstPaintTime
      }
    })
  })
}
