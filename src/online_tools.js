import React from "react";

export default class OnlineTools extends React.Component {

    render() {
        return (<>
            <div>
                <button onClick={() => this.props.backup()} >返回首页</button>
                <div>
                    <ul>
                        <li>薪资计算器</li>
                        <li>社保计算器</li>
                    </ul>
                </div>
            </div>
        </>)
    }
}