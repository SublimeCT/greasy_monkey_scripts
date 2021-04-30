;(() => {
    class ToolkitModule {
        constructor() { }
        isActive = true
    }
    class Store {
        static getOptions() {
            const options = localStorage.getItem('JueJinAvatarToolkit_options')
            if (!options) return {}
            try {
                return JSON.parse(options) || {}
            } catch (err) {
                console.log(err)
                return {}
            }
        }
        static setOption(options) {
            localStorage.setItem('JueJinAvatarToolkit_options', JSON.stringify(options))
        }
        static updateOptions(options) {
            const allOptions = Store.getOptions()
            Object.assign(allOptions, options)
            Store.setOption(allOptions)
        }
    }
    /**
     * 增加新的点击上传按钮并绑定上传事件
     */
    class HandleToolkitModule extends ToolkitModule {
        get BUTTON() { return document.querySelector('.upload-btn') }
        get BUTTON_WRAPPER() { return document.querySelector('.action-box') }
        async init(ctx) {
            if (ctx.options.form) return
            const form = document.createElement('form')
            form.setAttribute('enctype', 'multipart/form-data')
            form.style.setProperty('display', 'none')
            const fileField = document.createElement('input')
            fileField.setAttribute('type', 'file')
            fileField.id = ctx.options.AVATAR_INPUT_ID
            fileField.setAttribute('name', 'avatar')
            fileField.addEventListener('change', this.onFileChange.bind(this))
            const aidField = document.createElement('input')
            aidField.setAttribute('name', 'aid')
            aidField.value = '2608'
            form.appendChild(fileField)
            form.appendChild(aidField)
            ctx.options.form = form
            document.body.appendChild(form)
            await this.waitDOMLoaded()
            ctx.log('BUTTON: ', this.BUTTON)
            if (!this.BUTTON) throw new Error('Button not found!')
            this._start(ctx)
        }
        onFileChange() {
            window._$JueJinAvatarToolkit.options.form.submit()
        }
        async waitDOMLoaded() {
            for (let times = 20; times--;) {
                await Toolkit.delay()
                if (this.BUTTON) break
            }
        }
        _start(ctx) {
            ctx.options.handleButton = this.BUTTON.cloneNode(true)
            this._addListeners(ctx.options.handleButton, ctx)

            this.BUTTON.style.setProperty('display', 'none')
            
            this.BUTTON_WRAPPER.appendChild(ctx.options.handleButton)
            // this.BUTTON.insertBefore(ctx.options.handleButton)
        }
        onload(ctx) {
            this._start(ctx)
        }
        _addListeners(btn, ctx) {
            btn.addEventListener('click', evt => {
                const fileInput = document.getElementById(ctx.options.AVATAR_INPUT_ID)
                fileInput.click()
            })
        }
    }
    /**
     * 加入自定义样式
     */
    class SheetsToolkitModule extends ToolkitModule {
        static _getSheets() {
            return `
                /* 布局样式 */
                .upload-btn {
                    // display: none;
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
        options = {
            AVATAR_INPUT_ID: 'juejin-avatar-toolkit-avatar',
            handleButton: null, // 新增的上传按钮
            form: null, // 用于上传图片的表单
        }
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
            console.log('%c[JueJinAvatar Toolkit] LOG: ', 'color:teal', ...args)
        }
        static delay(timeout = 200) {
            return new Promise(resolve => setTimeout(resolve, timeout))
        }
    }
    Toolkit.use(new SheetsToolkitModule())
    Toolkit.use(new HandleToolkitModule())
    window._$JueJinAvatarToolkit = new Toolkit()
})();