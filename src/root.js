import React from 'react';
import "./root.css"
import TaskList from './work_task_list';
import Knowledge from './knowledge';
import OnlineTools from './online_tools'
// import MaterialTable from "material-table";
import MyTaskList from './components/MyTaskList';
import server from './server';

const PAGE_ID_WORK_TASK = "task_list"
const PAGE_ID_WORK_TASK2 = "task_list2"
const PAGE_ID_KNOWLEDGE = "knowledge"
const PAGE_ID_ONLINE_TOOLS = "online_tools"
const PAGE_ID_INIT = "init"

class Module extends React.Component {

    render() {
        const { open_page, title, subMod } = this.props;
        console.log({ subMod })
        return (
            <div className='module' onClick={() => open_page()} >
                {title}
                {subMod}
            </div>
        )
    }
}

class DailyTaskStat extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            stat: null
        }
    }

    componentDidMount() {
        server.TaskStat( 10, 10, (data) => {
            this.setState({
                stat: data.Data,
            })
        })
    }

    render() {
        const { stat } = this.state

        if (stat === null) {
            return <div></div>
        }

        return <div className='subMod'>
            <span>任务总数：{stat.taskUniqNum}</span>

            <React.Fragment>
                {
                    <ul>
                        {stat.taskTop.slice(0,5).map(item => <li>{item.task_prefix} </li>)}
                    </ul>
                }
            </React.Fragment>

        </div>
    }
}

class ModuleList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: PAGE_ID_INIT
        }
    }

    show_online_tools() {
        return <OnlineTools backup={this.set_init.bind(this)} />
    }

    show_work_list() {
        return <TaskList backup={this.set_init.bind(this)} />
    }

    // show_work_list2() {
    //     return <MyTaskList backup={ this.set_init.bind(this) } />
    // }

    show_knowledge() {
        return <Knowledge backup={this.set_init.bind(this)} />
    }

    show_init() {
        return (
            <div className='root'>
                <div className='search'>
                    <button>search</button>
                    <input type="text" />
                </div>
                <div className='moduleList'>
                    <Module subMod={<DailyTaskStat />} title='每日任务' open_page={this.set_work_list.bind(this)} />
                    <Module title='Note' open_page={this.set_knowledge.bind(this)} />
                    <Module title='online_tools' open_page={this.set_online_tools.bind(this)} />
                    {/* <Module title='WorkList2' open_page={ this.set_work_list2.bind(this) } /> */}
                </div>
            </div>
        )
    }

    set_work_list() {
        this.setState({
            page: PAGE_ID_WORK_TASK
        })
    }

    set_work_list2() {
        this.setState({
            page: PAGE_ID_WORK_TASK2
        })
    }

    set_online_tools() {
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
            case PAGE_ID_WORK_TASK2: return this.show_work_list2();
            case PAGE_ID_KNOWLEDGE: return this.show_knowledge();
            case PAGE_ID_ONLINE_TOOLS: return this.show_online_tools();
            default: return <div>error</div>
        }
    }
}

export default ModuleList;