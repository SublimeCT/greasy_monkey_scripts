// ==UserScript==
// @name         翻页助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       sven
// @include      https://*
// @include      http://*
// @include      file://*
// @match        .*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // @require      file:///Users/test/projects/greasy_monkey_scripts/pagination.js
    /**
     * 用于翻页的元素的选择器集合
     */
    const classSelector = {
        prev: [
            '.prev', '.btn-prev', '.previous', '.btn-previous', '.prev-page', '.previous-page', '.pager-item-left',
            '#prev', '#btn-prev', '#previous', '#btn-previous', '#prev-page', '#previous-page', '#pager-item-left',
            // baidu.com
            '.n',
        ],
        next: [
            '.next', '.btn-next', '.next-page', '.pager-item-right',
            '#next', '#btn-next', '#next-page', '#pager-item-right',
            // baidu.com
            '.n',
        ]
    }
    /**
     * 所有的翻页元素匹配的 innerText 内容集合
     */
    const textList = {
        prev: ['<', '‹', 'previous', 'prev', '上一页', '上一页>', 'previouspostslink', '上页', '上一章', '上章', '<上一页', '«'],
        next: ['>', '›', 'next', '下一页', '下一页>', 'nextpostslink', '下页', '下一章', '下章', '<下一页', '»'],
    }
    /**
     * 若匹配到的翻页元素内存在 <i>, 则使用该内容模糊匹配
     */
    const iconClassPartList = {
        prev: ['angle-left', 'left', 'arrow-left'],
        next: ['angle-right', 'right', 'arrow-right'],
    }
    window.PaginationToolkit = {
        init () {
            const prev = document.createElement('button')
            const next = document.createElement('button')
            prev.style.display = next.style.display = 'none'
            prev.setAttribute('id', 'PaginationToolkit-prev')
            next.setAttribute('id', 'PaginationToolkit-next')
            prev.addEventListener('click', evt => this.prev())
            next.addEventListener('click', evt => this.next())
            document.body.appendChild(prev)
            document.body.appendChild(next)
        },
        trigger(type = 'next') {
            // 获取可能的翻页元素
            const selector = classSelector[type].join(',') + ',' + textList[type].map(t => `[title="${t}"]`).join(',')
            let elements = document.querySelectorAll(selector)
            console.log(selector, elements)
            if (!elements.length === 0) { console.warn('%c[pagination toolkit] %cprev element not found', 'color: teal', 'color: red'); return }
            for (const el of elements) {
                if (el.children.length && el.children[0].tagName === 'I') {
                    const childClassName = Array.from(el.children[0].classList).join(' ')
                    for (const part of iconClassPartList[type]) {
                        if (childClassName.indexOf(part) !== -1) {
                            el.click()
                            console.warn('%c[pagination toolkit] %cexists handle icon child', 'color: teal', 'color: cyan')
                            break
                        }
                    }
                }
                const elText = el.innerText
                if (textList[type].includes(elText)) {
                    el.click()
                    console.warn('%c[pagination toolkit] %cexists handle element', 'color: teal', 'color: cyan')
                    break
                }
            }
        },
        prev() { this.trigger('prev') },
        next() { this.trigger() }
    }
    window.PaginationToolkit.init()
})();