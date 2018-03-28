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

// 禁止移动端默认滑动，需要配合 css touch-action: none; 使用
var ban = function() {
    var b = e('body')
    b.addEventListener('touchmove', function(event) {
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
    var w = window.innerWidth
    var h = window.innerHeight
    var bs = es('.box')
    for (var i = 0; i < bs.length; i++) {
        var b = bs[i]
        b.style.height = `${h}px`
        b.style.width = `${w}px`
    }
    var w = window.innerWidth
    var h = window.innerHeight
    var load = e('.caseBlanche')
    load.style.top = `${(h - 100) / 2}px`
    load.style.left = `${(w - 100) / 2}px`
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
        if (Math.abs(endX) < Math.abs(endY)){
            // 如果 Y 方向上的位移是正数，并且 index 大于 0，则用户是在至少第二页往回滑动
            if (endY > 0 && index > 1) {
                var y = (index - 2) * h
                alterY(y)
                index--
            } else if (endY > 0 && index == 1) {
                var y = 0
                alterY(y)
            } else if (index < 4) {
                var y = index * h
                alterY(y)
                index++
            }
        }
        singlePageAnimation(index)
    })
}

var removeElseClass = function(list, nowindex) {
    // 遍历所有页码的所有元素，将当前页码外的所有动画删除
    var ls = Object.keys(list)
    for (var i = 0; i < ls.length; i++) {
        var l = list[ls[i]]
        if (l != nowindex) {
            var es = Object.keys(l)
            for (var j = 0; j < es.length; j++) {
                var en = es[j]
                var c = l[en]
                // log('l', en, c)
                e(en).classList.remove(c)
            }
        }
    }
}

var singlePageAnimation = function(nowindex) {

    // key 是元素静态 class, 用来找到对应元素,
    // value 是要添加的动画样式的 class 名称
    var first = {
        '.first-letter': 'first-letter-animation',
        '.first-portrait': 'first-portrait-animation',
        '.first-title': 'first-title-animation',
        '.first-hint': 'first-hint-animation',
        '.first-arrows': 'first-arrows-animation',
    }

    var second = {
        '.second-text1': 'second-text1-animation',
        '.second-text2': 'second-text2-animation',
        '.second-text3': 'second-text3-animation',
        '.second-text4': 'second-text4-animation',
        '.second-text5': 'second-text5-animation',
        '.second-text6': 'second-text6-animation',
        '.second-text7': 'second-text7-animation',
        '.second-image1': 'second-image1-animation',
    }

    var third = {
        '.third-text1': 'third-text1-animation',
        '.third-text2': 'third-text2-animation',
        '.third-text3': 'third-text3-animation',
        '.third-text4': 'third-text4-animation',
        '.third-text5': 'third-text5-animation',
        '.third-image1': 'third-image1-animation',
        '.third-image2': 'third-image2-animation',
        '.third-image3': 'third-image3-animation',
        '.third-image4': 'third-image4-animation',
        '.third-image5': 'third-image5-animation',
    }

    var page = {
        page1: first,
        page2: second,
        page3: third,
    }

    // 动画默认不播放，点击事件传过来一个页码，说明用户正在本页，将该页的所有元素添加动画
    var index = page['page' + nowindex]
    var ks = Object.keys(index)
    for (var i = 0; i < ks.length; i++) {
        var k = ks[i]
        e(k).classList.add(index[k])
        // 除本页外的元素都删除动画，可实现每次划到某页都重新播放动画
        // removeElseClass(page, index)
    }
}

var imagesLonding = function() {
    log('图片加载检测')
    var images = es('img')
    var a = []
    for (var i = 0; i < images.length; i++) {
        var image = images[i]
        image.onload = function() {
            a.push('1')
            log(a.length, images.length)
            if (a.length == images.length) {
                log('图片加载完毕')
                var load = e('.caseBlanche')
                load.remove()
                var viewport = e('.viewport')
                viewport.style.display = 'block'
            }
        }
    }
    window.onload = function() {
        log('全部图片加载完毕')
        var load = e('.caseBlanche')
        load.remove()
        var viewport = e('.viewport')
        viewport.style.display = 'block'
    }
}

ban()
boxHeight()
bindSlideEvent()
imagesLonding()
