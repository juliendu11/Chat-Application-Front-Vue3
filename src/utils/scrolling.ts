/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable prefer-rest-params */

function throttle (callback: Function, delay: number) {
  let last: number
  let timer: number
  return function () {
    const context = self
    const now = +new Date()
    const args = arguments
    if (last && now < last + delay) {
      // le délai n'est pas écoulé on reset le timer
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        callback.apply(context, args)
      }, delay)
    } else {
      last = now
      callback.apply(context, args)
    }
  }
}

export {
  throttle
}
