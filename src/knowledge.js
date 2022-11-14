import React from "react";
import "./layout.css"
import "./knowledge.css"
import server from './server';
// import { VscTrash } from "react-icons/vsc";

const parse = require('html-react-parser');

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

        const delete_post = ()=> {
            if( window.confirm( "确认删除?" ) === true ){
                this.delete_post(post_id);
            }
        }

        return (
            <div onClick={(e) => { e.stopPropagation(); change_page(post_id) }} className="Nav_item container1" >
                {edit_mode ? <input onBlur={(event) => { commitMsg(event) }} defaultValue={title}></input> : <div onClick={(e) => { e.stopPropagation(); this.setState({ edit_mode: true }) }} >{title}</div>}
                <button onClick={(e) => { e.stopPropagation(); delete_post() }} >-</button>
            </div>
        )
    }
}

class NavItemGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            shrink: true,
            item_array: this.props.item_array,
            new_post: false
        }
    }

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

    show_new_post( title ) {

        const commitMsg = (event) => {

            this.setState({ new_post: false })

            this.new_post( title, event.target.value)
        }

        return (
            <>
                {this.state.new_post ? <div> <input onBlur={(event) => { commitMsg(event) }} ></input> </div> : null}
            </>
        )
    }

    delete_post(post_id) {
        let old_item_array = this.state.item_array
        let new_item_array = old_item_array.filter((item) => {
            return item.post_id !== post_id;
        })

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
                    {this.show_new_post( title )}
                    {
                        item_array.map((item, key) => {
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
        const nav_list = this.state.nav_list;

        const results = [];

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

class PostPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            edit_mode: false,
            innerHtml: props.post_info.innerHtml,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("componentDidUpdate")
    }

    render() {

        const { edit_mode, innerHtml } = this.state;

        const keyUpWithEditor = (event) => {

            if (event.code !== "Escape") {
                return
            }

            this.setState({
                edit_mode: false,
            })

            server.UpdateKnowledgePost(this.props.post_info.post_id, this.state.innerHtml, null)
        }

        const OnInput = (obj) => {
            this.setState({
                innerHtml: obj.target.value
            })
        }

        return (
            <div className="post container2" >
                {edit_mode ? (<div className="postEditor item" >   <textarea onKeyUp={keyUpWithEditor} onInput={OnInput} value={innerHtml}></textarea> </div>) : null}
                <div className="item"><div onDoubleClick={() => { this.setState({ edit_mode: true }) }} className="postView" ><div id="content"> {parse(innerHtml ? innerHtml : "")} </div></div></div>
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

        var req = {};
        req.post_id = post_id;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        };

        fetch('/daka/api/knowledge/post/get', requestOptions)
            .then(response => response.json())
            .then((data) => {
                // console.log("get from server:", data.Data[0])
                this.setState({ post_info: data.Data[0] })

            });
    }

    render() {
        const { post_info } = this.state
        return (
            <div>
                <button onClick={() => this.props.backup()} >返回首页</button>
                <div className="container1" >
                    <Nav change_page={this.change_page.bind(this)} />
                    {post_info.post_id > 0 ? <PostPage key={post_info.post_id} post_info={post_info} /> : null}
                </div>
            </div>
        )
    }
}

export default Knowledge; 