import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {PrecedenceGraph} from "./api/src";

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import {Button} from "primereact/button";                                //icons

let graph = new PrecedenceGraph({});


function App() {

  const [counter, setCounter] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {graph.test()}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <p>
        {"counter: "+counter}
      </p>
      <Button label="Show" onClick={() => setCounter(counter+1)} />
    </div>
  );
}

export default App;
