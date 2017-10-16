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
     * 快捷键行为统一接口
     * @create V0.0.4
     */
    class Baidu_Key_Tool_Action {
        /**
         * 设置默认属性值
         * @param Object attr 
         */
        constructor () {
            this.state = true
            this.switchKeyCode = null
            this.params = null
        }
        /**
         * 抛出行为参数错误
         * @param Exception param 
         */
        _paramError (param) {
            throw new Error('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n Action Param Error \n' + param + ' is error \n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n')
        }

        /**
         * 属性 & 方法
         */
        // 是否开启该行为
        get state () { return this.state }
        set state (v) {
            if (typeof v !== 'boolean') {
                this._paramError('state')
            }
            return v
        }
        // 切换开启状态键
        get switchKeyCode () { return this.switchKeyCode }        
        set switchKeyCode (v) {
            if (typeof v !== 'number' && v !== null) {
                this._paramError('switchKeyCode')
            }
            return v
        }
        // 自定义参数
        get params () { return this.params }        
        set params (v) {
            if (typeof v !== 'object' && v !== null) {
                this._paramError('params')
            }
            return v
        }
        /**
         * 键值
         * @note  当值为 [-1] 时为任意键触发
         */
        get keyCodes () {
            if (typeof this.keyCodes === 'undefined') {
                throw new Error('shit man')
            }
            return this.keyCodes
        }        
        set keyCodes (v) {
            if (v.__proto__.constructor !== Array || v.length <1) {
                this._paramError('keyCodes')
            }
            return v
        }
        /**
         * keyup / keydown 必须实现其中一个
         */
        downEvent () {
            if (!this.upEvent) {
                throw new Error('downEvent is must set')
            }
        }
        set downEvent (v) {
            if (typeof v !== 'function') {
                this._paramError('downEvent')
            }
        }
        upEvent () {
            if (!this.downEvent) {
                throw new Error('upEvent is must set')                
            }
        }
        set upEvent (v) {
            if (typeof v !== 'function') {
                this._paramError('upEvent')
            }
        }
    }

    /**
     * 快捷键工具对象
     * @type Object
     */
    const Baidu_Key_Tool = {
        /**
         * DOM 元素 selecttor
         */
        selector: {
            // 输入框
            input: '#kw'
        },
        /**
         * 已按下的键
         */
        pressed: [],
        /**
         * 是否正在输入
         */
        isInputing: false,
        /**
         * 此处问题较多, 后期将统一配置和行为对象接口
         */
        options: {
            // 不启用的行为集合 | array>string
            off: [],
            // 自定义行为中的参数 | array>object>{string: object}
            setAction: []
        },
        /**
         * 行为
         */
        actions: {},
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
        /**
         * 初始化方法
         * @param object options 
         */
        init ({options = null, actions = null}) {
            // 合并 options
            if (options) this.options = Object.assign(this.options, options)
            // 动态监听页面变化
            this.showIndex().listenDom.init(this)
            // 监听是否正在输入
            this._listenInputing()
            // 注册行为
            this.actions = actions
            return this
        },
        /**
         * 监听用户是否在搜索框内输入内容
         */
        _listenInputing () {
            document.querySelector(this.selector.input).addEventListener('focus', () => {
                this.isInputing = true
            })
            document.querySelector(this.selector.input).addEventListener('blur', () => {
                this.isInputing = false
            })
        },
        /**
         * 显示 numer
         * @return object this
         */
        showIndex () {
            for (let i=0; i<10; i++) {
                try {
                    const item = document.getElementById(i+1)
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
                // 如果此时正在输入, 则不触发行为
                if (this.isInputing) return
                const keyCode = event.keyCode
                this.pressed.push(keyCode)
                // 遍历所有按键行为
                for (let i in this.actions) {
                    const action = this.actions[i]
                    // 判断是否为模式开关
                    this._switchAction(keyCode, action)
                    // 检测该行为是否开启
                    if (!action.state) continue
                    // 检测是否触发行为
                    this._checkKeyCode(event, action, 'downEvent')
                }
            })
            document.addEventListener('keyup', event => {
                // 如果此时正在输入, 则不触发行为
                if (this.isInputing) return
                const keyCode = event.keyCode
                this.pressed = this.pressed.filter(v => v!=keyCode)
                // 遍历所有按键行为
                for (let i in this.actions) {
                    const action = this.actions[i]
                    // 检测该行为是否开启
                    if (!action.state) continue
                    // 检测是否触发行为
                    this._checkKeyCode(event, action, 'upEvent')
                }
            })
            return this
        },
        _checkKeyCode (event, action, eventType) {
            const keyCode = event.keyCode
            // 判断该行为是否是任意键触发
            if (action.keyCodes.length === 1 && actions.keyCode[0] === -1) {
                action.event({event, key:{keyCode}, pressed: this.pressed})
            } else {
                // 遍历监听的按键
                for (let [index, code] of action.keyCodes.entries()) {
                    if (keyCode === code && action[eventType]) {
                        action[eventType]({event, key:{index,keyCode, pressed: this.pressed}})
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

    // 创建行为
    /**
     * 按序号跳转搜索结果
     */
    class Actions extends Baidu_Key_Tool_Action {
        constructor () {
            super()
            this.keyCodes = [97, 98, 99, 100, 101, 102, 103, 104, 105, 96]
        }
        downEvent ({key: {index, keyCode}, pressed}) {
            if (pressed.length === 1) {
                document.getElementById(index+1).querySelector('a').click()        
            }
        }
    }

    /**
     * 定位搜索框
     */
    class Search extends Baidu_Key_Tool_Action {
        constructor () {
            super()
            this.keyCode = [110]
        }
        downEvent ({key: {keyCode}, pressed}) {
            if (pressed.length === 1) {
                setTimeout(() => {
                    document.getElementById('kw').focus()
                    document.getElementById('kw').select()
                }, 77)
            }
        }
    }

    Baidu_Key_Tool
        .init({}, {search: new Search(), actions: new Actions})
        .listening()
})();