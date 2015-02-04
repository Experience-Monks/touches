# touches

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

[(click for demo)](http://jam3.github.io/touches/) - [(source)](demo.js)

Normalizes touch and mouse events to provide a simpler interface. Simplest case:

```js
//get down / move / up events for mouse and touch on window
require('touches')()
  .on('start', mouseDown)
  .on('move', mouseMove)
  .on('end', mouseEnd)

function mouseDown(ev) {
    ev.preventDefault()
}

...
```

A common pattern for drag events is to listen for events on a parent element (like the `window`), and use a different element as the `target` for client offset calculation. The second argument to the event listener is a `[x, y]` vector representing the calculated client offset (relative to top left of target element).

```js
var touch = require('touches')
touch(window, { target: button })
  .on('move', function (ev, position) {
      console.log('relative pos', position[0], position[1])
  })
```

Another common pattern, especially with drag events, is filtering touch input to a single finger. Below; the events will only get fired for the first finger placed on the screen. Subsequent fingers will be ignored until after the first finger has been lifted. 

```js
touch(window, { target: button, filtered: true })
  .on('start', dragStart)
  .on('move', dragMove)
  .on('end', dragEnd)
```

## Usage

[![NPM](https://nodei.co/npm/touches.png)](https://www.npmjs.com/package/touches)

#### `emitter = require('touches')([element, opt])`

Creates a new drag emitter by attaching listeners to `element`, which defaults to `window`. 

The `opt` options can be:

- `target` the element to use when calculating the `position` parameter passed to event listeners. The clientX/clientY of the event will be relative to this target
- `filtered` whether the touch events should be filtered to the first placed finger
- `type` can be a string, either `"mouse"` or `"touch"` if listening to only one or the other event is desired. If any other value, will listen for both mouse and touch.


If the events are not filtered, the `position` for an event will be the first changed touch associated with the `target`. 

#### `emitter.disable()`

Disables the events associated with this emitter by removing them from the DOM element. 

#### `emitter.enable()`

Enables the events associated with this emitter by adding them to the DOM element. The emitter is enabled by default.

#### `emitter.target`

The current target for position offset calculation.

#### `emitter.on('start', listener)`
#### `emitter.on('move', listener)`
#### `emitter.on('end', listener)`

The mousedown/touchstart, mousemove/touchmove, and mouseup/touchend events, respectively. Listeners are called with two parameters: `(ev, position)` where `ev` is the event and `position` is an `[x, y]` array of the client offset, relative to the target's top left.

## demo

To run the demo from source, first `git clone` this repo, then:

```sh
cd touches
npm install
npm start
```

And open `localhost:9966` in your browser.

To generate a distribution bundle: 

```sh
npm run build
```

## License

MIT, see [LICENSE.md](http://github.com/Jam3/touches/blob/master/LICENSE.md) for details.
