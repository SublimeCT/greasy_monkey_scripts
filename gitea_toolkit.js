// ==UserScript==
// @name         Gitea 工具箱
// @namespace    http://gogs.yunss.com/
// @version      0.1
// @description  fork的子项目多分支批量合并
// @author       Sven
// @match        *://gogs.yunss.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // @require      file:///Users/test/projects/greasy_monkey_scripts/gitea_toolkit.js
    class Store {
        static getOptions() {
            const options = localStorage.getItem('GiteaToolkit_options')
            if (!options) return {}
            try {
                return JSON.parse(options) || {}
            } catch (err) {
                console.log(err)
                return {}
            }
        }
        static setOption(options) {
            localStorage.setItem('GiteaToolkit_options', JSON.stringify(options))
        }
    }
    class ToolkitModule {
        /**
         * 页面元素
         */
        static DOM_NAVBAR = null
        static DOM_MAIN = null
        static DOM_FORK_LINK = null
        static get DOM_BRANCH_LIST() { return document.querySelector('.ui.container .ui.stackable .menu.transition.visible .scrolling.menu') }
        static get INFO_USER_NAME() { const d = document.querySelector('.right.stackable.menu .ui.header strong'); return d ? d.innerText : null }
        static get DOM_MERGE_BTN() { return document.querySelector('#new-pull-request') }
        static get INFO_FORK_LINK() { const d = document.querySelector('.fork-flag > a'); return d ? d.innerText : null }
        static get INFO_REPOSTORY_NAME() {
            const nameDom = document.querySelector('.ui.huge.breadcrumb.repo-title')
            if (nameDom) {
                const titleParts = document.title
                return titleParts.split(' ')[0]
            } else {
                return null
            }
        }
        // onload () { throw new Error('must implemention') }
        onload(ctx) {
            if (ctx.debug) console.log('获取页面元素')
            const [navbar, main] = document.querySelectorAll('body>div:first-of-type>div')
            if (navbar) ToolkitModule.DOM_NAVBAR = navbar
            if (main) ToolkitModule.DOM_MAIN = main
        }
    }
    class BatchMergeBranchToolkitModule extends ToolkitModule {
        constructor() { super() }
        name = 'BatchMergeBranchToolkit'
        _currentBranchList = []

        onload(ctx) {
            super.onload(ctx)
            if (!ToolkitModule.DOM_MERGE_BTN || !ToolkitModule.INFO_FORK_LINK) return
            ctx.log('获取分支列表, 显示所有分支')
            setTimeout(() => {
                this._showBranchSelector(ctx)
            }, 100);
        }
        _getUrlByBranchName(name) {
            const basePath = location.protocol + '//' + location.host + '/'
            const forkLink = ToolkitModule.INFO_FORK_LINK
            return basePath + forkLink + '/compare/' + name + '...' + ToolkitModule.INFO_USER_NAME + ':' + name
        }
        _showBranchSelector(ctx) {
            const branchBtn = document.querySelector('.ui.basic.small.compact.button')
            branchBtn.click()
            // 修改创建合并请求按钮
            ToolkitModule.DOM_MERGE_BTN.innerText = '🚗🚕🚙🚓🚑🚒 批量创建合并请求'
            ToolkitModule.DOM_MERGE_BTN.parentNode.href = 'javascript:;'
            ToolkitModule.DOM_MERGE_BTN.addEventListener('click', async evt => {
                evt.stopPropagation()
                // such as: https://gitxxxxxxxx.com/vue_web/shanshou_vue/compare/oem.food.1060...sven:yss.retail.1040.electron
                const urlList = []
                const branches = this._getCurrentRepostorySelectedBranches()
                for (const b of branches) {
                    urlList.push(this._getUrlByBranchName(b))
                }
                for (const u of urlList) {
                    await Toolkit.delay()
                    window.open(u)
                }
            })
            setTimeout(() => {
                // 处理分支数据并显示分支选择框
                const branchListDom = ToolkitModule.DOM_BRANCH_LIST
                const branchList = []
                for (const b of branchListDom.children) {
                    branchList.push(b.innerText)
                }
                this._currentBranchList = branchList
                branchBtn.click()
                branchBtn.addEventListener('click', evt => {
                    setTimeout(() => {
                        if (!ToolkitModule.DOM_BRANCH_LIST) return
                        const selectedList = this._getCurrentRepostorySelectedBranches()
                        for (const item of ToolkitModule.DOM_BRANCH_LIST.children) {
                            const branchName = item.innerText
                            const isSelect = selectedList.includes(branchName)
                            const checkboxDom = document.createElement('input')
                            checkboxDom.type = 'checkbox'
                            checkboxDom.checked = isSelect
                            checkboxDom.style.setProperty('width', '20px')
                            checkboxDom.style.setProperty('height', '20px')
                            checkboxDom.style.setProperty('float', 'left')
                            checkboxDom.style.setProperty('cursor', 'pointer')
                            item.appendChild(checkboxDom)
                            checkboxDom.addEventListener('click', evt => {
                                this._toggleBranch(evt.target.checked, evt.target.parentNode.innerText)
                                evt.stopPropagation()
                            })
                            const sendPRBtn = document.createElement('button')
                            sendPRBtn.innerText = '创建合并请求'
                            sendPRBtn.style.setProperty('float', 'right')
                            sendPRBtn.style.setProperty('cursor', 'pointer')
                            sendPRBtn.addEventListener('click', evt => {
                                const url = this._getUrlByBranchName(branchName)
                                window.open(url)
                                evt.stopPropagation()
                            })
                            item.appendChild(sendPRBtn)
                        }
                    }, 100)
                })
            }, 100)
        }
        _getCurrentRepostorySelectedBranches() {
            const name = ToolkitModule.INFO_REPOSTORY_NAME
            const options = Store.getOptions()
            const selectedList = (options.selectedList && options.selectedList[name]) || []
            return selectedList
        }
        _setCurrentRepostorySelectedBranches(list) {
            const name = ToolkitModule.INFO_REPOSTORY_NAME
            const options = Store.getOptions()
            if (!options.selectedList) options.selectedList = {}
            options.selectedList[name] = list
            Store.setOption(options)
        }
        _toggleBranch(checked, branchName) {
            const selectedList = this._getCurrentRepostorySelectedBranches()
            const index = selectedList.indexOf(branchName)
            if (checked && index === -1) {
                selectedList.push(branchName)
            } else if (!checked && index !== -1) {
                selectedList.splice(index, 1)
            }
            this._setCurrentRepostorySelectedBranches(selectedList)
        }
    }
    class Toolkit {
        debug = true
        options = {}
        constructor(options = {}) {
            Object.assign(this.options, options)
            this.emitHook('init')
        }
        /**
         * 工具集
         */
        static modules = []
        /**
         * 注册工具模块
         */
        static use(moduleItem) {
            Array.isArray(moduleItem) ? moduleItem.map(item => Toolkit.use(item)) : Toolkit.modules.push(moduleItem)
        }
        /**
         * 触发钩子函数
         * @param {string}} hook 钩子函数名
         */
        emitHook(hook) {
            Toolkit.modules.map(module => module[hook] && typeof module[hook] === 'function' && module[hook](this))
        }
        log(...args) {
            console.log('%c[Gitea Toolkit] LOG: ', 'color:teal', ...args)
        }
        static delay(timeout = 200) {
            return new Promise(resolve => setTimeout(resolve, timeout))
        }
    }

    Toolkit.use(new BatchMergeBranchToolkitModule())
    window._$Toolkit = new Toolkit()
    window.addEventListener('DOMContentLoaded', () => window._$Toolkit.emitHook('onload'))
})();