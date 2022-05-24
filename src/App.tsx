import React, {useState} from 'react';
import {PrecedenceGraph} from "./api/src";

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import {Button} from "primereact/button";                                //icons
import { Toolbar } from 'primereact/toolbar';
import {SplitButton} from "primereact/splitbutton";
import Flow from "./ignoreCoverage/flow/Flow";
import {ReactFlowProvider} from "react-flow-renderer";
import {Sidebar} from "./ignoreCoverage/flow/Sidebar";
import {NetzplanNodeEditable} from "./ignoreCoverage/flow/NetzplanNodeEditable";
import {Netzplan} from "./ignoreCoverage/flow/Netzplan";

let graph = new PrecedenceGraph({});


function App() {

  const [counter, setCounter] = useState(0)
  const [reloadNumber, setReloadnumber] = useState(0)

    const nodeTypes = {
        [NetzplanNodeEditable.getNodeTypeName()]: NetzplanNodeEditable.getMemoRenderer(),
    };

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
    <div style={{width: "100%", height: "90vh"}}>
       {renderToolbar()}
        <ReactFlowProvider key={reloadNumber+1+""}>
        <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
            <div style={{display: "flex", flex: 3, backgroundColor: "blue"}}>
                <Netzplan />
            </div>
            <div style={{display: "flex", flex: 1, flexDirection: "column", backgroundColor: "red"}}>
                <Sidebar nodeTypes={nodeTypes} />
            </div>
        </div>
        </ReactFlowProvider>
    </div>
  );
}

export default App;
