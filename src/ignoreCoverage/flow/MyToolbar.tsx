import React, {useState} from 'react';
import {FunctionComponent} from "react";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {SplitButton} from "primereact/splitbutton";

export const MyToolbar: FunctionComponent = () => {

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