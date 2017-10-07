// ==UserScript==
// @name            百度搜索快捷键助手
// @icon            http://www.qqzhi.com/uploadpic/2014-10-08/041717696.jpg
// @author          sven
// @create          2017-10-06 20:32:56
// @run-at          document-end
// @version         0.0.1

// @connect         功能描述:
// @connect             自定义部分
// @connect                 1. 自定义百度搜索结果跳转快捷键, 支持固定模式开关键(on/off)+数字键或小键盘数字键跳转
// @connect                 2. 通过快捷键快速定位搜索框, 支持固定模式开关键(on/off)+指定键跳转
// @connect             可选固定功能
// @connect                 1. 页面加载完毕或为所有搜索结果标号

// @include         /^https\:\/\/www\.baidu\.com\/s/

// @namespace       hellosc@qq.com
// @copyright       2017, sven
// @description     有空再写 ...
// @lastmodified    2017-10-07

// ==/UserScript==

(function() {
    'use strict';

    /**
     * 快捷键工具对象
     * @type Object
     */
    const Baidu_Key_Tool = {
        options: {
            index: {
                // 默认是否开启
                state: true,
                // 切换开启状态键
                switchKeyCode: null,
                // 键值
                keyCodes: [97, 98, 99, 100, 101, 102, 103, 104, 105, 96],
                // 自定义参数
                params: {},
                // 事件函数
                event ({key: {index, code}}) {
                    document.getElementById(index+1).querySelector('a').click()
                }
            },
            search: {
                state: true,
                switchKeyCode: null,
                keyCodes: [110],
                params: {},
                event ({key: {code}}) {
                    setTimeout(() => {
                        document.getElementById('kw').focus()
                        document.getElementById('kw').select()
                    }, 77)
                }
            }
        },
        /**
         * 暂时用 setInterval 实现, 有时间再看 MutationObserver ...
         *    将第一条搜索结果 DOM 元素保存, 不断对比
         */
        listenDom: {
            dom: null,
            init (_this) {
                this.dom = document.getElementById('1')
                setInterval(() => {
                    if (this.dom !== document.getElementById('1')) {
                        _this.showIndex()
                        this.dom = document.getElementById('1')
                    }
                }, 1000)
            }
        },
        init (options = null) {
            // 合并 options
            if (options) this.options = Object.assign(this.options, options)

            // 动态监听页面变化
            this.listenDom.init(this)

            return this
        },
        /**
         * 显示 numer
         * @return object this
         */
        showIndex () {
            for (let i=0; i<10; i++) {
                const item = document.getElementById(i+1)
                try {
                    const locationDom = item.querySelector('h3')
                    const indexNode = this._getIndexNode(i+1)
                    locationDom.style.position = 'relative'
                    locationDom.insertBefore(indexNode, item.querySelector('h3>:first-child'))
                } catch (e) {
                    // 某些非主流搜索结果忽略了, 但不影响事件行为
                }
            }
            return this
        },
        /**
         * 监听 keydown
         * @return object this
         */
        listening () {
            document.addEventListener('keydown', event => {
                const keyCode = event.keyCode
                // 遍历所有按键行为
                for (let i in this.options) {
                    const action = this.options[i]
                    // 判断是否为模式开关
                    this._switchAction(keyCode, action)

                    // 检测该行为是否开启
                    if (!action.state) continue

                    // 遍历监听的按键[默认可重复执行多个行为]
                    for (let [index, code] of action.keyCodes.entries()) {
                        if (keyCode === code) {
                            action.event({
                                key: {
                                    index,
                                    code
                                }
                            })
                        }
                    }
                }
            })
            return this
        },
        /**
         * 创建序号 node element
         * @param index
         * @returns {Element}
         * @private
         */
        _getIndexNode (index) {
            let indexNode = document.createElement('span')
            indexNode.style.backgroundColor = '#369'
            indexNode.style.color = '#fff'
            indexNode.style.fontSize = '18px'
            indexNode.style.position = 'absolute'
            indexNode.style.left = '-45px'
            indexNode.style.borderRadius = '50%'
            indexNode.style.width = '35px'
            indexNode.style.heigth = '35px'
            indexNode.style.lineHeight = '35px'
            indexNode.style.textAlign = 'center'

            indexNode.innerHTML = index
            indexNode.class = 'baidu_tool_index'

            return indexNode
        },
        _switchAction (keyCode, action) {
            if (keyCode === action.switchKeyCode) {
                action.state = !action.state
            }
        }
    }
    Baidu_Key_Tool
        .init()
        .showIndex()
        .listening()
})();