import React from 'react';
import "./login.css"
import server from './server';

class MyInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            active: false,
            value: ""
        }
    }

    LabelBackgroundPos() {
        const { type } = this.props
        const { active } = this.state

        if (active) {
            if (type === 'text') {
                return '0 -48px'
            } else {
                return '-48px -48px'
            }
        } else {
            if (type === 'text') {
                return '0 0'
            } else {
                return '-48px 0'
            }
        }
    }

    render() {
        const { type, placeholder, getVal } = this.props;

        return (
            <div className='my_input' >
                <label style={{ backgroundPosition: this.LabelBackgroundPos() }} ></label>
                <input onChange={(event) => { getVal(event.target.value) }} type={type} placeholder={placeholder} onBlur={() => { this.setState({ active: false }) }} onFocus={() => { this.setState({ active: true }) }} ></input>
                <span onClick={() => { this.setState({ value: "" }) }} ></span>
            </div>
        )
    }
}

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            error: false
        }
    }

    postLogin() {
        const { username, password } = this.state;

        if (username === '' || password === '') {
            this.setState({ error: true })
            return
        }

        server.Login(username, password)
    }

    render() {

        const userNameVal = (val) => {
            this.setState({ username: val })
        }

        const passwordVal = (val) => {
            this.setState({ password: val })
        }

        return (
            <>
                <div className='logo' ></div>
                <div className='login_container'>
                    <div className='login'>
                        {this.state.error ? <div className='msg-error'><b></b>请输入账户名和密码</div> : null}
                        <MyInput type="text" placeholder="用户名" getVal={userNameVal} />
                        <MyInput type="password" placeholder="密码" getVal={passwordVal} />
                        <button onClick={() => { this.postLogin() }}>登陆</button>
                    </div>
                </div>
            </>
        )
    }
}

export default Login;
