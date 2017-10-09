// ==UserScript==
// @name            百度搜索快捷键助手
// @icon            http://www.qqzhi.com/uploadpic/2014-10-08/041717696.jpg
// @author          sven
// @create          2017-10-06 20:32:56
// @run-at          document-end
// @version         0.0.3

// @connect         简介: 通过快捷键实现你想要的功能
// @connect         详细介绍及更新记录: https://github.com/SublimeCT/TampermonkeyScripts
// @content         Github地址: https://github.com/SublimeCT/TampermonkeyScripts

// @include         /^https\:\/\/www\.baidu\.com\/s/

// @namespace       hellosc@qq.com
// @copyright       2017, sven
// @description     通过快捷键实现你想要的功能, 快速跳转搜索结果, 快速定位搜索框
// @lastmodified    2017-10-07

// ==/UserScript==

(function() {
    'use strict';

    /**
     * 快捷键工具对象
     * @type Object
     */
    const Baidu_Key_Tool = {
        /**
         * 此处问题较多, 后期将统一配置和行为对象接口
         */
        options: {
            // 不启用的行为集合 | array>string
            off: [],
            // 自定义行为中的参数 | array>object>{string: object}
            setAction: []
        },
        actions: {
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
                event ({key: {index, keyCode}}) {
                    document.getElementById(index+1).querySelector('a').click()
                }
            },
            search: {
                state: true,
                switchKeyCode: null,
                keyCodes: [110],
                params: {},
                event ({key: {keyCode}}) {
                    setTimeout(() => {
                        document.getElementById('kw').focus()
                        document.getElementById('kw').select()
                    }, 77)
                }
            },
            showKeyCode: {
                state: false,
                switchKeyCode: null,
                keyCodes: [],
                params: {},
                event ({key: {keyCode}, event}) {
                    console.log('test')
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
                }, 1300)
            }
        },
        init (options = null) {
            // 合并 options
            if (options) this.options = Object.assign(this.options, options)

            // 动态监听页面变化
            this.showIndex().listenDom.init(this)

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
                // 执行
                // 遍历所有按键行为
                for (let i in this.actions) {
                    const action = this.actions[i]
                    // 判断是否为模式开关
                    this._switchAction(keyCode, action)

                    // 检测该行为是否开启
                    if (!action.state) continue

                    // 检测是否触发行为
                    this._checkKeyCode(event, action)
                }
            })
            return this
        },
        _checkKeyCode (event, action) {
            const keyCode = event.keyCode
            // 判断该行为是否是任意键触发
            if (action.keyCodes.length == 0) {
                action.event({
                    event,
                    key: {
                        keyCode
                    }
                })
            } else {
                // 遍历监听的按键[默认可重复执行多个行为]
                for (let [index, code] of action.keyCodes.entries()) {
                    if (keyCode === code) {
                        action.event({
                            event,
                            key: {
                                index,
                                keyCode
                            }
                        })
                    }
                }
            }
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
        .listening()
})();