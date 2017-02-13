var Emitter = require('events/')

var allEvents = [
  'touchstart', 'touchmove', 'touchend', 'touchcancel',
  'mousedown', 'mousemove', 'mouseup'
]

var ROOT = { left: 0, top: 0 }

module.exports = function handler (element, opt) {
  opt = opt || {}
  element = element || window

  var emitter = new Emitter()
  emitter.target = opt.target || element

  var touch = null
  var filtered = opt.filtered

  var events = allEvents

  // only a subset of events
  if (typeof opt.type === 'string') {
    events = allEvents.filter(function (type) {
      return type.indexOf(opt.type) === 0
    })
  }

  // grab the event functions
  var funcs = events.map(function (type) {
    var name = normalize(type)
    var fn = function (ev) {
      var client = ev
      if (/^touch/.test(type)) {
        if (/^touchend$/.test(type) && opt.preventSimulated !== false) {
          ev.preventDefault()
        }
        
        if (filtered) {
          client = getFilteredTouch(ev, type)
        } else {
          client = getTargetTouch(ev.changedTouches, emitter.target)
        }
      }

      if (!client) {
        return
      }

      // get 2D position
      var pos = offset(client, emitter.target)

      // dispatch the normalized event to our emitter
      emitter.emit(name, ev, pos)
    }
    return { type: type, listener: fn }
  })

  emitter.enable = function enable () {
    funcs.forEach(listeners(element, true))

    return emitter
  }

  emitter.disable = function dispose () {
    funcs.forEach(listeners(element, false))

    return emitter
  }

  // initially enabled
  emitter.enable()
  return emitter

  function getFilteredTouch (ev, type) {
    var client

    // clear touch if it was lifted or canceled
    if (touch && /^touch(end|cancel)/.test(type)) {
      // allow end event to trigger on tracked touch
      client = getTouch(ev.changedTouches, touch.identifier || 0)
      if (client) {
        touch = null
      }
    } else if (!touch && /^touchstart/.test(type)) {
      // not yet tracking any touches, pick one from target
      touch = client = getTargetTouch(ev.changedTouches, emitter.target)
    } else if (touch) {
    // get the tracked touch
      client = getTouch(ev.changedTouches, touch.identifier || 0)
    }

    return client
  }
}

// get 2D client position of touch/mouse event
function offset (ev, target) {
  var cx = ev.clientX || 0
  var cy = ev.clientY || 0
  var rect = bounds(target)
  return [ cx - rect.left, cy - rect.top ]
}

// since we are adding events to a parent we can't rely on targetTouches
function getTargetTouch (touches, target) {
  return Array.prototype.slice.call(touches).filter(function (t) {
    return t.target === target
  })[0] || touches[0]
}

function getTouch (touches, id) {
  for (var i = 0; i < touches.length; i++) {
    if (touches[i].identifier === id) {
      return touches[i]
    }
  }
  return null
}

function listeners (e, enabled) {
  return function (data) {
    if (enabled) e.addEventListener(data.type, data.listener, { passive: false })
    else e.removeEventListener(data.type, data.listener, { passive: false })
  }
}

// normalize touchstart/mousedown to "start" etc
function normalize (event) {
  return event.replace(/^(touch|mouse)/, '')
    .replace(/up$/, 'end')
    .replace(/down$/, 'start')
}

function bounds (element) {
  if (element === window ||
      element === document ||
      element === document.body) {
    return ROOT
  } else {
    return element.getBoundingClientRect()
  }
}
