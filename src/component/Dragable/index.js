'use strict';

var React = require('react');

var emptyFunction = function(){};
var classNames = require('classnames');

//
// Helpers. See Element definition below this section.
//

function createUIEvent(draggable) {
    console.log(draggable, 'draggable')
    // State changes are often (but not always!) async. We want the latest value.
    var state = draggable._pendingState || draggable.state;
    return {
        node: draggable.node.current,
        position: {
            top: state.clientY,
            left: state.clientX
        }
    };
}

function canDragY(draggable) {
    return draggable.props.axis === 'both' ||
        draggable.props.axis === 'y';
}

function canDragX(draggable) {
    return draggable.props.axis === 'both' ||
        draggable.props.axis === 'x';
}

function isFunction(func) {
    return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
}

// @credits https://gist.github.com/rogozhnikoff/a43cfed27c41e4e68cdc
function findInArray(array, callback) {
    for (var i = 0, length = array.length; i < length; i++) {
        if (callback.apply(callback, [array[i], i, array])) return array[i];
    }
}

function matchesSelector(el, selector) {
    var method = findInArray([
        'matches',
        'webkitMatchesSelector',
        'mozMatchesSelector',
        'msMatchesSelector',
        'oMatchesSelector'
    ], function(method){
        return isFunction(el[method]);
    });

    return el[method].call(el, selector);
}

// @credits: http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
/* Conditional to fix node server side rendering of component */
if (typeof window === 'undefined') {
    // Do Node Stuff
    var isTouchDevice = false;
} else {
    // Do Browser Stuff
    var isTouchDevice = 'ontouchstart' in window || // works on most browsers
        'onmsgesturechange' in window; // works on ie10 on ms surface

}

// look ::handleDragStart
//function isMultiTouch(e) {
//  return e.touches && Array.isArray(e.touches) && e.touches.length > 1
//}

/**
 * simple abstraction for dragging events names
 * */
var dragEventFor = (function () {
    var eventsFor = {
        touch: {
            start: 'touchstart',
            move: 'touchmove',
            end: 'touchend'
        },
        mouse: {
            start: 'mousedown',
            move: 'mousemove',
            end: 'mouseup'
        }
    };
    return eventsFor[isTouchDevice ? 'touch' : 'mouse'];
})();

/**
 * get {clientX, clientY} positions of control
 * */
function getControlPosition(e) {
    var position = (e.touches && e.touches[0]) || e;
    return {
        clientX: position.clientX,
        clientY: position.clientY
    };
}

function addEvent(el, event, handler) {
    if (!el) { return; }
    if (el.attachEvent) {
        el.attachEvent('on' + event, handler);
    } else if (el.addEventListener) {
        el.addEventListener(event, handler, true);
    } else {
        el['on' + event] = handler;
    }
}

function removeEvent(el, event, handler) {
    if (!el) { return; }
    if (el.detachEvent) {
        el.detachEvent('on' + event, handler);
    } else if (el.removeEventListener) {
        el.removeEventListener(event, handler, true);
    } else {
        el['on' + event] = null;
    }
}

function outerHeight(node) {
    // This is deliberately excluding margin for our calculations, since we are using
    // offsetTop which is including margin. See getBoundPosition
    var height = node.clientHeight;
    var computedStyle = window.getComputedStyle(node);
    height += int(computedStyle.borderTopWidth);
    height += int(computedStyle.borderBottomWidth);
    return height;
}

function outerWidth(node) {
    // This is deliberately excluding margin for our calculations, since we are using
    // offsetLeft which is including margin. See getBoundPosition
    var width = node.clientWidth;
    var computedStyle = window.getComputedStyle(node);
    width += int(computedStyle.borderLeftWidth);
    width += int(computedStyle.borderRightWidth);
    return width;
}
function innerHeight(node) {
    var height = node.clientHeight;
    var computedStyle = window.getComputedStyle(node);
    height -= int(computedStyle.paddingTop);
    height -= int(computedStyle.paddingBottom);
    return height;
}

function innerWidth(node) {
    var width = node.clientWidth;
    var computedStyle = window.getComputedStyle(node);
    width -= int(computedStyle.paddingLeft);
    width -= int(computedStyle.paddingRight);
    return width;
}

function isNum(num) {
    return typeof num === 'number' && !isNaN(num);
}

function int(a) {
    return parseInt(a, 10);
}

function getBoundPosition(draggable, clientX, clientY) {
    var bounds = JSON.parse(JSON.stringify(draggable.props.bounds));
    var node = draggable.node.current;
    var parent = node.parentNode;

    if (bounds === 'parent') {
        var nodeStyle = window.getComputedStyle(node);
        var parentStyle = window.getComputedStyle(parent);
        // Compute bounds. This is a pain with padding and offsets but this gets it exactly right.
        bounds = {
            left: -node.offsetLeft + int(parentStyle.paddingLeft) +
                int(nodeStyle.borderLeftWidth) + int(nodeStyle.marginLeft),
            top: -node.offsetTop + int(parentStyle.paddingTop) +
                int(nodeStyle.borderTopWidth) + int(nodeStyle.marginTop),
            right: innerWidth(parent) - outerWidth(node) - node.offsetLeft,
            bottom: innerHeight(parent) - outerHeight(node) - node.offsetTop
        };
    }

    // Keep x and y below right and bottom limits...
    if (isNum(bounds.right)) clientX = Math.min(clientX, bounds.right);
    if (isNum(bounds.bottom)) clientY = Math.min(clientY, bounds.bottom);

    // But above left and top limits.
    if (isNum(bounds.left)) clientX = Math.max(clientX, bounds.left);
    if (isNum(bounds.top)) clientY = Math.max(clientY, bounds.top);

    return [clientX, clientY];
}

function snapToGrid(grid, pendingX, pendingY) {
    var x = Math.round(pendingX / grid[0]) * grid[0];
    var y = Math.round(pendingY / grid[1]) * grid[1];
    return [x, y];
}

// Useful for preventing blue highlights all over everything when dragging.
var userSelectStyle = ';user-select: none;-webkit-user-select:none;-moz-user-select:none;' +
    '-o-user-select:none;-ms-user-select:none;';

function addUserSelectStyles(draggable) {
    if (!draggable.props.enableUserSelectHack) return;
    var style = document.body.getAttribute('style') || '';
    document.body.setAttribute('style', style + userSelectStyle);
}

function removeUserSelectStyles(draggable) {
    if (!draggable.props.enableUserSelectHack) return;
    var style = document.body.getAttribute('style') || '';
    document.body.setAttribute('style', style.replace(userSelectStyle, ''));
}

function createCSSTransform(style) {
    if (!style.x && !style.y) return {};
    // Replace unitless items with px
    var x = style.x + 'px';
    var y = style.y + 'px';
    return {
        transform: 'translate(' + x + ',' + y + ')',
        WebkitTransform: 'translate(' + x + ',' + y + ')',
        OTransform: 'translate(' + x + ',' + y + ')',
        msTransform: 'translate(' + x + ',' + y + ')',
        MozTransform: 'translate(' + x + ',' + y + ')'
    };
}
export default class Draggable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Whether or not we are currently dragging.
            dragging: false,

            // Offset between start top/left and mouse top/left while dragging.
            offsetX: 0,
            offsetY: 0,

            // Current transform x and y.
            clientX: 0,
            clientY: 0
        };
        this.node = React.createRef()
    }
    static defaultProps = {
        axis: 'both',
        bounds: false,
        handle: null,
        cancel: null,
        grid: null,
        zIndex: NaN,
        enableUserSelectHack: true,
        onStart: emptyFunction,
        onDrag: emptyFunction,
        onStop: emptyFunction,
        onMouseDown: emptyFunction
    }
    componentWillUnmount() {
        // Remove any leftover event handlers
        removeEvent(window, dragEventFor['move'], this.handleDrag);
        removeEvent(window, dragEventFor['end'], this.handleDragEnd);
        removeUserSelectStyles(this);
    }

    handleDragStart = (e) => {
        this.props.onMouseDown(e);

        // Short circuit if handle or cancel prop was provided and selector doesn't match
        if ((this.props.handle && !matchesSelector(e.target, this.props.handle)) ||
            (this.props.cancel && matchesSelector(e.target, this.props.cancel))) {
            return;
        }

        // Call event handler. If it returns explicit false, cancel.
        var shouldStart = this.props.onStart(e, createUIEvent(this));
        if (shouldStart === false) return;

        var dragPoint = getControlPosition(e);
        addUserSelectStyles(this);

        // Initiate dragging. Set the current x and y as offsets
        // so we know how much we've moved during the drag. This allows us
        // to drag elements around even if they have been moved, without issue.
        this.setState({
            dragging: true,
            offsetX: dragPoint.clientX - this.state.clientX,
            offsetY: dragPoint.clientY - this.state.clientY
        });


        // Add event handlers
        addEvent(window, dragEventFor['move'], this.handleDrag);
        addEvent(window, dragEventFor['end'], this.handleDragEnd);
    }

    handleDragEnd = (e) => {
        // Short circuit if not currently dragging
        if (!this.state.dragging) {
            return;
        }

        removeUserSelectStyles(this);

        // Turn off dragging
        this.setState({
            dragging: false
        });

        // Call event handler
        this.props.onStop(e, createUIEvent(this));

        // Remove event handlers
        removeEvent(window, dragEventFor['move'], this.handleDrag);
        removeEvent(window, dragEventFor['end'], this.handleDragEnd);
    }

    handleDrag = (e) => {
        var dragPoint = getControlPosition(e);

        // Calculate X and Y
        var clientX = dragPoint.clientX - this.state.offsetX;
        var clientY = dragPoint.clientY - this.state.offsetY;

        // Snap to grid if prop has been provided
        if (Array.isArray(this.props.grid)) {
            var coords = snapToGrid(this.props.grid, clientX, clientY);
            clientX = coords[0], clientY = coords[1];
        }

        if (this.props.bounds) {
            var pos = getBoundPosition(this, clientX, clientY);
            clientX = pos[0], clientY = pos[1];
        }

        // Call event handler. If it returns explicit false, cancel.
        var shouldUpdate = this.props.onDrag(e, createUIEvent(this));
        if (shouldUpdate === false) return this.handleDragEnd();

        // Update transform
        this.setState({
            clientX: clientX,
            clientY: clientY
        });
    }

    render() {
        var childStyle = this.props.children.props.style || {};
        // 使用 transfrom 进行优化代码
        var transform = createCSSTransform({
            // Set left if horizontal drag is enabled
            x: canDragX(this) ?
                this.state.clientX :
                0,

            // Set top if vertical drag is enabled
            y: canDragY(this) ?
                this.state.clientY :
                0
        });
        var style = Object.assign({}, childStyle, transform);

        // Set zIndex if currently dragging and prop has been provided
        if (this.state.dragging && !isNaN(this.props.zIndex)) {
            style.zIndex = this.props.zIndex;
        }

        var className = classNames((this.props.children.props.className || ''), 'react-draggable', {
            'react-draggable-dragging': this.state.dragging,
            'react-draggable-dragged': this.state.dragged
        });

        // Reuse the child provided
        // This makes it flexible to use whatever element is wanted (div, ul, etc)
        return React.cloneElement(React.Children.only(this.props.children), {
            style: style,
            className: className,
            onMouseDown: this.handleDragStart,
            onTouchStart: function(ev){
                ev.preventDefault(); // prevent for scroll
                return this.handleDragStart.apply(this, arguments);
            }.bind(this),
            ref: this.node,
            onMouseUp: this.handleDragEnd,
            onTouchEnd: this.handleDragEnd
        });
    }
}