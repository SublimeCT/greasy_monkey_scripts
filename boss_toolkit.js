// ==UserScript==
// @name         BOSS 直聘简历下载工具
// @namespace    SublimeCT
// @version      1.0.0
// @description  在简历预览页直接下载当前显示的内容, 可以下载为图片(开发中)(下载内容区元素截图) 或 PDF(调用浏览器打印功能可以保存为 PDF)
// @author       SublimeCT
// @require      file:///Users/kuidi/projects/greasy_monkey_scripts/boss_toolkit.js
// @match        https://www.zhipin.com/web/geek/resumetpl
// @icon         https://www.zhipin.com/favicon.ico
// @grant        none
// ==/UserScript==

; (() => {
    class ToolkitModule {
        constructor() { }
        isActive = true
    }
    class DownloadToolkitModule extends ToolkitModule {
        async onload(options) {
            await Toolkit.waitDOMLoaded(() => document.querySelector('.header .btn-box'))
            const btnBox = document.querySelector('.header .btn-box')
            await Toolkit.waitDOMLoaded(() => btnBox.querySelector('.btn.btn-download[ka=resumer_maker_preview_download]'))
            const downloadButton = btnBox.querySelector('.btn.btn-download[ka=resumer_maker_preview_download]')
            const downloadToolketButton = downloadButton.cloneNode(true)
            const screenShortToolketButton = downloadButton.cloneNode(true)
            downloadToolketButton.setAttribute('ka', 'downloadToolketButton')
            downloadToolketButton.style.width = 'auto'
            downloadToolketButton.innerText = '下载简历(PDF)'
            screenShortToolketButton.setAttribute('ka', 'screenShortToolketButton')
            screenShortToolketButton.style.width = 'auto'
            // 功能开发中 ... 暂时隐藏
            screenShortToolketButton.style.display = 'none'
            screenShortToolketButton.innerText = '下载简历(图片)'
            // btnBox.removeChild(downloadButton)
            btnBox.appendChild(downloadToolketButton)
            btnBox.appendChild(screenShortToolketButton)
            downloadToolketButton.addEventListener('click', event => {
                // 1. 切换为下载 PDF 的样式
                this._changeMode('download-pdf')
                // 2. 调用浏览器的打印
                window.print()
                // 3. 切换到原始样式
                this._changeMode()
            })
            screenShortToolketButton.addEventListener('click', event => {
                console.log('??')
            })
        }
        _changeMode(mode = '') {
            document.body.setAttribute('mode', mode)
        }
    }
    /**
     * 加入自定义样式
     */
    class SheetsToolkitModule extends ToolkitModule {
        static _getSheets() {
            return `
                /* 显示最外层的滚动条 */
                #wrap {
                    height: auto !important;
                }
                .switch-templates-wrapper .btn[ka="resumer_maker_preview_download"] {
                    display: none !important;
                }
                .switch-templates-wrapper .btn {
                    margin-right: 15px;
                }
                .switch-templates-wrapper .btn:last-of-type {
                    margin-right: 0;
                }
                /* 下载 PDF 时的样式 */
                body[mode="download-pdf"] {
                    width: 820px;
                }
                body[mode="download-pdf"] #wrap {
                    min-width: 820px;
                }
                body[mode="download-pdf"] .switch-templates-wrapper > .header {
                    display: none !important;
                }
            `
        }
        init(ctx) {
            ctx.log('加入自定义样式')
            SheetsToolkitModule.appendSheets()
        }
        // 通过注入 css 实现隐藏广告并固定布局
        static appendSheets() {
            const sheet = document.createTextNode(SheetsToolkitModule._getSheets())
            const el = document.createElement('style')
            el.id = 'handle-sheets'
            el.appendChild(sheet)
            document.getElementsByTagName('head')[0].appendChild(el)
        }
    }
    /**
     * 工具类
     */
    class Toolkit {
        debug = true
        options = {}
        users = {}
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
            // 禁用未激活的模块
            if (!moduleItem.isActive) return
            Array.isArray(moduleItem) ? moduleItem.map(item => Toolkit.use(item)) : Toolkit.modules.push(moduleItem)
        }
        /**
         * 触发钩子函数
         * @param {string}} hook 钩子函数名
         */
        emitHook(hook) {
            this.log('触发钩子函数: ' + hook, Toolkit.modules.length)
            Toolkit.modules.map(module => module[hook] && typeof module[hook] === 'function' && module[hook](this))
        }
        log(...args) {
            console.log('%c[BOSS Toolkit] LOG: ', 'color:teal', ...args)
        }
        static delay(timeout = 200) {
            return new Promise(resolve => setTimeout(resolve, timeout))
        }
        static async waitDOMLoaded(domGetter, delay) {
            for (let times = 20; times--;) {
                await Toolkit.delay(delay)
                if (domGetter()) break
            }
        }
    }
    Toolkit.use(new SheetsToolkitModule())
    Toolkit.use(new DownloadToolkitModule())
    window._$BOSSToolkit = new Toolkit()
    document.addEventListener('readystatechange', async () => {
        console.log('readystatechange')
        // 执行所有模块的钩子函数
        window._$BOSSToolkit.emitHook('onload')
    })
})();