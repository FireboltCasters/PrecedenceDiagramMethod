import React, {useState} from 'react';
import {PrecedenceGraph} from "./api/src";

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import {Button} from "primereact/button";                                //icons
import { Toolbar } from 'primereact/toolbar';
import {SplitButton} from "primereact/splitbutton";
import Flow from "./flow/Flow";

let graph = new PrecedenceGraph({});


function App() {

  const [counter, setCounter] = useState(0)

  function renderToolbar(){
    const leftContents = (
        <React.Fragment>
          <Button label="New" icon="pi pi-plus" className="mr-2" style={{margin: 5}} />
          <Button label="Import" icon="pi pi-upload" className="p-button-success" style={{margin: 5}} />
          <SplitButton label="Export" icon="pi pi-download" className="p-button-warning" style={{margin: 5}} />
        </React.Fragment>
    );

    const rightContents = (
        <React.Fragment>
          <Button icon="pi pi-search" className="mr-2" style={{margin: 5}} />
          <Button icon="pi pi-calendar" className="p-button-success mr-2" style={{margin: 5}} />
          <Button icon="pi pi-times" className="p-button-danger" style={{margin: 5}} />
        </React.Fragment>
    );

    return <Toolbar left={leftContents} right={rightContents} />
  }

  return (
    <div style={{width: "100%", height: "100vh"}}>
       {renderToolbar()}
        <div style={{display: "flex", flexDirection: "row"}}>
            <div style={{display: "flex", flex: 3, backgroundColor: "orange"}}>
                HI
            </div>
            <div style={{display: "flex", flex: 1, flexDirection: "column", backgroundColor: "red"}}>
                <div>HI</div>
                <div>HI</div>
                <div>HI</div>
            </div>
        </div>
       <Flow />
    </div>
  );
}

export default App;
