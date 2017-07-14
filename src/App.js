import React, { Component } from 'react';
import './App.css';
import Tournament from './Tournament'

class App extends Component {
  render() {
    var tourneyProps = {
      aProp: "this is a prop"
    };
    return (
      <div className="App">
        <div className="App-header">
          <h2>Hera</h2>
        </div>
        <Tournament {...tourneyProps}/>
      </div>
    );
  }
}

export default App;
