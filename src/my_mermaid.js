/*  
mermaid概述：

    因为这个mermaid包是经过修改的，所以从源码链接这个包
这个包的工程结构是一个外面一个大包（@xiezg/mermaid），里面在包含两个包，其中一个就是mermaid
通过观察从npm.org下载的包，也是这个子包：mermaid，所以应该使用的这个子包（mermaid），而不是外面的父包(@xiezg/mermaid)

引用本地的mermaid包：

使用本地的包需要使用npm link，该命令分为两部
    1、cd lib/mermaid/packages/mermaid,然后执行npm link
    2、在daka-ui 包目录下执行 npm mermaid
    这样就可以使用 import mermaid from "mermaid"
    虽然 package.json 文件中没有引入该 mermaid包，但是node_modules中有该包的软链接 `mermaid -> ../lib/mermaid/packages/mermaid`

编译：
    编译mermaind可以在父包执行make,子包也会自动进行编译。
    如果编译失败，可以将daka-ui的 node_modules和 父包 @xiezg/mermaid的node_modules全部删除，目前遇到的编译错误，都可以解决。

环境：
    node:18.17
*/

import mermaid from "mermaid";

const render_container = document.getElementById('mermaid_tmp_render')


//经过测试，该模块在多个地方被引用，但是仅初始化一次

// window.alert('mermaid.initialize')

mermaid.initialize({
    startOnLoad: false,
    logLevel: 5,
    securityLevel: 'loose',
    gantt: {
        fontSize: 16,
        sectionFontSize: 14,
        useMaxWidth: true,
        barHeight: 18,
        // titleTopMargin: 25,
        // topPadding: 40,
        // fontFamily: 'STHupo',
        axisFormat: '%m/%d',
    }
});

//render 参数
// first: id 随便一个不重复的就一个，svg的 id根据这个ID来设置
// second: txt: 文本内容
// third: cb 结果回调函数，可以不写
// forth： render的临时中间div，可以不写，但是容易出错，最好写一个

export default function MermaidRender(svgMsg, ErrorMsg) {

    try {
        return mermaid.render("id" + Date.now(), svgMsg, render_container)
    }
    catch (e) {
        return mermaid.render("id" + Date.now(), ErrorMsg, render_container)
    }
}
