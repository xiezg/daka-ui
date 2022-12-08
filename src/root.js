import React from 'react';
import "./root.css"
import TaskList from './work_task_list';
import Knowledge from './knowledge';
import OnlineTools from './online_tools'

const PAGE_ID_WORK_TASK = "task_list"
const PAGE_ID_KNOWLEDGE = "knowledge"
const PAGE_ID_ONLINE_TOOLS = "online_tools"
const PAGE_ID_INIT = "init"

class Module extends React.Component {

    render() {
        const { open_page,title } = this.props;
        return (
            <div className='module' onClick={ ()=> open_page() } >
                {title}
            </div>
        )
    }
}

class ModuleList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: PAGE_ID_INIT
        }
    }

    show_online_tools(){
        return <OnlineTools backup={ this.set_init.bind(this) } />
    }

    show_work_list() {
        return <TaskList backup={ this.set_init.bind(this) } />
    }

    show_knowledge() {
        return <Knowledge backup={ this.set_init.bind(this) } />
    }

    show_init() {
        return (
            <div className='root'>
                <div className='search'>
                    <button>search</button>
                    <input type="text" />
                </div>
                <div className='moduleList'>
                    <Module title='WorkList' open_page={ this.set_work_list.bind(this) } />
                    <Module title='Note' open_page={ this.set_knowledge.bind(this) } />
                    <Module title='online_tools' open_page={ this.set_online_tools.bind(this) } />
                </div>
            </div>
        )
    }

    set_work_list() {
        this.setState({
            page: PAGE_ID_WORK_TASK
        })
    }

    set_online_tools(){
        this.setState({
            page: PAGE_ID_ONLINE_TOOLS
        })
    }

    set_knowledge() {
        this.setState({
            page: PAGE_ID_KNOWLEDGE
        })
    }

    set_init() {
        this.setState({
            page: PAGE_ID_INIT
        })
    }

    render() {
        switch (this.state.page) {
            case PAGE_ID_INIT: return this.show_init();
            case PAGE_ID_WORK_TASK: return this.show_work_list();
            case PAGE_ID_KNOWLEDGE: return this.show_knowledge();
            case PAGE_ID_ONLINE_TOOLS: return this.show_online_tools();
            default: return <div>error</div>
        }
    }
}

export default ModuleList;