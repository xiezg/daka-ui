import './App.css';
import React from 'react';
import ModuleList from './root';
import Login from './login';
import { RequireLogin } from './server';

class App extends React.Component {

  constructor( props ){
    super( props );

    this.state={ 
      login: true
     }

    RequireLogin( (v)=>{ this.reset(v) } )
  }

  reset(params) {
    this.setState({ login: params })
  }

  render() {
    return !this.state.login ? <Login />: <ModuleList />;
  }
}

export default App;
