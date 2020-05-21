// ==UserScript==
// @name         Dark++
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  CSS 实现夜间模式; 代码是从贴吧抄的, 嗯 ... over; 由于该实现本质上是覆盖一层, 可能会有未知问题出现: 如 sortTable.js 拖拽无效
// @description  v0.5 增加 file://* 协议支持
// @description  v0.6 通过修改 run-at: docuemnt-body 实现无感知增加遮罩层
// @description  v0.7 增加延迟设置, 应对延迟载入内容的页面
// @description  v0.8 修复因精度问题导致的透明度设置无效的问题
// @icon         https://gss0.baidu.com/7Ls0a8Sm2Q5IlBGlnYG/sys/portraith/item/feb81406?t=1435668917
// @author       sven
// @include      https://*
// @include      http://*
// @include      file://*
// @match        .*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body
// ==/UserScript==

(function () {
    'use strict';
    const m = document.createElement('div')
    m.style.zIndex = '999999'
    m.style.position = 'absolute'
    m.style.height = '100vh'
    m.style.width = '100vw'
    m.style.position = 'fixed'
    m.style.top = '0'
    m.style.left = '-9999px'
    m.id = 'dark-modal'
    let opacity = GM_getValue('dark_mode_opacity') || 0.4
    const step = 0.05
    const setOpacity = ({ opa, add, sub } = {}) => {
        let _opa = opa || opacity
        _opa = add
            ? _opa + step
            : (sub ? (_opa - step) : _opa)
        _opa = Math.max(0, _opa)
        _opa = Math.min(1, _opa)
        GM_setValue('dark_mode_opacity', _opa.toFixed(2))
        console.log('%c[Dark++ plugin] %copacity: ' + _opa.toFixed(2), 'color: teal;', 'color: #FFF;')
        m.style.outline = `rgba(0, 0, 0, ${opacity = _opa}) solid 10000px`
    }
    const init = () => {
        let delay = localStorage.getItem('DARK_PLUS_PLUS_DELAY')
        if (delay === null) {
            document.body.append(m)
            setOpacity()
        } else {
            delay = Number(delay)
            delay = (isNaN(delay) || delay < 0 || !Number.isInteger(delay)) ? 0 : delay
            setTimeout(() => {
                document.body.append(m)
                setOpacity()
            }, delay)
        }
        console.log(`%c[Dark++ plugin] delay: ${delay} | %c设置延迟载入遮罩层: %clocalStorage.setItem('DARK_PLUS_PLUS_DELAY', 200)`, 'color: teal', 'color: #FFF', 'color: #AAA')
    }
    const keyMap = {
        81: () => setOpacity({ add: true }),
        87: () => setOpacity({ sub: true })
    }
    init()
    document.addEventListener('keydown', evt => {
        keyMap[evt.keyCode] && keyMap[evt.keyCode](evt)
    })
})();