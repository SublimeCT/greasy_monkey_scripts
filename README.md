# 这里是一些自己瞎写的油猴脚本

## 1. CSDN 去广告沉浸阅读模式
沉浸阅读模式, [详情](https://greasyfork.org/zh-CN/scripts/373457-csdn-%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%B2%89%E6%B5%B8%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F)

- 点击右下角小齿轮设置背景图片
- 屏蔽广告
- 移除与正文无关的 sidebar & header
- 正文部分宽度放大
- 绕过阅读更多按钮; 直接展开正文内容
- 增强广告屏蔽，建议使用 ABP 等插件屏蔽广告，还可以明显提升页面加载速度
- 屏蔽登录弹窗
- 增加随机背景图并设置透明度
- 移除点击文章中的链接拦截, 直接跳转到目标链接, 建议使用鼠标中键在新窗口打开链接!
- 解除跳转拦截

### 1.1 调试
```
.
├── baidu_image_categorys.json      [output] 图片类目 json
├── baidu_image.js                  source code
├── baidu_image_map.json            [output] 图片 id: name 映射
└── baidu_images.json               [input] 百度 API response 原始数据
```

```bash
curl -o baidu_images.json https://www.baidu.com/home/skin/data/skin # 从百度服务器获取背景图片 json
node baidu_image.js # 转换数据, 将会更新 `baidu_image_categorys.json` & `baidu_image_map.json`
```

## 2. dark_mode++
降低页面亮度, 可手动调节(通过 `q` 降低 / `w` 提升)亮度 , [详情](https://greasyfork.org/zh-CN/scripts/376268-dark)

## 3. baidu_translate_hot_key_tool
百度翻译快捷键插件, [详情](https://greasyfork.org/zh-CN/scripts/373456-baidu-translate-hot-key-tool)

- ctrl+meta+up 聚焦搜索框
- ctrl+meta+left 搜索内容发音
- ctrl+meta+right 翻译结果发音
