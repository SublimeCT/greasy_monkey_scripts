// ==UserScript==
// @name         中国大学Mooc工具箱
// @namespace    http://tampermonkey.net/
// @icon         https://edu-image.nosdn.127.net/32a8dd2a-b9aa-4ec9-abd5-66cd8751befb.png
// @version      0.3
// @description  自动切换🎬最高清晰度 | 🎨 解除页面被灰度处理
// @note         v0.2 fix: 修复网站源码中对于 `EventTarget.prototype.addEventListener` 的劫持导致的所有脚本触发的事件无效的问题
// @note         v0.3 feat: 增加课程详情页切换清晰度支持
// @author       Sven
// @match        https://www.icourse163.org/*
// @grant        none
// @license      GPL-3.0-only
// ==/UserScript==

(function () {
    'use strict';
    // @require      file:///Users/sven/projects/greasy_monkey_scripts/chinese_mooc_toolkit.js
    class Store {
        static getOptions() {
            const options = localStorage.getItem('Chinese_Mooc_Toolkit_options')
            if (!options) return {}
            try {
                return JSON.parse(options) || {}
            } catch (err) {
                console.log(err)
                return {}
            }
        }
        static setOption(options) {
            localStorage.setItem('Chinese_Mooc_Toolkit_options', JSON.stringify(options))
        }
    }
    class ToolkitModule {
        /**
         * 页面配置
         * @description 针对不同页面的细粒度配置, 对应页面的 URL path key
         */
        static PAGES = {
            // 课程内容页
            content_video: { // 视频页, 这里不区分是视频还是课件页面, 因为视频和课件将在一起显示
                // 检测是否是当前页面
                pathCheck: url => url.indexOf('#/learn/content?type=detail&id=') > 0,
                // 允许启用的功能模块
                get enableModules() { return [SheetsToolkitModule, PlayerToolkitModule, EventTargetSaveToolkitModule] },
            },
            announce: { // 公告
                get enableModules() { return [SheetsToolkitModule, EventTargetSaveToolkitModule] },
            },
            score: { // 评分标准
                get enableModules() { return [SheetsToolkitModule, EventTargetSaveToolkitModule] },
            },
            content: { // 课件
                get enableModules() { return [SheetsToolkitModule, EventTargetSaveToolkitModule] },
            },
            testlist: { // 测试与作业
                get enableModules() { return [SheetsToolkitModule, EventTargetSaveToolkitModule] },
            },
            examlist: { // 考试
                get enableModules() { return [SheetsToolkitModule, EventTargetSaveToolkitModule] },
            },
            // 课程详情页
            courseForumindex: { // 讨论区
                // 检测是否是当前页面
                pathCheck: url => url.indexOf('/course/') === 0,
                get enableModules() { return [SheetsToolkitModule, CoverPlayerToolkitModule] },
            },
        }
        /**
         * 当前页类型
         */
        static get page() {
            for (const p in ToolkitModule.PAGES) {
                const urlPath = location.pathname + location.search + location.hash
                const useCheckFunction = typeof ToolkitModule.PAGES[p].pathCheck === 'function'
                const checkResult = useCheckFunction
                    ? ToolkitModule.PAGES[p].pathCheck(urlPath)
                    : urlPath.indexOf('/learn/' + p) > 0
                if (checkResult) return ToolkitModule.PAGES[p]
            }
        }
        static QUALITYS = [
            { key: '超高清' },
            { key: '高清' },
            { key: '标清' },
        ]
        // 视频清晰度按钮组
        static get DOM_QUALITY_LIST() { return document.querySelector('.m-popover-quality > ul') }
        // 课程详情页播放按钮
        static get DOM_COURSE_DETAILS_PLAY_BTN() { return document.querySelector('.click-btn-wrapper .clickBtn') }
        // 视频当前清晰度按钮
        static get DOM_QUALITY_BUTTONS() { return ToolkitModule.DOM_QUALITY_LIST && ToolkitModule.DOM_QUALITY_LIST.children }
        onload(ctx) {}
    }
    /**
     * 加入自定义样式
     */
    class SheetsToolkitModule extends ToolkitModule {
        static _getSheets() {
            return `
                html {
                    --document-filter: grayscale(0); /* #html 防止网页被黑白处理, 适用于特殊日期 */
                }
                /* 外层全局样式 */
                html {
                    filter: var(--document-filter) !important;
                }
                /* 视频页样式 */
                .u-learnBCUI { width: 100%; }
                .u-learnBCUI .u-select { width: auto; }
                .up.j-up.f-thide { background-position: right center; }
                .up.j-up.f-thide::after {
                    content: '';
                    position: absolute;
                    top: 38%;
                    width: 0;
                    height: 0;
                    border: 4px solid transparent;
                    border-width: 6px 5px 0 5px;
                    border-top-color: #c6c6c6;
                    -webkit-transition: all .3s;
                    transition: all .3s;
                    cursor: pointer;
                }
                .down.f-bg.j-list { width: auto !important; }
                /* 推荐课程, 会在暂停播放是弹出 */
                .ux-modal.um-recommend-modal { display: none; }
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
     * 处理视频播放器
     */
    class PlayerToolkitModule extends ToolkitModule {
        /**
         * 是否忽略被隐藏的清晰度选项按钮
         * @description 课程详情页非全屏时可能会隐藏最高清晰度选项, 视频详情页会显示全部可用的清晰度
         */
        ignoreQualityDisplay = false
        init(ctx) {
            ctx.log('⚙ 开始修改视频清晰度')
            this._fixedQuality(ctx)
        }
        async _fixedQuality(ctx) {
            for (let times = 40; times--;) {
                const qualityBtnList = ToolkitModule.DOM_QUALITY_LIST
                await Toolkit.delay(300)
                if (!qualityBtnList) continue
                if (qualityBtnList.length === 1) break // 仅有一个清晰度时不作处理
                const changed = this._handleQuality(ctx)
                if (changed) break
            }
        }
        _handleQuality(ctx) {
            // 寻找最高清晰度
            ctx.highestQuality = this._findHighestQualityBtn() // 最高清晰度
            // 切换到最高清晰度, ⚠️ 这里需要多次调用 click(), 实测一次可能不会成功
            const changed = this.changeQuality(ctx)
            if (changed) {
                ctx.log('⚙ 修改视频清晰度成功')
                return true
            } else {
                ctx.log('⚙ 修改视频清晰度ing ...')
            }
        }
        /**
         * 寻找最高清晰度
         */
        _findHighestQualityBtn() {
            let _highestQualityBtn = null
            for (const q of ToolkitModule.QUALITYS) {
                for (const d of Array.from(ToolkitModule.DOM_QUALITY_BUTTONS)) {
                    if (d.innerHTML === q.key && (this.ignoreQualityDisplay || (!this.ignoreQualityDisplay && window.getComputedStyle(d).display !== 'none'))) {
                        _highestQualityBtn = d
                        break
                    }
                }
                if (_highestQualityBtn) break
            }
            return _highestQualityBtn
        }
        /**
         * 点击最高清晰度按钮, 返回是否切换成功
         */
        changeQuality(ctx) {
            if (!ctx.highestQuality) return
            ctx.quality = Array.from(ToolkitModule.DOM_QUALITY_BUTTONS).find(d => d.classList.contains('z-sel'))
            ctx.highestQuality.click()
            return ctx.quality === ctx.highestQuality
        }
    }
    class CoverPlayerToolkitModule extends PlayerToolkitModule {
        /**
         * 是否忽略被隐藏的清晰度选项按钮
         * @description 课程详情页非全屏时可能会隐藏最高清晰度选项, 视频详情页会显示全部可用的清晰度
         */
        ignoreQualityDisplay = true
        async init(ctx) {
            for (let times = 40; times--;) {
                await Toolkit.delay(300)
                const playBtn = ToolkitModule.DOM_COURSE_DETAILS_PLAY_BTN
                if (!playBtn) continue
                playBtn.addEventListener('click', evt => {
                    this._fixedQuality(ctx)
                })
                break
            }
        }
    }
    class EventTargetSaveToolkitModule extends ToolkitModule {
        init(ctx) {
            ctx.log('init event target', ctx.evtTarget)
            ctx.evtTargetProto = EventTarget.prototype
            EventTarget = new Proxy(EventTarget, {
                get(target, p, receiver) {
                    let value = Reflect.get(target, p, receiver)
                    // ~~会无情的触发 read-only 报错, 请无视这个报错, 目前没有发现其他解决方案~~
                    if (p === 'prototype') return
                    return value
                }
            })
        }
    }
    class Toolkit {
        debug = true
        options = {}
        quality = null // 当前清晰度
        highestQuality = null // 最高清晰度
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
            Toolkit.modules.forEach(module => {
                const page = ToolkitModule.page
                // 未知页面不处理
                if (!page) return
                // 如果当前模块不包含在当前页面的可使用模块列表中, 就忽略这个模块
                if (Array.isArray(page.enableModules) && !page.enableModules.includes(module.constructor)) {
                    // this.log('⚠️ disabled module', module.constructor && module.constructor.name)
                    return
                }
                // this.log('🚗 enable module: ', module.constructor && module.constructor.name)
                if (module[hook] && typeof module[hook] === 'function') {
                    try {
                        module[hook](this)
                    } catch(err) {
                        if (err.message && err.message.indexOf(`property 'prototype' is a read-only`) > 0) return
                        console.error(err)
                    }
                }
            })
        }
        log(...args) {
            console.log('%c[Chinese_Mooc_Toolkit] LOG: ', 'color:teal', ...args)
        }
        static delay(timeout = 200) {
            return new Promise(resolve => setTimeout(resolve, timeout))
        }
    }

    Toolkit.use(new EventTargetSaveToolkitModule())
    Toolkit.use(new CoverPlayerToolkitModule())
    Toolkit.use(new SheetsToolkitModule())
    Toolkit.use(new PlayerToolkitModule())
    window._$Toolkit = new Toolkit()
    // ⚠️ 单页面应用中 onload 仅触发一次, 这里手动监听页面跳转以触发 init 事件
    window.addEventListener('DOMContentLoaded', () => window._$Toolkit.emitHook('onload'))
    window.addEventListener('hashchange', () => window._$Toolkit.emitHook('init'))
})();