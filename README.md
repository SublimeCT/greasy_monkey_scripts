# 这里是一些自己瞎写的油猴脚本

*dark_mode*
---
这是个可以自定义部分背景元素背景色的夜间模式

*baidu_key_tool [立即安装](https://greasyfork.org/zh-CN/scripts/33823-%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%8A%A9%E6%89%8B)*
---
### 功能描述
* 快捷键
    - 按序号跳转搜索结果页面, 支持固定模式开关键(on/off),小键盘数字键跳转
    - 快速定位搜索框, 支持固定模式开关键(on/off),指定键(默认小键盘中的 . )跳转
* 样式修改
    - 页面加载完毕后为所有搜索结果增加序号

![2017-10-08 19-31-43屏幕截图.png](https://i.loli.net/2017/10/08/59da0cc1bdab9.png)
### 使用姿势
* 按序号跳转搜索结果
    - 默认使用小键盘 `数字键` 跳转对应序号链接
    
* 定位搜索框
    - 默认使用小键盘小数点 `.` 使搜索框获得焦点并选中所选内容
    - 如果修改搜索框中的内容后搜索结果即时刷新, 这时又想通过序号跳转搜索结果  
    就需要先按下 `tab` 键使搜索框失去焦点, 不然的话按下 `数字键` (默认) 会在搜索框里显示输入的数字~
    - 没安装本脚本前直接 ctrl+z 也可以实现, 但是可能要按好多次, 好烦~
    
* 其他原生姿势(Chrome)
    - 滚动页面  
        `PageUp` / `PageDown`
        `up` / `down`
        `Home` / `End`
    - 关闭页面
        `ctrl+w`
    - 切换选项卡
        `ctrl+PageUp` / `ctrl+PageDown`
    - 新标签页
        `ctrl+t`
    - 新标签页中打开链接
        `鼠标中键`[还可用来关闭标签页]
    - 前进 / 后退
        `alt+left` / `alt+right`

### 计划新增功能
- V0.1.0
    1. 构建任意组合键触发行为
    2. 创建行为统一接口类
    3. ~~通过创建单独的 `event` 并手动触发实现鼠标中键事件[实现新标签页打开, 同时页面保持在搜索结果页]~~ 经测试, 该方案无法实现
- V0.2.0
    1. 支持通过录入按键修改快捷键[目前需要在代码中修改 `keyCode`]
    2. 将用户自定义的 `keyCode` 保存至 `localStorage`
    3. 录入按键时页面中显示 `keyCode`

### 更新记录
- V0.0.4
    - 修复已知 Bug
        - 正在输入时按下快捷键时出发对应行为
        - 翻页后渲染序号失败
    - 完善文档描述

- V0.0.3
    - 完善文档及描述
    - 分离 `option` 与 `action`
    - 优化数据结构