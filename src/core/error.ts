import Monitor from './index'

export function errorEvent(this: Monitor) {
  window.addEventListener(
    'error',
    e => {
      console.log('error ~~   ', e)

      const target: any = e.srcElement || e.target

      const error_url = target?.src || target?.href

      this.push({
        type: 'error',
        config: {
          error_url,
          error_message: e.message
        }
      })
    },
    true
  )
}

export function promiseReject(this: Monitor) {
  window.addEventListener('unhandledrejection', event => {
    console.log('event~ ', event)

    event.promise.catch(error => {
      this.push({
        type: 'reject',
        config: {
          message: error
        }
      })
    })
  })
}
