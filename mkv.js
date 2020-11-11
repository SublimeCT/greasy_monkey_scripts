// @ts-check
; (() => {
    const SCRIPT_KEY = 'mkv_toolkit'
    class ToolkitModule {
        constructor() { }
        isActive = true
        /**
         * create DOM
         * @param {string} tagName
         * @param {string} id
         * @param {object} param2
         * @returns {Element} dom
         */
        createElement(tagName, id, { classList, props, sheets, innerText } = {}) {
            const dom = document.createElement(tagName)
            if (id) dom.id = id
            if (Array.isArray(classList)) {
                for (const c of classList) {
                    dom.classList.add(c)
                }
            }
            if (props) {
                for (const p in props) {
                    dom.setAttribute(p, props[p])
                }
            }
            if (sheets) {
                for (const s in sheets) {
                    dom.style.setProperty(s, sheets[s])
                }
            }
            if (innerText) dom.innerText = innerText
            return dom
        }
    }
    class Sheets {
        static append(key, sheets) {
            const sheet = document.createTextNode(sheets)
            const el = document.createElement('style')
            el.id = SCRIPT_KEY + '_' + key
            el.appendChild(sheet)
            document.head.appendChild(el)
        }
    }
    /**
     * SearchUI
     */
    class SearchUIModule extends ToolkitModule {
        constructor() { super() }
        get isActive() { return location.href.indexOf('http://www.mtv-ktv.net/v/pan.asp') === 0 || location.href.indexOf('http://www.mtv-ktv.com/v/pan.asp') === 0 }
        init(ctx) {
        }
        async onload(ctx) {
            $.getJSON = url => {
                const command = `curl '${url}' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Referer: ${location.href}' -H 'User-Agent: ${navigator.userAgent.replace(/\d/, Math.random())}'`
                const timeDOM = document.querySelector('.fs--1.mb-1')
                timeDOM.id = 'command-curl'
                timeDOM.innerText = command
                this.toCopyText(command)
                throw new Error('已生成 curl 命令')
            }
            for (let times = 40; times--;) {
                const downloadDOM = document.querySelector('.btn.btn-outline-secondary.fs--1')
                await Toolkit.delay(300)
                if (!downloadDOM) continue
                downloadDOM.click()
                break
            }
            for (let times = 40; times--;) {
                const textareaFormDOM = document.querySelector('form#register-form')
                await Toolkit.delay(300)
                if (!textareaFormDOM) continue
                this.includeTextarea(textareaFormDOM)
                break
            }
        }
        toCopyText(text) {
            var tag = document.createElement('input')
            tag.setAttribute('id', 'cp_hgz_input')
            tag.value = text
            document.getElementsByTagName('body')[0].appendChild(tag)
            document.getElementById('cp_hgz_input').select()
            document.execCommand('copy')
            document.getElementById('cp_hgz_input').remove()
        }
        includeTextarea(textareaFormDOM) {
            textareaFormDOM.innerHTML = ''
            const textarea = this.createElement('textarea', 'response', { sheets: { width: '100%', height: '100%' } })
            const downloadLink = this.createElement('a', 'download-link')
            const wgetCommand = this.createElement('textarea', 'wget-command', { sheets: { width: '100%', height: '200px' } })
            downloadLink.setAttribute('href', 'javascript:;')
            downloadLink.setAttribute('target', '_blank')
            downloadLink.innerText = '等待解析下载地址'
            textarea.addEventListener('paste', e => {
                const responseClipboard = e.clipboardData || window.clipboardData
                const response = responseClipboard.getData('Text')
                let downloadURL = ''
                const res = JSON.parse(response)
                downloadURL = res.downurl
                console.log(downloadURL, res)
                if (downloadURL) {
                    downloadLink.setAttribute('href', downloadURL)
                    wgetCommand.value = this.getWgetCommand(downloadURL)
                }
            })
            textareaFormDOM.appendChild(textarea)
            textareaFormDOM.appendChild(downloadLink)
            textareaFormDOM.appendChild(wgetCommand)
        }
        getWgetCommand(downloadURL) {
            const fileName = document.title.replace(/\.mkv\s.*/, '.mkv')
            return `wget -O '${fileName}' '${downloadURL}'`
        }
    }

    /**
     * to download url
     */
    class ToDownloadPageModule extends ToolkitModule {
        constructor() { super() }
        get isActive() { return location.href.indexOf('http://www.mtv-ktv.net/v/ctfile.asp') === 0 || location.href.indexOf('http://www.mtv-ktv.com/v/ctfile.asp') === 0 }
        sheets = `
            .oset > a { display: none; }
            .oset > span { cursor: pointer; }
        `
        init(ctx) {}
        async onload(ctx) {
            Sheets.append('download', this.sheets)
            for (let times = 30; times--;) {
                const rows = document.querySelectorAll('.oset')
                await Toolkit.delay(300)
                if (!rows) continue
                this.appendDownloadLink()
                break
            }
        }
        appendDownloadLink() {
            const rows = document.querySelectorAll('.oset')
            if (!rows) return
            for (const r of Array.from(rows)) {
                const rowDOM = this.createElement('span', undefined, { classList: ['row-link'], innerText: '下载' })
                rowDOM.addEventListener('click', async evt => {
                    const link = evt.target.previousSibling
                    if (!link) return
                    let downloadURL = link.getAttribute('data-download-url')
                    if (!link.getAttribute('data-download-url')) {
                        downloadURL = await this.toDownloadPage(link.href)
                        link.setAttribute('data-download-url', downloadURL)
                        link.setAttribute('href', downloadURL)
                    }
                    if (downloadURL) link.click()
                })
                r.appendChild(rowDOM)
            }
        }
        async toDownloadPage(url) {
            const res = await fetch(url, { method: 'GET' })
            const rawText = await res.text()
            // href="https://mvxzjl.ctfile.com/fs/
            const matches = rawText.match(/href\=\"(https:\/\/mvxzjl\.ctfile\.com\/fs\/[\d\-]*)"/)
            return matches[1]
        }
    }

    /**
     * n456 pan page
     */
    class DownloadPanModule extends ToolkitModule {
        constructor() { super() }
        get isActive() { return location.href.indexOf('https://n459.com/file/') === 0 || location.href.indexOf('https://tv5.us/file') === 0 || location.href.indexOf('https://545c.com/file') === 0 }
        init(ctx) {
            const songList = this.createElement('div', 'sont-list', {
                sheets: {
                    width: '20px',
                    height: '95vh',
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    // 'background-color': 'teal'
                }
            })
            document.body.appendChild(songList)
        }
        onload(ctx) {
            ctx.log('onload')
        }
    }

    class MvxzModule extends ToolkitModule {
        constructor() { super() }
        get isActive() { return location.href.indexOf('http://mvxz.com/imv.asp') === 0 }
        init() {}
        async onload(ctx) {
            for (let times = 40; times--;) {
                const btn = document.querySelector('.button.special.fit.icon.fa-download')
                await Toolkit.delay(300)
                if (!btn) continue
                btn.setAttribute('href', 'javascript:;')
                break
            }
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
         * @param {string} hook 钩子函数名
         */
        emitHook(hook) {
            this.log('触发钩子函数: ' + hook, Toolkit.modules.length)
            Toolkit.modules.map(module => module[hook] && typeof module[hook] === 'function' && module[hook](this))
        }
        log(...args) {
            console.log('%c[MKV Toolkit] LOG: ', 'color:teal', ...args)
        }
        static delay(timeout = 200) {
            return new Promise(resolve => setTimeout(resolve, timeout))
        }
    }
    Toolkit.use(new SearchUIModule())
    Toolkit.use(new ToDownloadPageModule())
    Toolkit.use(new DownloadPanModule())
    Toolkit.use(new MvxzModule())
    window._$MKVToolkit = new Toolkit()
    window.addEventListener('DOMContentLoaded', () => window._$MKVToolkit.emitHook('onload'))
})();