import './App.css';
import React from 'react';
import ModuleList from './root';
import server from './server';
class App extends React.Component {

  componentDidMount(){
    server.Login()
  }
  
  render() {
    return <ModuleList />
  }
}

export default App;
