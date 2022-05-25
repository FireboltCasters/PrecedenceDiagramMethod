import React, {useState} from 'react';
import {FunctionComponent} from "react";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";

export const MyToolbar: FunctionComponent = () => {

    const leftContents = (
        <React.Fragment>
          <Button label="New" icon="pi pi-plus" className="mr-2" style={{margin: 5}} />
          <Button label="Import" icon="pi pi-upload" className="p-button-success" style={{margin: 5}} />
          <Button label="Export" icon="pi pi-download" className="p-button-warning" style={{margin: 5}} />
        </React.Fragment>
    );

    const rightContents = (
        <React.Fragment>
            <Button label="Calc" icon="pi pi-sync" className="p-button-warning" style={{margin: 5}} />
            <Button label="Fit View" icon="pi pi-window-maximize" className="mr-2" style={{margin: 5}} />
            <Button label="Auto Layout" icon="pi pi-sitemap" className="p-button-success" style={{margin: 5}} />
            <Button label="Clear" icon="pi pi-trash" className="p-button-danger" style={{margin: 5}} />
        </React.Fragment>
    );

    return <Toolbar left={leftContents} right={rightContents} />
  }