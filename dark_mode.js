// ==UserScript==
// @name         Dark
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       sevn
// @include      https://*
// @include      http://*
// @grant        none
// ==/UserScript==z
window._sven_load = window.onload;
window.onload = function(){
    typeof window._sven_load === 'function' ? window._sven_load() : null;
    (function(config){
        // 忽略 URL
        for (var mode in config.ignore) {
            if (config.ignore[mode]()) {
                return false;
            }
        }

        // 调整背景色
        var setBackgroundColor = (function(){
            // 记录页面加载时的所有dom元素
            var _cache = {
                dark: null,
                darkPlus: null
            };
            var _doms = [];
            return function(color){
                if (_cache[config.mode]) {
                    _doms = _cache[config.mode];
                } else {
                    _doms = document.querySelectorAll(config.elements[config.mode]);
                }
                for (var i=0, dom;dom=_doms[i++];) {
                   if (dom) {
                       dom.style.backgroundColor=color;
                   }
                }
            }
        })();
        setBackgroundColor('rgb('+config.rgbValue+','+config.rgbValue+','+config.rgbValue+')');
        // 热键
        document.addEventListener("keydown", function(event){
            var keyCode = {
                '87': {// 增加亮度
                    method: function(){
                        if (config.rgbValue<=245) {
                            config.rgbValue += 10;
                            keyCode._setColor();
                        }
                    }
                },
                '81': {// 降低亮度
                    method: function(){
                        if (config.rgbValue>=10) {
                            config.rgbValue -= 10;
                            keyCode._setColor();
                        }
                    }
                },
                '192': {// 切换到强力模式
                    method: function(){
                        config.mode = 'darkPlus';
                        keyCode._setColor();
                    }
                },
                _setColor: function(){
                    var color = 'rgb('+config.rgbValue+','+config.rgbValue+','+config.rgbValue+')';
                    setBackgroundColor(color);
                }
            };
            if (typeof keyCode[event.keyCode] === 'undefined') {
                return false;
            }
            keyCode[event.keyCode].method();
        })
    })({
        elements: {
            dark: 'body,div.article,div.article_body,div#main,article,section,div.main,div#article_details,div.project-body,div.aw-content-wrap.clearfix,div.catalog-body.active,main,div.List,div.head_inner,div#container,div.content,div.pb_content,div.p_postlist,div#head,div.p_content,div.l_post,div#content,div#sidebar',
            darkPlus: 'body :not(script):not(style)'
        },
        ignore: {
            general: function(){// 普通URL匹配
                var urls = ['www.zybuluo.com', 'docs.golaravel.com', 'http://192.168.1.9:18081'];
                var isExists = false;
                urls.forEach(url => {
                    if(location.href.indexOf(url) >= 0) {
                        isExists = true;
                        return false;
                    }
                });
                return isExists;
            },
            strict: function(){// 完全匹配
                var urls = ['https://www.baidu.com/', 'https://www.google.com/'];
                var isExists = false;
                urls.forEach(url =>{
                    if(location.href === url) {
                        isExists = true;
                        return false;
                    }
                });
                return isExists;
            }
        },
        rgbValue: 190,
        mode: 'dark'
    });
};
// Your code here...