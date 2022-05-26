import React, {useState} from 'react';
import {FunctionComponent} from "react";
import {Toolbar} from "primereact/toolbar";
import { FileUpload } from 'primereact/fileupload';
import {Button} from "primereact/button";
import DownloadHelper from "../helper/DownloadHelper";
import NetzplanHelper from "./NetzplanHelper";

export interface AppState{
    nodes?: any,
    setNodes?: any,
    edges?: any,
    setEdges?: any,
    handleCalc?: any,
    handleLayout: any,
    handleClear?: any
}
export const MyToolbar: FunctionComponent<AppState> = ({nodes, edges, setEdges, setNodes, handleCalc,handleLayout, handleClear, ...props}) => {

    function handleExport(){
        let elements = {
            nodes: nodes,
            edges: NetzplanHelper.removeEdgeStyle(JSON.parse(JSON.stringify(edges)))
        };
        DownloadHelper.downloadTextAsFiletile(JSON.stringify(elements), "graph.json")
    }

    function handleImport(event: any){
        let files = event.files;
        let file = files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            let content: string = ""+event?.target?.result;
            console.log(content);
            let elements = JSON.parse(content);
            setNodes(elements?.nodes)
            setEdges(NetzplanHelper.applyDefaultEdgeStyle(elements?.edges));
        });
        reader.readAsText(file);
    }

    const uploadOptions = {label: 'Upload', icon: 'pi pi-upload', className: 'p-button-success'};
    const leftContents = (
        <React.Fragment>
          <Button label="New" icon="pi pi-plus" className="mr-2" style={{margin: 5}} onClick={handleClear} />
          <FileUpload auto chooseOptions={uploadOptions} accept="application/JSON" mode="basic" name="demo[]" url="./upload" className="p-button-success" customUpload uploadHandler={handleImport} style={{margin: 5}} />
          <Button label="Download" icon="pi pi-download" className="p-button-warning" style={{margin: 5}} onClick={handleExport} />
        </React.Fragment>
    );

    const rightContents = (
        <React.Fragment>
            <Button label="Calc" icon="pi pi-sync" className="p-button-warning" style={{margin: 5}} onClick={handleCalc} />
            <Button label="Auto Layout" icon="pi pi-sitemap" className="p-button-success" style={{margin: 5}} onClick={handleLayout} />
            <Button label="Clear" icon="pi pi-trash" className="p-button-danger" style={{margin: 5}} onClick={handleClear} />
        </React.Fragment>
    );

    return <Toolbar left={leftContents} right={rightContents} />
  }