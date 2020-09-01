// ==UserScript==
// @name         🥊 百度手机端自动展开搜索结果
// @namespace    SublimeCT
// @icon         https://www.mycodes.net/favicon.ico
// @version      1.0.2
// @description  ⚡️ 自动展开被百度折叠的搜索结果 | 🥊 禁止所有提示下载 APP 的行为
// @note         v1.0.1 在 isEnable 判断中加入 www.baidu.com 域名
// @note         v1.0.2 BaiduIndex 加入百家号页面判断
// @author       Sven
// @homepage     https://github.com/SublimeCT/greasy_monkey_scripts
// @supportURL   https://github.com/SublimeCT/greasy_monkey_scripts/issues
// @match        *://*baidu.com*
// @include      *://*baidu.com*
// @grant        none
// @license      GPL-3.0-only
// @run-at       document-start
// ==/UserScript==

; (() => {
    const SCRIPT_KEY = 'mobile_cleaner'
    class ToolkitModule {
        key = ''
        static isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
        constructor() { }
        isEnable(evtName) { throw new Error('You must override isEnable attributes') }
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
     * 展开百度搜索文章页
     */
    class CleanBaiduArticleModule extends ToolkitModule {
        key = 'CleanBaiduArticle'
        constructor() { super() }
        sheets = `
/*
 *
 * 展开百度搜索文章页
 * 2020-04-25 11:22:31
 *
 */
/* 展开更多搜索结果按钮 */ .mainContent { height: auto !important; }
/* 点击展开全文 */ .packupButton,
/* open APP */ .commentEmbed-backHomeCard,
/* open APP */ a[data-bdlog=news_interest] > div > span:first-child
    { display: none !important; }
`
        isEnable(evtName) {
            return ToolkitModule.isMobile && (location.origin === 'https://mbd.baidu.com' || location.origin.indexOf('baijiahao') > 0 || location.pathname.indexOf('baijiahao') > 0)
        }
        init(ctx) {
            Sheets.append(this.key, this.sheets)
        }
        onload(ctx) {
            ctx.loopUntil(() => {
                const relateLinks = document.querySelectorAll('a.relateFont')
                if (relateLinks && relateLinks.length) {
                    for (const link of relateLinks) {
                        link.parentNode.innerHTML = link.parentNode.innerHTML
                    }
                    return true
                }
            })()
        }
    }
    /**
     * 展开百度搜索首页
     */
    class CleanBaiduIndexModule extends ToolkitModule {
        key = 'CleanBaiduIndex'
        constructor() { super() }
        sheets = `
/*
 *
 * 搜索首页
 * 2020-04-25 11:22:31
 *
 */
/* 展开更多搜索结果按钮 */ .index-banner
    { display: none !important; }
`
        isEnable(evtName) {
            return ToolkitModule.isMobile &&
                (location.origin === 'https://m.baidu.com' || location.origin === 'https://www.baidu.com') &&
                location.pathname === '/'
        }
        init(ctx) {
            Sheets.append(this.key, this.sheets)
        }
    }
    /**
     * 展开百度搜索结果
     */
    class CleanBaiduSearchModule extends ToolkitModule {
        key = 'CleanBaiduSearch'
        constructor() { super() }
        sheets = `
/*
 * 搜索结果页
 * 2020-04-25 11:22:31
 */
/* 展开更多搜索结果按钮 */
.hint-fold-results-wrapper { height: auto: !important; }
/* 展开更多搜索结果背景 */
.hint-fold-results-wrapper > .hint-fold-results-box { display: none !important; }
/* 显示相关搜索box */
.se-page-relative { display: block !important; }
/* 显示翻页按钮 */
.se-page-controller { display: block !important; }
/* 仅显示底部LOGO部分 */
#page-copyright > div:not([m-name=logo]):not(#copyright) { display: none !important; }

/* 相关搜索 */ #relativewords .c-line-clamp1,
/* 其他人还在搜 */ .c-invoke-willshow-class,
/* 前往百度 APP 提示 */ #popupLead,
/* 影响浏览体验的底部弹窗 */ .egg-bubble,
/* 填问卷, 赢大奖? 呵呵 */ .se-ft-promlink
    { display: none !important; }
`
        isEnable(evtName) {
            return ToolkitModule.isMobile &&
                (location.origin === 'https://m.baidu.com' || location.origin === 'https://www.baidu.com') &&
                location.pathname.indexOf('/s') !== -1 &&
                location.search.indexOf('word=') > 0
        }
        init(ctx) {
            Sheets.append(this.key, this.sheets)
        }
    }
    /**
     * 工具类
     */
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
            this.log('触发钩子函数: ' + hook)
            Toolkit.modules.forEach(module => {
                const isEnable = module.isEnable(hook)
                if (isEnable) this.log(module.key + ' launch')
                isEnable && module[hook] && typeof module[hook] === 'function' && module[hook](this)
            })
        }
        log(...args) {
            console.log('%c[Mobile Cleaner] LOG: ', 'color:teal', ...args)
        }
        static delay(timeout = 200) {
            return new Promise(resolve => setTimeout(resolve, timeout))
        }
        loopUntil(fun, times = 30, timeout = 300) {
            return function () {
                const interval = setInterval(() => {
                    const res = fun()
                    // 到达最大执行次数或函数主体返回 true 则停止执行
                    if ((--times <= 0) || res) clearInterval(interval)
                }, timeout);
            }
        }
    }
    Toolkit.use(new CleanBaiduSearchModule())
    Toolkit.use(new CleanBaiduArticleModule())
    Toolkit.use(new CleanBaiduIndexModule())
    // Toolkit.use(new BlockShitApkModule())
    // Toolkit.use(new AllowBackModule())
    // Toolkit.use(new BlockOpenAppModule())
    window._$MobileCleanerToolkit = new Toolkit()
    window.addEventListener('DOMContentLoaded', () => window._$MobileCleanerToolkit.emitHook('onload'))
})();