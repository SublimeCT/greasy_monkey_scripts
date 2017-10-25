// ==UserScript==
// @name            百度搜索快捷键助手
// @icon            http://www.qqzhi.com/uploadpic/2014-10-08/041717696.jpg
// @author          sven
// @create          2017-10-06 20:32:56
// @run-at          document-end
// @version         0.0.4

// @connect         简介: 通过快捷键实现你想要的功能
// @connect         详细介绍及更新记录: https://github.com/SublimeCT/TampermonkeyScripts

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
         * DOM 元素 selecttor
         */
        selector: {
            // 输入框
            input: document.getElementById('kw'),
            // 当前页页码 DOM
            pageNum: document.querySelector('#page>strong>.pc')
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
         * 页码
         */
        pageNum: 1,
        /**
         * 首个搜索结果序号
         */
        firstIndex: 1,
        /**
         * 配置参数
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
                _this._refreshIndex()
                this.dom = document.getElementById(_this.firstIndex)
                setInterval(() => {
                    if (this.dom !== document.getElementById(_this.firstIndex)) {
                        _this._refreshIndex()
                        this.dom = document.getElementById(_this.firstIndex)
                        _this.showIndex(this.firstIndex)
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
            if (options) Object.assign(this.options, options)
            // 获取页面页码信息
            this._refreshIndex()
            // 动态监听页面变化
            this.showIndex().listenDom.init(this)
            // 监听是否正在输入
            this._listenInputing()
            // 注册行为
            this.actions = actions
            return this
        },
        /**
         * 初始化页面页码信息
         */
        _refreshIndex () {
            this.pageNum = document.querySelector('#page>strong>.pc').innerHTML
            this.firstIndex = 10 * (this.pageNum - 1) + 1
        },
        /**
         * 监听用户是否在搜索框内输入内容
         */
        _listenInputing () {
            this.selector.input.addEventListener('focus', () => {
                this.isInputing = true
            })
            this.selector.input.addEventListener('blur', () => {
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
                    const index = this.firstIndex + i
                    const item = document.getElementById(index)
                    const locationDom = item.querySelector('h3')
                    const indexNode = this._getIndexNode(i + 1)
                    locationDom.style.position = 'relative'
                    locationDom.insertBefore(indexNode, item.querySelector('h3>:first-child'))
                } catch (e) {
                    console.warn('序号渲染失败', this)
                    // throw new Error(e)
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
                // console.warn('按下' + keyCode, this.pressed)
                // 遍历所有按键行为
                for (let i in this.actions) {
                    const action = this.actions[i]
                    // 判断是否为模式开关
                    this._switchAction(keyCode, action)
                    // 检测该行为是否开启
                    if (!action.state) continue
                    // 检测是否触发行为
                    this._checkKeyCode(event, action, 'down')
                }
            })
            document.addEventListener('keyup', event => {
                // 如果此时正在输入, 则不触发行为
                if (this.isInputing) return
                const keyCode = event.keyCode
                this.pressed = this.pressed.filter(v => v!=keyCode)
                // console.warn('松开' + keyCode, this.pressed)
                // 遍历所有按键行为
                for (let i in this.actions) {
                    const action = this.actions[i]
                    // 检测该行为是否开启
                    if (!action.state) continue
                    // 检测是否触发行为
                    this._checkKeyCode(event, action, 'up')
                }
            })
            return this
        },
        /**
         * 触发事件类型对应的行为
         * @param Object event 
         * @param Object action 行为对象
         * @param String eventType 事件类型
         */
        _checkKeyCode (event, action, eventType) {
            const keyCode = event.keyCode
            const params = {
                event,
                key: {
                    keyCode
                },
                firstIndex: this.firstIndex,
                pressed: this.pressed,
                pageNum: this.pageNum
            }
            // 判断该行为是否是任意键触发
            if (action.keyCodes[eventType].length === 1 && action.keyCodes[eventType][0] === -1) {
                this._triggerHeadler({action, eventType, params})
            } else {
                // 遍历监听的按键
                for (let [index, code] of action.keyCodes[eventType].entries()) {
                    if (keyCode === code && action[eventType + 'Event']) {
                        params.key.index = index
                        this._triggerHeadler({action, eventType, params})
                    }
                }
            }
        },
        /**
         * 触发对应事件回调, 并根据返回值修改属性
         * @param Object param
         */
        _triggerHeadler ({action, event, eventType, params}) {
            const endData = action[eventType + 'Event'](params)
            endData ? Object.assign(this, endData) : null
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
        /**
         * 判断是否触发行为开关
         * @param Number keyCode 
         * @param Object action 
         */
        _switchAction (keyCode, action) {
            if (keyCode === action.switchKeyCode) {
                action.state = !action.state
            }
        }
    }

    /**
     * 快捷键行为统一接口
     * @create V0.0.4
     */
    class Baidu_Key_Tool_Action {
        /**
         * 设置默认属性值
         * @param Object attr 
         */
        constructor ({up = [], down = []}) {
            this._state = true
            this._switchKeyCode = null
            this._params = null
            this._keyCodes = { up, down }
        }
        /**
         * 抛出行为参数错误
         * @param Exception param 
         */
        _paramError (param) {
            throw new Error('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n\n\n\n\tAction Param Error \n\n' + 
            param 
            + '\tis error \n\n\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n')
        }

        /**
         * 属性 & 方法
         */
        // 是否开启该行为
        get state () { return this._state }
        set state (v) {
            if (typeof v !== 'boolean') {
                this._paramError('state')
            }
            this._state = v
        }
        // 切换开启状态键
        get switchKeyCode () { return this._switchKeyCode }
        set switchKeyCode (v) {
            if (typeof v !== 'number' && v !== null) {
                this._paramError('switchKeyCode')
            }
            this._switchKeyCode = v
        }
        // 自定义参数
        get params () { return this._params }
        set params (v) {
            if (typeof v !== 'object' && v !== null) {
                this._paramError('params')
            }
            this._params = v
        }
        /**
         * 键值
         * @note  当值为 [-1] 时为任意键触发
         */
        get keyCodes () {
            if (typeof this._keyCodes === 'undefined') {
                throw new Error('keyCodes is not found')
            }
            return this._keyCodes
        }
        set keyCodes (v) {
            if (typeof v !== 'object' || typeof v.up === 'undefined' || typeof v.down === 'undefined') {
                this._paramError('keyCodes')
            }
            this._keyCodes = v
        }
        /**
         * keyup / keydown 必须实现其中一个
         */
        _downEvent () {
            if (!this._upEvent) {
                throw new Error('downEvent is must set')
            }
        }
        get downEvent () { return this._downEvent }
        set downEvent (v) {
            if (typeof v !== 'function') {
                this._paramError('downEvent')
            }
            this._downEvent = v
        }
        _upEvent () {
            if (!this._downEvent) {
                throw new Error('upEvent is must set')                
            }
        }
        get upEvent () { return this._upEvent }        
        set upEvent (v) {
            if (typeof v !== 'function') {
                this._paramError('upEvent')
            }
            this._upEvent = v
        }
    }

    /**
     * 按序号跳转搜索结果
     */
    class ClickAction extends Baidu_Key_Tool_Action {
        constructor () {
            super({ down: [97, 98, 99, 100, 101, 102, 103, 104, 105, 96] })
        }
        downEvent ({key: {index, keyCode}, pressed, firstIndex = 1}) {
            if (pressed.length === 1) {
                // 跳转新标签页时无法监听 keyup 事件, 需要手动移除对应 keyCode
                pressed = pressed.filter(v => v!==keyCode)
                document.getElementById(firstIndex + index).querySelector('a').click()
                return { pressed }
            }
        }
    }

    /**
     * 定位搜索框
     */
    class SearchAction extends Baidu_Key_Tool_Action {
        constructor () {
            super({ down: [110] })
        }
        downEvent ({key: {keyCode}, pressed}) {
            if (pressed.length === 1) {
                setTimeout(() => {
                    document.getElementById('kw').focus()
                    document.getElementById('kw').select()
                }, 77)
                pressed = pressed.filter(v => v!==keyCode)
                return { pressed }
            }
        }
    }

    /**
     * 翻页
     */
    class PageAction extends Baidu_Key_Tool_Action {
        constructor () {
            super({ down: [17, 37, 39] })
        }
        downEvent ({key: {keyCode}, pressed, pageNum}) {
            if (pressed.includes(17) && pressed.length === 2) {
                let pageText = 0
                if (pressed.includes(37)) {
                    pressed = pressed.filter(v => v!==17 && v!==37)
                    pageText = '上一页'
                } else if (pressed.includes(39)) {
                    pressed = pressed.filter(v => v!==17 && v!==39)
                    pageText = '下一页'
                } else {
                    return
                }
                document.querySelectorAll('#page>a.n').forEach(
                    btn => {
                        if (btn.innerHTML.indexOf(pageText) !== -1) {
                            btn.click()
                        }
                    }
                )
                return { pressed }                
            }
        }
    }

    Baidu_Key_Tool
        .init({actions: {search: new SearchAction(), click: new ClickAction, page: new PageAction}})
        .listening()
})();