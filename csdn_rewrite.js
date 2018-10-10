// ==UserScript==
// @name         CSDN-remove-obstacle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清理 CSDN 底部提示栏并展开内容
// @icon         https://avatar.csdn.net/D/7/F/3_nevergk.jpg
// @author       sven
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @include      https://blog.csdn.net/*
// @include      https://bbs.csdn.net/topics/*
// @match        <$URL$>
// ==/UserScript==

var inline_src = (<><![CDATA[
    // 底部提示栏
    const bottomBar = document.querySelector('.pulllog-box')
    if (bottomBar instanceof window.HTMLDivElement) {
        bottomBar.parentElement.removeChild(bottomBar)
    }
    // 阅读更多按钮
    const readMoreBtn = document.getElementById('btn-readmore')
    if (readMoreBtn instanceof window.HTMLAnchorElement) {
        readMoreBtn.click()
    }

]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);