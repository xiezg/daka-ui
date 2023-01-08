import React from "react";

import moment from "moment";

export default class OnlineTools extends React.Component {

    render() {
        return (<>
            <div>
                <button onClick={() => this.props.backup()} >返回首页</button>
                <div>
                    <ul>
                        <li>薪资计算器</li>
                        <li>社保计算器</li>
                        <li>
                            { ( 315106-1628 ) / moment( '2023-01-06 11:54' ).diff( moment('2023-01-05 17:50'), 'seconds' ) }<br/>

                            { ( 1915268189-1911938852 ) / moment( '2023-01-06 11:57' ).diff( moment('2023-01-05 18:17'), 'seconds' ) }<br/>

                            { ( 4771113671-4763319636 ) / moment( '2023-01-06 11:31' ).diff( moment('2023-01-05 18:30'), 'seconds' ) }<br/>

                            { ( 949026536 -946824557 ) / moment( '2023-01-06 12:09' ).diff( moment('2023-01-05 18:39'), 'seconds' ) }<br/>

                            UDR: Select QPS:{ ( 295533629-285252933 ) / moment( '2023-01-06 11:54' ).diff( moment('2023-01-05 17:50'), 'seconds' ) }<br/>
                            IDS: Select QPS:{ ( 1980711399 - 1963417111 ) / moment( '2023-01-06 11:57' ).diff( moment('2023-01-05 18:17'), 'seconds' ) }<br/>
                            biz: Select QPS:{ ( 289946697 - 289005098  ) / moment( '2023-01-06 11:31' ).diff( moment('2023-01-05 18:30'), 'seconds' ) }<br/>
                            track: Select QPS:{ ( 282431004 - 279185295 ) / moment( '2023-01-06 12:09' ).diff( moment('2023-01-05 18:39'), 'seconds' ) }<br/>
                        </li>
                    </ul>
                </div>
            </div>
        </>)
    }
}