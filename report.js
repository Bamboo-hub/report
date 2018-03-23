var log = function () {
    console.log.apply(console, arguments)
}

// 选择元素
var e = function (sel) {
    return document.querySelector(sel)
}
// es 返回一个数组, 包含所有被选中的元素
var es = function (sel) {
    return document.querySelectorAll(sel)
}

// 给多个class绑定事件
var bindAll = function (elements, eventName, callback) {
    for (var i = 0; i < elements.length; i++) {
        var tag = elements[i]
        tag.addEventListener(eventName, callback)
    }
}


// 禁止移动端默认滑动，需要配合 css touch-action: none; 使用
var ban = function() {
    var b = e('body')
    b.addEventListener('touchmove', function(event) {
        log(event)
        event = event ? event : window.event;
        if(event.preventDefault) {
          event.preventDefault()
        } else {
          event.returnValue = false
        }
      }, false)
}

var alterY = function(pageindex) {
    var v = e('.viewport')
    v.style.transition = "0.5s ease transform"
    v.style.transform = `translate3d(0px, ${-pageindex}px, 0px)`
}

var boxHeight = function() {
    var h = window.innerHeight
    var bs = es('.box')
    for (var i = 0; i < bs.length; i++) {
        var b = bs[i]
        log(b, h)
        b.style.height = `${h}px`
        log(b.style.height)
    }
}

// 给 element 绑定事件
var bindSlideEvent = function() {
    var h = window.innerHeight
    var index = 1
    var startX = 0
    var startY = 0

    e('.viewport').addEventListener('touchstart', function(event){
        startX = parseInt(event.touches[0].pageX)
        startY = parseInt(event.touches[0].pageY)
        log('touchstart', startX, startY)
    })

    e('.viewport').addEventListener('touchmove', function(event){
        var moveX = event.touches[0].pageX
        var moveY = event.touches[0].pageY
        var deltaX = parseInt(event.touches[0].pageX - startX)
        var deltaY = parseInt(event.touches[0].pageY - startY)
        // log('touchmove', deltaX, deltaY)
        // 如果 X 方向上的位移小于 Y 方向，则认为是上下滑动
        if (Math.abs(deltaX) < Math.abs(deltaY)){
            // 如果 Y 方向上的位移是正数，并且 index 大于 0，则用户是在至少第二页往回滑动
            if (deltaY > 0 && index > 1) {
                var y = h * (index - 1) - deltaY
                this.style.transform = `translateY(${-y}px)`
            } else if (index < 4) {
                var y = h * (index - 1) - deltaY
                this.style.transform = `translateY(${-y}px)`
            }
        }
    })

    e('.viewport').addEventListener('touchend', function(event){
        var endX = parseInt(event.changedTouches[0].pageX - startX)
        var endY = parseInt(event.changedTouches[0].pageY - startY)
        log('touchend', endX, endY)
        if (Math.abs(endX) < Math.abs(endY)){
            // 如果 Y 方向上的位移是正数，并且 index 大于 0，则用户是在至少第二页往回滑动
            if (endY > 0 && index > 1) {
                var y = (index - 2) * h
                alterY(y)
                index--
                log('i-', index)
            } else if (endY > 0 && index == 1) {
                var y = 0
                alterY(y)
            } else if (index < 4) {
                var y = index * h
                alterY(y)
                index++
                log('i+', index)
            }
        }
    })
}

ban()
boxHeight()
bindSlideEvent()
