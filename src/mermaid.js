var mermaid = require('@xiezg/mermaid')

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

export default function MermaidRender(svgMsg, ErrorMsg, grant_cb) {

    try {
        return mermaid.render("id" + Date.now(), svgMsg, grant_cb, render_container)
    }
    catch (e) {
        return mermaid.render("id" + Date.now(), ErrorMsg, undefined, render_container)
    }
}
