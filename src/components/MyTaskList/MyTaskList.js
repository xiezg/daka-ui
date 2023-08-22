import React, { Component } from 'react';

import Gantt from '../Gantt';
import Toolbar from '../Toolbar';
import MessageArea from '../MessageArea';

export default class MyTaskList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentZoom: 'Days',
            messages: [],
        }
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

    render() {
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
            <>
                <button style={{ "margin":"20px" }} onClick={() => this.props.backup()} >返回首页</button>
                <div style={{ "height": "500px", "margin":"10px" }} onDoubleClick={(event) => { event.stopPropagation(); }} >
                    {/* <div className="zoom-bar">
                        <Toolbar
                            zoom={currentZoom}
                            onZoomChange={this.handleZoomChange}
                        />
                    </div> */}
                    <div className="gantt-container">
                        <Gantt
                            tasks={data}
                            zoom={currentZoom}
                        />
                    </div>
                    <MessageArea
                        messages={messages}
                    />
                </div>
            </>
        );
    }
}
