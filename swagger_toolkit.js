;(() => {
    const TIMES = 30
    let current = 0
    let isLoaded = false
    const interval = setInterval(() => {
        if (++current >= TIMES) {
            clearInterval(interval)
            return
        }
        const item = document.querySelector('.opblock-summary')
        if (!item) return
        if (!isLoaded) {
            const wrapper = document.querySelector('.swagger-ui')
            wrapper.addEventListener('click', evt => {
                // 点击接口标题时在当前 URL 中加入锚点
                const linkTitleDom = evt.target.closest('.opblock-summary')
                if (linkTitleDom) {
                    const linkDom = linkTitleDom.parentNode
                    const isOpen = !linkDom.classList.contains('is-open')
                    const hash = isOpen ? linkDom.id : ''
                    if (hash) location.hash = hash
                    return
                }
                // 点击接口中的 Model 时同步展开下方数据结构
                const modelLinkDom = evt.target.closest('ul.tab')
                if (modelLinkDom && evt.target.innerText.trim() === 'Model') {
                    setTimeout(() => {
                        const icons = modelLinkDom.nextElementSibling.querySelectorAll('.model-toggle.collapsed')
                        if (icons.length) icons[icons.length - 1].click()
                    }, 300)
                    return
                }
            })
            if (location.hash) {
                observeHash()
                window.addEventListener('hashchange', observeHash)
            }
            isLoaded = true
            return
        }
    }, 300);
    const observeHash = evt => {
        console.log('observe hash')
        const linkedDom = document.getElementById(location.hash.length > 0 ? location.hash.substr(1) : '')
        if (linkedDom) {
            const isOpen = linkedDom.classList.contains('is-open')
            linkedDom.scrollIntoView()
            if (!isOpen) linkedDom.querySelector('.opblock-summary').click()
            console.log('scroll into view: ', linkedDom, linkedDom.querySelector('.opblock-summary'))
        }
    }
    class Sheets {
        static sheets = `
            body {
                --row-width: 13vw;
                --row-min-width: 245px;
                --row-title-font-size: 14px;
                --body-wrapper-width: 80vw;
                --body-wrapper-margin-right: 3vw;
                --body-wrapper-min-width: 800px;
            }

            /* 页面内容主体布局 */
            #swagger-ui div.topbar { display: flex; justify-content: flex-end; }
            #swagger-ui div.topbar .wrapper { margin: 0; width: var(--body-wrapper-width); min-width: var(--body-wrapper-min-width); margin-right: var(--body-wrapper-margin-right) }
            #swagger-ui div.swagger-ui { display: flex; justify-content: flex-end; }
            #swagger-ui div.swagger-ui .wrapper { margin: 0; width: var(--body-wrapper-width); min-width: var(--body-wrapper-min-width); margin-right: var(--body-wrapper-margin-right) }

            /* sidebar part */
            #swagger-toolkit-sidebar {
                width: var(--row-width);
                min-width: var(--row-min-width);
                display: flex;
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                flex-direction: column;
                justify-content: space-between;
                background-color: #FAFAFA;
                border-right: 1px solid #c4d6d6;
            }
            #swagger-toolkit-sidebar .list { width: 100%; }
            #swagger-toolkit-sidebar .list > header { font-size: 18px; background-color: #999; }
            #swagger-toolkit-sidebar .list > header > .title { color: #FFF; text-align: center; font-weight: 200; }
            #swagger-toolkit-sidebar .row { display: flex; padding-bottom: 5px; width: 100%; cursor: pointer; text-decoration: none; }
            #swagger-toolkit-sidebar .row.method-DELETE { background-color: rgba(249,62,62,.1); }
            #swagger-toolkit-sidebar .row.method-DELETE:hover { background-color: rgba(249,62,62,.5); }
            #swagger-toolkit-sidebar .row.method-GET { background-color: rgba(97,175,254,.1); }
            #swagger-toolkit-sidebar .row.method-GET:hover { background-color: rgba(97,175,254,.5); }
            #swagger-toolkit-sidebar .row.method-POST { background-color: rgba(73,204,144,.1); }
            #swagger-toolkit-sidebar .row.method-POST:hover { background-color: rgba(73,204,144,.5); }
            #swagger-toolkit-sidebar .row.method-PUT { background-color: rgba(252,161,48,.1); }
            #swagger-toolkit-sidebar .row.method-PUT:hover { background-color: rgba(252,161,48,.5); }
            #swagger-toolkit-sidebar .row.method-PATCH { background-color: rgba(80,227,194,.1); }
            #swagger-toolkit-sidebar .row.method-PATCH:hover { background-color: rgba(80,227,194,.5); }

            #swagger-toolkit-sidebar .row .description { color: #333; font-size: 14px; width: var(--row-width); min-width: var(--row-min-width); }
            #swagger-toolkit-sidebar .row .method { display: flex; line-height: 45px; min-width: 64px; }
            #swagger-toolkit-sidebar .row .path > a { color: #409EFF; }

            /* helper */
            .tool-text-size-fixed { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        `
        static inject() {
            const sheet = document.createTextNode(Sheets.sheets)
            const el = document.createElement('style')
            el.id = 'swagger-toolkit-sheets'
            el.appendChild(sheet)
            document.getElementsByTagName('head')[0].appendChild(el)
        }
    }
    class LinkStore {
        key = ''
        path = ''
        method = ''
        description = '' // 接口名
        id = ''
        createdat = 0
        static MAX_LENGTH = 10
        static save(row, key) {
            const store = new LinkStore()
            store.id = row.id
            store.key = key
            store.method = row.querySelector('.opblock-summary-method').innerText
            store.path = row.querySelector('.opblock-summary-path').innerText
            store.description = row.querySelector('.opblock-summary-description').innerText
            LinkStore.add(key, store)
        }
        static add(key, store) {
            let data = LinkStore.getStore(key)
            data.unshift(store)
            if (data.length > LinkStore.MAX_LENGTH) data = data.slice(0, LinkStore.MAX_LENGTH)
            localStorage.setItem(key, JSON.stringify(data))
        }
        static getStore(key) {
            let store = []
            try {
                const _store = localStorage.getItem(key)
                if (_store) store = JSON.parse(_store)
            } catch (err) {
                console.error(err)
            }
            return store
        }
    }
    class Pane {
        dom = null
        localKey = null
        title = null
        placeholder = '暂无数据'
        generateDom(isUpdate) {
            if (isUpdate) this.dom.innerHTML = ''
            const list = isUpdate ? this.dom : document.createElement('div')
            list.classList.add('list')
            list.classList.add(this.localKey)
            // 添加 header
            const header = document.createElement('header')
            const title = document.createElement('div')
            title.classList.add('title')
            title.innerText = this.title
            list.appendChild(header)
            header.appendChild(title)
            // 添加数据
            const data = LinkStore.getStore(this.localKey)
            for (const dataRow of data) {
                const row = document.createElement('a')
                row.href = '#' + dataRow.id
                const method = document.createElement('div')
                method.innerText = dataRow.method
                const contents = document.createElement('div')
                const description = document.createElement('div')
                description.innerText = dataRow.description
                const path = document.createElement('div')
                const pathLink = document.createElement('a')
                pathLink.innerText = dataRow.path
                pathLink.href = '#' + dataRow.id
                const btnGroup = document.createElement('div')
                const markBtn = document.createElement('div')
                markBtn.innerText = '⭐️'
                const deleteBtn = document.createElement('div')
                deleteBtn.innerText = '❌'

                row.classList.add('row')
                row.classList.add('method-' + dataRow.method)
                method.classList.add('method')
                contents.classList.add('contents')
                description.classList.add('description')
                description.classList.add('tool-text-size-fixed')
                path.classList.add('path')
                btnGroup.classList.add('btn-group')
                markBtn.classList.add('btn-mark')
                deleteBtn.classList.add('btn-delete')

                path.appendChild(pathLink)
                contents.appendChild(description)
                contents.appendChild(path)
                // contents.appendChild(btnGroup)
                // btnGroup.appendChild(markBtn)
                // btnGroup.appendChild(deleteBtn)
                // row.appendChild(method)
                row.appendChild(contents)
                list.appendChild(row)
            }
            if (data.length === 0) list.appendChild(this.getPlaceholderDom())
            this.dom = list
            if (typeof this.afterGenerageDom === 'function') this.afterGenerageDom()
            return list
        }
        getPlaceholderDom() {
            const dom = document.createElement('section')
            dom.innerText = this.placeholder
            return dom
        }
    }
    class HistoryPane extends Pane {
        localKey = 'swagger-toolkit-history'
        title = '浏览历史'
        placeholder = '暂无浏览历史数据'
    }
    class MarkPane extends Pane {
        localKey = 'swagger-toolkit-mark'
        title = '收藏'
        placeholder = '暂无收藏数据, 点击收藏按钮添加'
        afterGenerageDom() {
            this.dom
        }
    }
    class SideBar {
        static dom = null
        static panes = []
        addListeners() {
            window.addEventListener('hashchange', () => {
                console.log('SideBar onhashchange')
                const row = document.getElementById(location.hash.length > 0 ? location.hash.substr(1) : '')
                LinkStore.save(row, 'swagger-toolkit-history')
                this._updatePane('swagger-toolkit-history')
            })
            return this
        }
        generateDom() {
            const sidebar = document.createElement('sidebar')
            sidebar.id = 'swagger-toolkit-sidebar'
            SideBar.dom = sidebar
            return this
        }
        inject() {
            document.body.appendChild(SideBar.dom)
            return this
        }
        appendPanes() {
            for (const pane of SideBar.panes) {
                SideBar.dom.appendChild(pane.generateDom())
            }
            return this
        }
        _updatePane(key) {
            for (const pane of SideBar.panes) {
                if (pane.localKey !== key) continue
                pane.generateDom(true)
            }
        }
    }
    Sheets.inject()
    SideBar.panes.push(new HistoryPane())
    SideBar.panes.push(new MarkPane())
    window.$$_SideBar = new SideBar()
    window.$$_SideBar.addListeners().generateDom().appendPanes().inject()
})();
