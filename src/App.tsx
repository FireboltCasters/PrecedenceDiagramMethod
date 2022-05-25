import React, {useState} from 'react';
import {PrecedenceGraph} from "./api/src";

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import {Netzplan} from "./ignoreCoverage/flow/Netzplan";

function App() {

  return (
    <Netzplan />
  );
}

export default App;
