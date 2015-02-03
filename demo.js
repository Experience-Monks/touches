var drag = require('./')
var css = require('dom-css')

require('domready')(function() {
    //create a simple box element
    var div = document.createElement('div')
    document.body.appendChild(div)
    css(div, {
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
    })
    div.textContent = 'drag me!'
    
    //start listening for drag events on window
    //but use the div as our target element for position
    var dragging = false
    drag(window, { target: div, filtered: true })
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