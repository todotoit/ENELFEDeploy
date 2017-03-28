/**
 * TimersDebugger
 *
 * @author Edoardo Tenani
 * @copyright Edoardo Tenani
 * @license MIT
 *
 * This library can be used for debugging setTimeout and setInterval timers in
 * a webpage.
 *
 * To use it replace setTimeout, clearTimeout, setInterval and/or clearInterval
 * with the implementation in the TimersDebugger object
 *
 * Ex:
 *    window.setInterval = TimersDebugger.setInterval
 *    window.clearInterval = TimersDebugger.clearInterval
 *
 * Remember to replace both set* and clear* function to make this library work correctly
 * ( if you want to tdebug setTimeout, replace also clearTimeout; the same goes
 * for setInterval )
 *
 * The libray will print on console each set and clear, while loggin them.
 * To display the log, use showTimeoutData or showIntervalData.
 *
 * If you want to take a snapshot of the current situation for later inspection,
 * use snapshotTimeoutData, snapshotIntervalData. You can then inspect
 * TimersDebugger.snapshots.
 */
(function(window, console) {
  'use strict'
  var TimersDebugger = {
    data: {
      timeout: {
        count: 0,
        actives: 0,
        logs: [],
      },
      interval: {
        count: 0,
        actives: 0,
        logs: [],
      },
    },
    snapshots: {
      timeout: [], // { timestamp, count, actives, logs }
      interval: [], // { timestamp, count, actives, logs }
    },
    filters: [
      "sf.functionName != 'StackTrace$$GenerateError'",
      // "sf.fileName != 'http://localhost:3000/browser-sync/browser-sync-client.js?v=2.16.0'",
      // "sf.fileName != 'http://localhost:3000/js/timer-debug.js'",
    ],
    setTimeout: setTimeout.bind(window),
    clearTimeout: clearTimeout.bind(window),
    setInterval: setInterval.bind(window),
    clearInterval: clearInterval.bind(window),
    showTimeoutData: showTimeoutData,
    showIntervalData: showIntervalData,
    snapshotTimeoutData: snapshotTimeoutData,
    snapshotIntervalData: snapshotIntervalData,
  }

  var setTimeoutOriginal = window.setTimeout.bind(window)
  var clearTimeoutOriginal = window.clearTimeout.bind(window)
  var setIntervalOriginal = window.setInterval.bind(window)
  var clearIntervalOriginal = window.clearInterval.bind(window)
  window.TimersDebugger = TimersDebugger

  function setTimeout(fn, timeout) {
    var id = setTimeoutOriginal(fn, timeout)
    _commonLogger('setTimeout', id, fn, TimersDebugger.data.timeout)
    return id
  }

  function clearTimeout(id) {
    clearTimeoutOriginal(id)
    TimersDebugger.data.timeout.actives -= 1
    console.debug("%csetTimeout cleared (id: "+id+")", 'color: #55BE5A')
  }

  function setInterval(fn, timeout) {
  	var id = setIntervalOriginal(fn, timeout)
    _commonLogger('setInterval', id, fn, TimersDebugger.data.interval)
  	return id
  }

  function clearInterval(id) {
    clearIntervalOriginal(id)
    TimersDebugger.data.interval.actives -= 1
    console.debug("%csetInterval cleared (id: "+id+")", 'color: #55BE5A')
  }

  function showTimeoutData() {
    _showOutput(TimersDebugger.data.timeout)
  }

  function showIntervalData() {
    _showOutput(TimersDebugger.data.interval)
  }

  function snapshotTimeoutData() {
    _takeSnapshot(TimersDebugger.data.timeout, TimersDebugger.snapshots.timeout)
  }

  function snapshotIntervalData() {
    _takeSnapshot(TimersDebugger.data.interval, TimersDebugger.snapshots.interval)
  }

  function _showOutput(output) {
    window.open('data:text/html,<style>body { font-family: monospace; }</style>'+JSON.stringify({
      count: output.count,
      actives: output.actives,
      logs: output.logs,
    }, null, 2))
  }

  function _commonLogger(name, id, fn, store) {
    store.count += 1
    store.actives += 1
    console.debug("%c"+name+" created (id: "+id+")", 'color: #2388EF')
    var timestamp = _getTimestamp()
    var fnString = fn.toString()
    StackTrace.get({ filter: _applyFilters })
      .then(function(stack) {
        stack.shift() // remove myself
        stack.shift() // remove myself
        var log = {
          id: id,
          timestamp: timestamp,
          fn: fnString,
          stacktrace: stack
        }
        store.logs.push(log)
      })
      .catch(function(err) { console.error(err) })
  }

  function _takeSnapshot(data, store) {
    var snapshot = Object.assign({}, data)
    snapshot.timestamp = _getTimestamp()
    store.push(snapshot)
  }

  function _getTimestamp() {
    return Math.floor(Date.now() / 1000)
  }

  function _applyFilters(stackFrame) {
    // console.log(stackFrame)
    var sf = Object.assign({}, stackFrame)
    // console.log(TimersDebugger.filters)
    // console.log(eval(TimersDebugger.filters[0]))
    var result = true
    TimersDebugger.filters.forEach(function (filter) {
      result = result && eval(filter)
      console.log(result)
    })
    return result
  }

}(window, window.console))
