import React, { useLayoutEffect } from "react";
import "./layout.css"
import "./knowledge.css"
import server from './server';
import parse, { domToReact } from 'html-react-parser';
import SyntaxHighlighter from 'react-syntax-highlighter';
import MermaidRender from "./my_mermaid";
import { BarChart, Pie, StackedAreaChart } from "./components/Echarts"
import YAML from 'yaml'
import { createContext } from "react";
import Countdown from "./countdown";
import moment from "moment";
import ErrorBoundary from "./ErrorBoundary";

import Gantt from './components/Gantt';
import ExampleComponent from './components/Excel'
import Toolbar from './components/Toolbar';
import MessageArea from './components/MessageArea';

import { wait } from "@testing-library/user-event/dist/utils";
import light from "react-syntax-highlighter/dist/cjs/light";

const { Provider, Consumer } = createContext()

const ErrorMsg = 'gantt\ntitle 出错啦!!!❌';
var hljs = require('react-syntax-highlighter/dist/esm/styles/hljs')

const styleArray = [
    hljs.a11yDark,
    hljs.a11yLight,
    hljs.agate,
    hljs.anOldHope,
    hljs.androidstudio,
    hljs.arduinoLight,
    hljs.arta,
    hljs.ascetic,
    hljs.atelierCaveDark,
    hljs.atelierCaveLight,
    hljs.atelierDuneDark,
    hljs.atelierDuneLight,
    hljs.atelierEstuaryDark,
    hljs.atelierEstuaryLight,
    hljs.atelierForestDark,
    hljs.atelierForestLight,
    hljs.atelierHeathDark,
    hljs.atelierHeathLight,
    hljs.atelierLakesideDark,
    hljs.atelierLakesideLight,
    hljs.atelierPlateauDark,
    hljs.atelierPlateauLight,
    hljs.atelierSavannaDark,
    hljs.atelierSavannaLight,
    hljs.atelierSeasideDark,
    hljs.atelierSeasideLight,
    hljs.atelierSulphurpoolDark,
    hljs.atelierSulphurpoolLight,
    hljs.atomOneDarkReasonable,
    hljs.atomOneDark,
    hljs.atomOneLight,
    hljs.brownPaper,
    hljs.codepenEmbed,
    hljs.colorBrewer,
    hljs.darcula,
    hljs.dark,
    hljs.defaultStyle,
    hljs.docco,
    hljs.dracula,
    hljs.far,
    hljs.foundation,
    hljs.githubGist,
    hljs.github,
    hljs.gml,
    hljs.googlecode,
    hljs.gradientDark,
    hljs.gradientLight,
    hljs.grayscale,
    hljs.gruvboxDark,
    hljs.gruvboxLight,
    hljs.hopscotch,
    hljs.hybrid,
    hljs.idea,
    hljs.irBlack,
    hljs.isblEditorDark,
    hljs.isblEditorLight,
    hljs.kimbieDark,
    hljs.kimbieLight,
    hljs.lightfair,
    hljs.lioshi,
    hljs.magula,
    hljs.monoBlue,
    hljs.monokaiSublime,
    hljs.monokai,
    hljs.nightOwl,
    hljs.nnfxDark,
    hljs.nnfx,
    hljs.nord,
    hljs.obsidian,
    hljs.ocean,
    hljs.paraisoDark,
    hljs.paraisoLight,
    hljs.pojoaque,
    hljs.purebasic,
    hljs.qtcreatorDark,
    hljs.qtcreatorLight,
    hljs.railscasts,
    hljs.rainbow,
    hljs.routeros,
    hljs.schoolBook,
    hljs.shadesOfPurple,
    hljs.solarizedDark,
    hljs.solarizedLight,
    hljs.srcery,
    hljs.stackoverflowDark,
    hljs.stackoverflowLight,
    hljs.sunburst,
    hljs.tomorrowNightBlue,
    hljs.tomorrowNightBright,
    hljs.tomorrowNightEighties,
    hljs.tomorrowNight,
    hljs.tomorrow,
    hljs.vs,
    hljs.vs2015,
    hljs.xcode,
    hljs.xt256,
    hljs.zenburn
]

class NavItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit_mode: false,
            title: this.props.title,
        }
    }

    delete_post(post_id) {
        server.DeleteKnowledgePost(post_id, (data) => {
            this.props.delete_post(post_id)
        })
    }

    render() {

        const { edit_mode, title } = this.state;
        const { post_id, change_page } = this.props;

        const commitMsg = (event) => {
            const new_title = event.target.value;

            this.setState({ edit_mode: false, title: new_title })
            server.UpdateKnowledgePost(post_id, null, new_title)
        }

        const delete_post = () => {
            if (window.confirm("确认删除?") === true) {
                this.delete_post(post_id);
            }
        }

        return (
            <Consumer>{
                (data) =>
                    <div onClick={(e) => { e.stopPropagation(); change_page(post_id) }} className={data === post_id ? "Nav_item_active container1" : "Nav_item container1"} >
                        {edit_mode ?
                            <input onBlur={(event) => { commitMsg(event) }} defaultValue={title}></input>
                            : <div onClick={(e) => { this.setState({ edit_mode: data === post_id }) }} >{title}</div>}
                        <button onClick={(e) => { e.stopPropagation(); delete_post() }} >-</button>
                    </div>
            }
            </Consumer>
        )
    }
}

class NavItemGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            shrink: true,
            // shrink: false,
            item_array: this.props.item_array,
            new_post: false
        }
    }

    //新建POST
    new_post(category, title) {

        if (title === "" || category === "") {
            return
        }

        server.NewKnowledgePost(title, category, (data) => {
            let old_item_array = this.state.item_array


            old_item_array.push({
                'post_id': data.Data.post_id,
                'title': title
            })

            this.setState({ item_array: old_item_array })
        })
    }

    show_new_post(title) {

        const commitMsg = (event) => {

            this.setState({ new_post: false })

            this.new_post(title, event.target.value)
        }

        return (
            <>
                {this.state.new_post ? <div> <input onBlur={(event) => { commitMsg(event) }} ></input> </div> : null}
            </>
        )
    }

    //这里有BUG，删除某一项，然后最后一项被删除，经测试，还是貌似没有刷新
    delete_post(post_id) {
        let old_item_array = this.state.item_array
        let new_item_array = old_item_array.filter((item) => {
            return item.post_id !== post_id;
        })

        // console.log({ old_item_array, new_item_array })
        this.setState({ item_array: new_item_array })
    }

    render() {
        const { title, change_page } = this.props;
        const { item_array } = this.state

        return (
            <div className="Nav_group">
                <div className="Nav_title container1" onClick={() => { this.setState({ shrink: !this.state.shrink }) }} >
                    {title}
                    <button onClick={(e) => { e.stopPropagation(); this.setState({ new_post: true }) }} >+</button>
                </div>
                <div className={this.state.shrink ? 'Nav_group_shrink' : 'Nav_group_expand'} >
                    {this.show_new_post(title)}
                    {
                        item_array.map((item, key) => {
                            // console.log( "render map", {item,key} )
                            return <NavItem key={key} post_id={item.post_id} title={item.title} change_page={change_page} delete_post={this.delete_post.bind(this)} />
                        })
                    }
                </div>

            </div>
        )
    }
}

class Nav extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nav_list: new Map()//{ "mysql": ['rep', 'perf'], 'os': ['linx', 'win'] }
        }
    }

    componentDidMount() {
        server.ListKnowledgePost((data) => {
            var myMap = new Map()

            data.Data.map((item) => {
                let obj = myMap.get(item.category);
                if (obj === undefined) {
                    obj = []
                }
                obj.push({
                    'post_id': item.post_id,
                    'title': item.title
                })

                myMap.set(item.category, obj)

                return true
            })

            this.setState({ nav_list: myMap })
        })
    }

    render() {
        const results = [];
        const nav_list = this.state.nav_list;

        nav_list.forEach((value, key) => {
            results.push(<NavItemGroup change_page={this.props.change_page} item_array={value} title={key} key={key} />)
        });

        return (
            <div className="nav" >
                {results}
            </div>
        );
    }
}

class CodeBlack extends React.Component {

    render() {
        return (
            <SyntaxHighlighter language={this.props.language ? this.props.language : "bash"} style={this.props.style} showLineNumbers={true}>
                {typeof this.props.children === "string" ? this.props.children.trim() : ""}
            </SyntaxHighlighter>
        );
    }
}

class MyMermaidDig extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            svg: ""
        }
    }

    componentDidMount() {
        MermaidRender(this.props.txt, ErrorMsg)
            .then((r, e) => {
                this.setState({
                    svg: r.svg
                })
            })
            .catch( err=>{
                console.error( err )
            } )
    }

    render() {
        return (<div dangerouslySetInnerHTML={{ __html: this.state.svg }}></div>)
    }
}

class QAItem extends React.Component {

    render() {
        const results = [];

        const keys = Object.keys(this.props.msg);
        keys.forEach(key => {
            const value = this.props.msg[key];

            if (key === "title") {
                results.push(<h3>{value}</h3>)
            } else {
                results.push(<div> {key}:<br /><p>{value}</p></div>)
            }

        });

        return (
            <>
                {results}
            </>
        )
    }
}

class PartLayout extends React.Component {

    render() {
        return (<div className="partLayout" >
            <span>{this.props.index}</span>
            {this.props.children}
        </div>)
    }
}

class PostPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            edit_mode: props.post_info.innerHtml === null || props.post_info.innerHtml === "",
            innerHtml: props.post_info.innerHtml,
            currentZoom: 'Days',
            messages: [],
            style: styleArray[Math.floor((Math.random() * styleArray.length))],
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("componentDidUpdate")
    }

    addMessage(message) {
        const maxLogLength = 5;
        const newMessage = { message };
        const messages = [
            newMessage,
            ...this.state.messages
        ];

        if (messages.length > maxLogLength) {
            messages.length = maxLogLength;
        }
        this.setState({ messages });
    }

    handleZoomChange = (zoom) => {
        this.setState({
            currentZoom: zoom
        });
    }

    logDataUpdate = (type, action, item, id) => {
        let text = item && item.text ? ` (${item.text})` : '';
        let message = `${type} ${action}: ${id} ${text}`;
        if (type === 'link' && action !== 'delete') {
            message += ` ( source: ${item.source}, target: ${item.target} )`;
        }
        this.addMessage(message);
    }

    render() {
        // const style = styleArray[Math.floor((Math.random() * styleArray.length))];
        const { edit_mode, innerHtml } = this.state;
        const keyUpWithEditor = (event) => {
            if (event.code !== "Escape") {
                return
            }

            this.setState({
                edit_mode: false,
            })

            if (this.props.post_info.innerHtml !== this.state.innerHtml) {
                server.UpdateKnowledgePost(this.props.post_info.post_id, this.state.innerHtml, null)
            }
        }

        const OnInput = (obj) => {
            this.setState({
                innerHtml: obj.target.value
            })
        }

        function parseCSSString(cssString) {
            var styles = {};

            // 使用正则表达式匹配样式属性和值
            var regex = /([\w-]+)\s*:\s*([^;]+)/g;
            var match;

            while ((match = regex.exec(cssString)) !== null) {
                var property = match[1].trim();
                var value = match[2].trim();

                // 将属性和值添加到样式对象中
                styles[property] = value;
            }

            return styles;
        }

        // {domToReact(children, options)} 获取的children对象是js原生对象

        let part_num = 0;

        const options = {
            replace: ({ name, attribs, children }) => {

                if (name === "code") {
                    let MyStyle = {}
                    if (attribs.style) {
                        MyStyle = parseCSSString(attribs.style)
                    }

                    return (
                        <div style={MyStyle} >
                            <CodeBlack style={this.state.style} language={attribs.language} children={domToReact(children, options)} />
                        </div>
                    )
                } else if (name === "overview") {
                    console.log("overview", children[0].data)
                    return (
                        <div className="overview">
                            {domToReact(children, options)}
                        </div>
                    )
                } else if (name === 'part') {
                    part_num = part_num + 1
                    console.log("part_num:", part_num)
                    return <PartLayout index={part_num} children={domToReact(children, options)} />
                }
                else if (name === 'card') {
                    console.log("card", children)
                    return (
                        <div className="card" >
                            {domToReact(children, options)}
                        </div>
                    )
                }
                else if (name === "qa") {
                    if (!children[0]) {
                        return
                    }

                    try {
                        let data = YAML.parse(children[0].data)
                        if (data && data.length > 0) {
                            // console.log( "qa", data)
                            return (
                                <>
                                    <h2>Q&A</h2>
                                    <ol>
                                        <React.Fragment> {
                                            data.map(item => {
                                                if (item) {
                                                    return <li> <QAItem msg={item} /> </li>
                                                }
                                            })
                                        }
                                        </React.Fragment>
                                    </ol>
                                </>
                            )
                        }
                    } catch (e) {
                        console.error(e)
                        return;
                    }
                }
                else if (name === "mermaid") {
                    //<mermaid>包含的字符串是 array[0].data
                    if (children.length === 0) {
                        return
                    }

                    return <MyMermaidDig txt={children[0].data.trim()}></MyMermaidDig>
                    // MermaidRender(children[0].data.trim(), ErrorMsg).then( (r,e)=>{
                    //     console.log( r.svg )
                    // } )
                    // return (<div dangerouslySetInnerHTML={{ __html: "" }}></div>)
                } else if (name === "echarts") {
                    let data = null

                    try {
                        data = YAML.parse(children[0].data)
                    } catch (e) {
                        console.error(e)
                        return;
                    }

                    switch (attribs.type) {
                        case "pie":
                            return <Pie title={attribs.title} data={data} />
                        case "stacked_area_chart":
                            return <StackedAreaChart title={attribs.title} data={data} />
                        case "bar":
                            return <BarChart title={attribs.title} data={data} />
                        default:
                            return;//<Pie title={ attribs.title } data={ YAML.parse( children[0].data ) } />
                    }
                } else if (name === 'countdown') {
                    let data = null

                    try {
                        data = YAML.parse(children[0].data)
                    } catch (e) {
                        console.error(e)
                        return;
                    }

                    return <Countdown data={data} ></Countdown>
                } else if (name === 'gantt') {
                    const { currentZoom, messages } = this.state;

                    const data = {
                        data: [
                            { id: 1, text: 'Task #1', start_date: '2019-04-15', duration: 3, progress: 0.6 },
                            { id: 2, text: 'Task #2', start_date: '2019-04-18', duration: 3, progress: 0.4 }
                        ],
                        links: [
                            { id: 1, source: 1, target: 2, type: '0' }
                        ]
                    };

                    return (
                        <div style={{ "height": "300px" }} >
                            <div className="zoom-bar">
                                <Toolbar
                                    zoom={currentZoom}
                                    onZoomChange={this.handleZoomChange}
                                />
                            </div>
                            <div className="gantt-container">
                                <Gantt
                                    tasks={data}
                                    zoom={currentZoom}
                                    onDataUpdated={this.logDataUpdate}
                                />
                            </div>
                            <MessageArea
                                messages={messages}
                            />
                        </div>

                        //     <div className="gantt-container" onDoubleClick={(event) => { event.stopPropagation(); }}  >
                        //         <Gantt tasks={data}/>
                        //     </div>
                    );
                } else if (name === 'excel') {
                    return (
                        <ExampleComponent></ExampleComponent>
                    )
                }
            }
        };

        const handlePaste = (event) => {
            const clipboardData = event.clipboardData || window.clipboardData;
            const items = clipboardData.items;

            // 遍历黏贴数据中的所有项目
            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                // 如果是文件类型并且是图片
                if (item.kind === 'file' && item.type.includes('image')) {
                    const file = item.getAsFile();
                    const formData = new FormData();
                    formData.append('image', file, file.name);

                    // 使用 fetch 方法发送 FormData 到服务端进行上传
                    fetch('/daka/api/fs/add', {
                        method: 'POST',
                        body: formData
                    }).then(res => {
                        console.log('Uploaded successfully:', res);
                    }).catch(error => {
                        console.error('Upload failed:', error);
                    });

                    // 中止事件以避免浏览器默认行为
                    event.preventDefault();
                    break;
                }
            }
        }

        return (
            <div className="post container2" >
                {edit_mode ? (<div className="postEditor item" >   <textarea onPaste={handlePaste} onKeyUp={keyUpWithEditor} onInput={OnInput} value={innerHtml}></textarea> </div>) : null}
                <div className="item">
                    <div onDoubleClick={() => { this.setState({ edit_mode: true }) }} >
                        <PostMetadata post_info={this.props.post_info} ></PostMetadata>
                        <ErrorBoundary key={moment().unix()} >
                            <div id="content"> {parse(innerHtml ? innerHtml : "", options)} </div>
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        )
    }
}

class PostMetadata extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tips: false
        }
    }

    render() {
        return (
            <>
                <div className="post_title" > {this.props.post_info.title}</div>

                <div className="post_metadata">
                    <div style={{ display: 'inline', position: 'relative' }} onMouseEnter={() => { this.setState({ tips: true }) }} onMouseLeave={() => { this.setState({ tips: false }) }} >
                        <div className={this.state.tips ? "post_metadata_tips" : "post_metadata_no_tips"} >
                            <div>发布时间：{moment.unix(this.props.post_info.create_time).format("YYYY-MM-DD HH:mm:ss")}
                                <br />has gone：{moment().diff(moment.unix(this.props.post_info.create_time), 'days')} 天
                            </div>
                            <div>更新时间：{moment.unix(this.props.post_info.last_modify_time).format("YYYY-MM-DD HH:mm:ss")}
                                <br />has gone：{moment().diff(moment.unix(this.props.post_info.last_modify_time), 'days')} 天
                            </div>
                        </div>
                        <div>发布时间：{moment.unix(this.props.post_info.create_time).format("YYYY-MM-DD")} </div>
                        <div>更新时间：{moment.unix(this.props.post_info.last_modify_time).format("YYYY-MM-DD")} </div>
                        <div>累计修改：{this.props.post_info.modify_count} </div>
                    </div>
                </div>
            </>
        )
    }
}

class Knowledge extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            post_info: {
                post_id: -1,
            }
        }
    }

    change_page(post_id) {

        server.GetKnowledgePost(post_id, (data) => {
            this.setState({ post_info: data.Data[0] })
        })
    }

    render() {
        const { post_info } = this.state
        return (
            <Provider value={post_info.post_id}>
                <div>
                    <header></header>
                    <button onClick={() => this.props.backup()} >返回首页</button>

                    <div className="container1 knowledge_body" >
                        <Nav change_page={this.change_page.bind(this)} />
                        {post_info.post_id > 0 ? <PostPage key={post_info.post_id} post_info={post_info} /> : null}
                    </div>
                    <header></header>
                </div>
            </Provider>
        )
    }
}

export default Knowledge; 