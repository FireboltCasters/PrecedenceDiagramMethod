import React, {Component} from 'react';
import {FunctionComponent} from "react";

export const SidebarNodes: FunctionComponent = ({nodeTypes, ...props}) => {

    function onDragStart(event, nodeType, data){
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/customData', JSON.stringify(data));
        event.dataTransfer.effectAllowed = 'move';
    }

        let customNodes = [];
        if(!!nodeTypes){
            let keys = Object.keys(nodeTypes);
            for(let i=0; i<keys.length; i++){
                let key = keys[i];
                const CustomNode = nodeTypes[key];
                customNodes.push(
                    <div className="output" onDragStart={(event) => onDragStart(event, key, {})} draggable>
                        <CustomNode />
                    </div>);
            }
        }

        return (
            <div>
                <div className="description">Ziehe einen neuen Knoten nach links in das Diagramm</div>
                {customNodes}
            </div>
        );
}