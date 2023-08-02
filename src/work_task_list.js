import './gannt.css';
import React from 'react';
import { BottomScrollListener } from 'react-bottom-scroll-listener';
import server from './server';
import MermaidRender from './mermaid';

var moment = require('moment')


// var mermaid = require('@xiezg/mermaid')

const ErrorMsg = 'gantt\ntitle 出错啦!!!❌';
// const render_container = document.getElementById('mermaid_tmp_render')

// mermaid.initialize({
//   startOnLoad: false,
//   logLevel: 5,
//   securityLevel: 'loose',
//   gantt: {
//     fontSize: 16,
//     sectionFontSize: 14,
//     useMaxWidth: true,
//     barHeight: 18,
//     // titleTopMargin: 25,
//     // topPadding: 40,
//     // fontFamily: 'STHupo',
//     axisFormat: '%m/%d',
//   }
// });

function DateDiffNow(sDate1, beginDate) { //sDate1和sDate2是2006-12-18格式

  var aDate, oDate1, oDate2, iDays
  oDate1 = new Date(beginDate);

  aDate = sDate1.split("-")
  oDate2 = new Date(aDate[0] + '-' + aDate[1] + '-' + aDate[2])
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数

  //            return iDays
  return parseInt(iDays / 30) + "M " + iDays % 30 + "d"
}

// mermaid.render
// * @param {any} id The id of the element to be rendered
// * @param {any} _txt The graph definition
// * @param {any} cb Callback which is called after rendering is finished with the svg code as inparam.
// * @param {any} container Selector to element in which a div with the graph temporarily will be
// *   inserted. In one is provided a hidden div will be inserted in the body of the page instead. The
// *   element will be removed when rendering is completed.
// * @returns {any}

class TaskItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      svgMsg: props.graphDefinition,
      ShowEditor: false,
      // task_id: props.task_id,
    }
  }

  keyUpWithEditor = (event) => {

    if (event.code !== "Escape") {
      return
    }

    this.setState({
      ShowEditor: false,
    })

    server.TaskSet(this.props.task_id, this.state.svgMsg)

    if (this.task_detail) {
      server.TaskDetailSet(this.props.task_id, this.task_detail)
      this.task_detail = null
    }
  };

  RightDoubleClick = () => {
    this.setState({
      ShowEditor: true,
    })
  };

  grant_cb = (taskArray) => {

    try {

      taskArray = taskArray.filter(ele => {
        return ele.id !== "whole" && ele.id !== "am" && ele.id !== "rest" && ele.id !== "pm"
      })

      let array = []
      taskArray.forEach(ele => {
        array.push({
          "start_time": moment(ele.startTime).format('HH:mm:ss'),
          "end_time": moment(ele.endTime).format('HH:mm:ss'),
          "task": ele.task,
          "done": ele.done | 0,
        })
      })

      this.task_detail = array;

    } catch (e) {
      console.error(e)
    }
  }

  componentDidMount() {

    MermaidRender(this.state.svgMsg, ErrorMsg).then(val => {
      this.grant_cb(val.taskArray)
      this.setState({
        svg: val.svg
      })
    }).catch(e => {
      //noting
    })
  }

  edit_oninput(obj) {

    this.setState({
      svgMsg: obj.target.value
    })

    MermaidRender(obj.target.value, ErrorMsg).then(val => {
      this.grant_cb(val.taskArray)
      this.setState({
        svg: val.svg,
      })
    }).catch(e => {
      //nothing 
    })

  }

  render() {
    const { task_date } = this.props;
    var date = new Date(task_date)
    // let svg = MermaidRender( this.state.svgMsg, ErrorMsg, this.grant_cb )

    // //render 参数
    // // first: id 随便一个不重复的就一个，svg的 id根据这个ID来设置
    // // second: txt: 文本内容
    // // third: cb 结果回调函数，可以不写
    // // forth： render的临时中间div，可以不写，但是容易出错，最好写一个
    // try {
    //   svg = mermaid.render("id" + Date.now(), this.state.svgMsg, grant_cb, render_container)
    // }
    // catch (e) {
    //   console.log(e)
    //   svg = mermaid.render("id" + Date.now(), ErrorMsg, undefined, render_container)
    // }

    return (
      <div className="gantt_item gannt_container">
        <div className="gannt_edit left" style={{ display: this.state.ShowEditor ? 'inline-block' : 'none' }}>
          <textarea
            onKeyUp={this.keyUpWithEditor}
            onInput={this.edit_oninput.bind(this)}
            value={this.state.svgMsg}></textarea>
        </div>
        <div className="right" onDoubleClick={this.RightDoubleClick}>
          <div>{task_date + " " + DateDiffNow(task_date, "2020-11-16") + " w:" + date.getDay()}</div>
          <div className='ip_addr' style={{ float: "right" }} >{this.props.ip_addr}</div>
          <div dangerouslySetInnerHTML={{ __html: this.state.svg }}></div>
        </div>
      </div>
    )
  }
}

class TaskList extends React.Component {

  constructor(props) {
    super(props);

    this.startId = -1;
    this.state = {
      dataList: [],
      showStat: true,
      stat: null
    }
  }

  componentDidMount() {

    server.TaskList(this.startId, (data) => {
      this.startId = data.Data[data.Data.length - 1].id
      this.setState({
        dataList: data.Data
      })
    })

    server.TaskStat(-1, (data) => {
      this.setState({
        stat: data.Data,
      })
    })
  }

  handleOnDocumentBottom = () => {

    server.TaskList(this.startId - 1, (data) => {
      this.startId = data.Data[data.Data.length - 1].id
      this.setState({
        dataList: [...this.state.dataList, ...data.Data]
      })
    })

    // console.log('I am at bottom! ', this.startId);
  };

  popTaskStat = () => {
    server.TaskStat(1, (data) => {
      console.log(data)
    })
  }

  enableStat = () => {

    server.TaskStat(-1, (data) => {
      this.setState({
        stat: data.Data,
      })
    })

    this.setState({ showStat: !this.state.showStat })
  }

  render() {

    const { showStat, stat } = this.state

    return (
      <div className='TaskList'>
        <div className='menu'>
          <button onClick={() => this.props.backup()} >返回首页</button>
          <button onClick={() => { this.enableStat() }} > 统计</button>
        </div>

        {showStat && stat ?
          (<div className='pop_win'>
            <div>
              <div className='statHead'>
                <span>Top: </span>
                <select style={{width: "50px" }}>
                  <option value="wewewe">10</option>
                  <option value="wewewe">20</option>
                  <option value="wewewe">30</option>
                  <option value="wewewe">50</option>
                </select>
              </div>
              <div className='statBody'>
                <span>总任务：{stat.taskUniqNum}</span>
                <React.Fragment>
                  {
                    <ul>
                      {stat.taskTop.slice(0, 100).map(item => <li>{item.n} {item.task_prefix} </li>)}
                    </ul>
                  }
                </React.Fragment>
              </div>

              <div className='statFoot'>
              </div>
            </div>

          </div>) : (<></>)
        }

        {/* <div className='goto'> GoTo TOP </div> */}
        <React.Fragment>
          {
            this.state.dataList.map(item => <TaskItem
              key={item.id}
              graphDefinition={item.task_msg}
              task_date={item.task_date}
              ip_addr={item.ip_addr}
              task_id={item.id}
            />)
          }
        </React.Fragment>
        <BottomScrollListener onBottom={this.handleOnDocumentBottom} />
      </div>
    )
  }
}

export default TaskList;
