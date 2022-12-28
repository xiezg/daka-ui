import React from 'react'
import moment from 'moment';

class Countdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = { lastTime: "" }
        this.tick()
    }

    tick() {
        const endtime = moment(this.props.data.endtime)
        this.setState({ lastTime: moment().to(endtime) })
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    render() {
        return (<div>
             <div> {this.props.data.title}</div>
             <div>{this.state.lastTime}</div>
        </div>)
    }
}

export default Countdown;

