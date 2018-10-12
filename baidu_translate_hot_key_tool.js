// ==UserScript==
// @name         baidu_translate_hot_key_tool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清理 CSDN 底部提示栏并展开内容
// @icon         http://fanyi.bdstatic.com/static/translation/img/favicon/favicon_d87cd2a.ico
// @author       sven
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @include      https://fanyi.baidu.com/*
// @match        <$URL$>
// ==/UserScript==

var inline_src = (<><![CDATA[
    (() => {
        if (location.href.indexOf('https://fanyi.baidu.com/#') !== 0) return false
        const input = document.getElementById('baidu_translate_input')
        /**
         * ctrl+meta+up(focus) 聚焦并选中
         * ctrl+meta+left(say) 发音[输入内容]
         * ctrl+meta+right(say) 发音[翻译结果]
         */
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
    })()
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);