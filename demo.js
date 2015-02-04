var touches = require('./')
var css = require('dom-css')
var xtend = require('xtend')

require('domready')(function() {
    var body = document.body

    //create a simple box element
    var div = create()
    div.textContent = 'drag me!'
    body.appendChild(div)

    var child = create({ left: 250, background: 'red' })
    body.appendChild(child)

    //start listening for drag events on window
    //but use the div as our target element for position
    var dragging = false
    touches(window, { target: div, filtered: true })
        .on('start', function(ev, pos) {
            ev.preventDefault()
            dragging = within(pos, div)
            if (dragging)
                write("start", pos)
        })
        .on('end', function(ev, pos) {
            if (dragging)
                write('end', pos)
            dragging = false
        })
        .on('move', function(ev, pos) {
            if (dragging)
                write('move', pos)
        })

    function write(msg, pos) {
        div.textContent = [msg, pos.map(Math.round).join(', ')].join(' ')
    }
})

function within(pos, element) {
    var rect = element.getBoundingClientRect()
    return pos[0] >= 0
        && pos[1] >= 0
        && pos[0] < rect.width
        && pos[1] < rect.height
}

function create(opt) {
    var div = document.createElement('div')
    css(div, xtend({
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'gray',
        width: 200,
        height: 200,
        color: 'white',
        fontSize: '30px',
        lineHeight: '200px',
        textAlign: 'center'
    }, opt))
    return div
}