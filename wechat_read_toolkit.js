// ==UserScript==
// @name         微信读书工具箱 | wechat read toolkit
// @namespace    SublimeCT
// @icon         https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/appleTouchIcon/apple-touch-icon-152x152.png
// @version      1.0.0
// @description  在搜索结果中显示评分及评分人数 
// @author       Sven
// @license      MIT
// @match        https://weread.qq.com/web/reader/6b232d105e042e6b2c5a1ec#search
// @require      https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

; (() => {
  class ToolkitModule {
    constructor() { }
    isActive = true
  }
  /**
   * Breaking Ajax
   */
  class BreakingModule extends ToolkitModule {
    constructor() { super() }
    init(ctx) {
      const _this = this
      ah.proxy({
        onResponse(response, handler) {
          console.log('??')
          if (response.config.url.indexOf('/web/search/global?keyword=') === 0) {
            console.log('dkajlsfjeiojio')
            _this.appendBookInfo(ctx, JSON.parse(response.response))
          }
          handler.next(response)
        }
      })
    }
    getSearchResultEl() { return document.querySelector('ul.search_result_global_list') }
    getSearchResultFirstChildEl() { return document.querySelector('ul.search_result_global_list > li') }
    get searchInput() { return document.querySelector('.search_input') }
    async appendBookInfo(ctx, response) {
      // 1. 当前页面中必须存在搜素框
      if (!this.searchInput) return
      await Toolkit.waitDOMLoaded(this.getSearchResultFirstChildEl, 100)
      const searchResultEl = this.getSearchResultEl()
      if (!searchResultEl) return ctx.log('Search result not found')
      ctx.log(searchResultEl)
      for (let bookElIndex = searchResultEl.children.length; bookElIndex--;) {
        const bookEl = searchResultEl.children[bookElIndex]
        const bookInfo = response.books[bookElIndex].bookInfo
        const newRatingEl = this.getNewRatingEl(bookInfo)
        const titleEl = bookEl.querySelector('.search_result_global_bookTitle')
        ctx.log(titleEl)
        titleEl.insertBefore(newRatingEl, titleEl.childNodes[0])
      }
    }
    getNewRatingEl(bookInfo) {
      const el = document.createElement('span')
      const rating = bookInfo.newRating === undefined ? '' : parseFloat(bookInfo.newRating / 10).toFixed(2)
      el.innerText = rating
      el.style.color = `rgba(255, 133, 237, ${Math.max(0.65, Number(rating) / 100)})`
      el.style.marginRight = '15px'
      el.style.fontSize = Math.max(14, 40 * Number(rating) / 100) + 'px'
      if (Number(rating) > 73) el.style.fontWeight = 'bolder'
      el.style.fontFamily = 'PingFang SC,-apple-system,SF UI Text,Lucida Grande,STheiti,Microsoft YaHei,sans-serif'
      return el
    }
    onload(ctx) {
      ctx.log('onload')
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
      console.log('%c[WechatRead Toolkit] LOG: ', 'color:teal', ...args)
    }
    static delay(timeout = 200) {
      return new Promise(resolve => setTimeout(resolve, timeout))
    }
    static async waitDOMLoaded(domGetter, times = 20) {
      for (;times--;) {
        await Toolkit.delay(100)
        console.log(domGetter())
        if (domGetter()) break
      }
    }
  }
  Toolkit.use(new BreakingModule())
  window._$WechatReadToolkit = new Toolkit()
  window.addEventListener('DOMContentLoaded', () => window._$WechatReadToolkit.emitHook('onload'))
})();