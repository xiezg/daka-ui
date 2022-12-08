import React from "react";

export default class OnlineTools extends React.Component {

    render() {
        return (<>
            <div>
                <button onClick={() => this.props.backup()} >返回首页</button>
            </div>
        </>)
    }
}