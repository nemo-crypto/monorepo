/**
  * debouncing, executes the function if there was no new event in $wait milliseconds
  * @param func
  * @param wait
  * @param scope
  * @returns {Function}
  */
export function debounce(func, wait, scope) {
  var timer;
  return function () {
    var context = scope || this, args = arguments;
    var later = function () {
      timer = null;
      func.apply(context, args);
    };
    clearTimeout(timer);
    timer = setTimeout(later, wait);
  };
}

/**
 * in case of a "storm of events", this executes once every $threshold
 * @param fn
 * @param threshhold
 * @param scope
 * @returns {Function}
 */

export function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
    deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date(),
      args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
