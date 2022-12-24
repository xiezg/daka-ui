import React from "react";
import "./layout.css"
import "./knowledge.css"
import server from './server';
import parse, { domToReact } from 'html-react-parser';
import SyntaxHighlighter from 'react-syntax-highlighter';
import MermaidRender from "./mermaid";
import { BarChart, Normal, Pie, StackedAreaChart } from "./echarts"
import YAML from 'yaml'
import { createContext } from "react";

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
                (data)=>
                <div onClick={(e) => { e.stopPropagation(); change_page(post_id) }} className={ data === post_id ? "Nav_item_active container1" : "Nav_item container1"} >
                    {edit_mode ? <input onBlur={(event) => { commitMsg(event) }} defaultValue={title}></input> : <div onClick={(e) => { this.setState({ edit_mode: data === post_id }) }} >{title}</div>}
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

        console.log({ old_item_array, new_item_array })
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

        const language = this.props.language ? this.props.language : "bash";

        console.log(typeof this.props.children)
        return (
            <SyntaxHighlighter language={language} style={this.props.style} showLineNumbers={true}>
                {typeof this.props.children === "string" ? this.props.children.trim() : ""}
            </SyntaxHighlighter>
        );
    }
}

class PostPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            edit_mode: props.post_info.innerHtml === null || props.post_info.innerHtml === "",
            innerHtml: props.post_info.innerHtml,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("componentDidUpdate")
    }

    render() {

        const style = styleArray[Math.floor((Math.random() * styleArray.length))];

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

        const options = {
            replace: ({ name, attribs, children }) => {

                if (name === "code") {
                    return <CodeBlack style={style} language={attribs.language} children={domToReact(children, options)} />
                } else if (name === "mermaid") {
                    //<mermaid>包含的字符串是 array[0].data
                    if (children.length === 0) {
                        return
                    }
                    const svg = MermaidRender(children[0].data, ErrorMsg)
                    return (<div dangerouslySetInnerHTML={{ __html: svg }}></div>)
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
                }
            }
        };

        return (
            <div className="post container2" >
                {edit_mode ? (<div className="postEditor item" >   <textarea onKeyUp={keyUpWithEditor} onInput={OnInput} value={innerHtml}></textarea> </div>) : null}
                <div className="item"><div onDoubleClick={() => { this.setState({ edit_mode: true }) }} className="postView" ><div id="content"> {parse(innerHtml ? innerHtml : "", options)} </div></div></div>
            </div>
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
                    <button onClick={() => this.props.backup()} >返回首页</button>
                    <div className="container1 knowledge_body" >
                        <Nav change_page={this.change_page.bind(this)} />
                        {post_info.post_id > 0 ? <PostPage key={post_info.post_id} post_info={post_info} /> : null}
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Knowledge; 