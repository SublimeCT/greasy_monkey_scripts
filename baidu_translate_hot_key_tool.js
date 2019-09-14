// ==UserScript==
// @name         baidu_translate_hot_key_tool
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  v0.1.0 百度翻译快捷键插件;支持聚焦/搜索内容发音/翻译结果发音
// @description  v1.0.0 整理代码, 移除兼容部分代码
// @icon         http://fanyi.bdstatic.com/static/translation/img/favicon/favicon_d87cd2a.ico
// @author       sven
// @include      https://fanyi.baidu.com/*
// @match        <$URL$>
// ==/UserScript==

;(function() {
    if (location.href.indexOf('https://fanyi.baidu.com/#') !== 0) return false
    const input = document.getElementById('baidu_translate_input')
    const Handler = {
        _originBtn: null,
        _resultBtn: null,
        get originBtn () {
            return this._originBtn || (this._originBtn = document.querySelector('.input-operate .operate-btn.op-sound'))
        },
        get resultBtn () {
            return this._resultBtn || (this._resultBtn = document.querySelector('.output-operate .operate-btn.op-sound'))
        },
        init () {
            Handler.listenKeyup()
            Handler.addTips()
        },
        /**
         * 监听键盘事件
         * ctrl+meta+up(focus) 聚焦并选中
         * ctrl+meta+left(say) 发音[输入内容]
         * ctrl+meta+right(say) 发音[翻译结果]
         */
        listenKeyup () {
            document.addEventListener('keyup', evt => {
                const {
                    altKey, ctrlKey, shiftKey, keyCode, metaKey
                } = evt
                if (!ctrlKey || !metaKey) return false
                const originBtn = document.querySelector('.input-operate .operate-btn.op-sound')
                const resultBtn = document.querySelector('.output-operate .operate-btn.op-sound')
                switch (keyCode) {
                    case 38: // up
                        if (evt.target.tagName === 'TEXTAREA') return false;
                        input.focus()
                        input.select()
                        break
                    case 37: // left
                        originBtn && originBtn.click()
                        break
                    case 39: // right
                        resultBtn && resultBtn.click()
                        break
                }
            })
        },
        addTips () {
            // window.addEventListener('load', evt => {
            //    if (this.originBtn) this.originBtn.innerHTML += '<div>ctrl+meta+left</div>'
            //    if (this.resultBtn) this.resultBtn.innerHTML += '<div>ctrl+meta+right</div>'
            // })
        }
    }
    Handler.init()
})();