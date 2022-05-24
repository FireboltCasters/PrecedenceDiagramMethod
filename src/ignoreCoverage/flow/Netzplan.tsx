import React, {useState, useRef, Component, FunctionComponent} from 'react';
import ReactFlow, {
    addEdge,
//    removeElements,
    Controls, isNode,
    getOutgoers, isEdge, useEdgesState, useNodesState
} from 'react-flow-renderer';
import {GraphHelper} from "./GraphHelper";
import {NetzplanNodeEditable} from "./NetzplanNodeEditable";

const initNodeName = "init";

const strokeWidth = 2;
const edgeNormal = "#444444";
const edgeCritical = "#ff2222";


const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Input Node' },
        position: { x: 250, y: 25 }
    },
    {
        id: '2',
        data: { label: 'Default Node' },
        position: { x: 100, y: 125 }
    },
    {
        id: '3',
        type: 'output',
        data: { label: 'Output Node' },
        position: { x: 250, y: 250 }
    }
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3', animated: true },
];


let id = 1;
const getId = () => `Knoten_${id++}`;

const NODE_HEIGHT = 100;

const nodeTypes = {
    [NetzplanNodeEditable.getNodeTypeName()]: NetzplanNodeEditable.getMemoRenderer(),
};

export const Netzplan : FunctionComponent = (props) => {

    const reactFlowWrapper = React.createRef<HTMLDivElement>();
    const [reloadNumber, setReloadNumber] = useState(0)
    const [reactFlowInstance, setReactFlowInstance] = useState(undefined)
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = (params: any) => setEdges((eds) => addEdge(params, eds));

    function autoLayoutElements(){
        let layoutedElements: any = GraphHelper.getLayoutedElements(nodes, GraphHelper.DEFAULT_NODE_WIDTH, NODE_HEIGHT);
        updateReactFlowElements(layoutedElements);
    }

    function getNetzplanJSONFromReactFlowElements(elements: any){
        let graphJSON = {};
        for(let i=0; i<elements.length; i++){
            let element = elements[i];
            if(isNode(element) && element.type == NetzplanNodeEditable.getNodeTypeName()){
                let reactFlowChildren = getOutgoers(element, nodes, edges);
                let children = [];
                for(let j=0; j<reactFlowChildren.length; j++){
                    let child = reactFlowChildren[j];
                    children.push(child.id+"");
                }
                let label = element.id;
                let data = element.data;
                let graphElement = {
                    children: children,
                    duration: data.duration
                }
                //@ts-ignore
                graphJSON[label] = graphElement;
            }
        }
        return graphJSON;
    }

    function getNetzplanStartNodeFromReactFlowElements(elements: any){
        let startNodeLabel = undefined;
        for(let i=0; i<elements.length; i++){
            let element = elements[i];
            if(isNode(element) && element.id === initNodeName){
                let reactFlowChildren = getOutgoers(element, nodes, edges);
                if(reactFlowChildren.length===1){
                    startNodeLabel = reactFlowChildren[0].id;
                }
            }
        }
        return startNodeLabel;
    }

    function calcNetzplan(){
        let startNodeLabel: any = getNetzplanStartNodeFromReactFlowElements(nodes);
        if(!!startNodeLabel){
            let graphJSON = getNetzplanJSONFromReactFlowElements(nodes);
//            let calcedNetzplan = init(graphJSON, startNodeLabel);
  //          this.updateElementsByCalcedNetzplan(calcedNetzplan);
        }
    }

    function updateReactFlowElements(elements: any){
        setNodes(elements)
        setReloadNumber(reloadNumber+1);
    }

    function updateElementsByCalcedNetzplan(calcedNetzplan: any){
        let elements = nodes;
        for(let i=0; i<elements.length; i++){
            let element = elements[i];
            if(isEdge(element)){
                console.log(element);
                let source = element.source;
                let target = element.target;
                let sourceNode = calcedNetzplan[source];
                let targetNode = calcedNetzplan[target];

                if(!!sourceNode && !!targetNode){
                    let isCritical = sourceNode.buffer === 0 && targetNode.buffer === 0;
                    element.style = {};
                    if(isCritical){
                        element.style.stroke= edgeCritical;
                    } else {
                        element.style.stroke= edgeNormal;
                    }
                    element.style.strokeWidth = strokeWidth;
                    elements[i] = element;
                }
            }
            if(isNode(element) && element.type === NetzplanNodeEditable.getNodeTypeName()){
                let id = element.id;
                let netzplanNode = calcedNetzplan[id];
                element.data.buffer = netzplanNode.buffer;
                element.data.earliestStart = netzplanNode.earliestStart;
                element.data.earliestEnd = netzplanNode.earliestEnd;
                element.data.latestStart = netzplanNode.latestStart;
                element.data.latestEnd = netzplanNode.latestEnd;
                elements[i] = element;
            }
        }
        updateReactFlowElements(elements);
    }

    /**
    function onConnect = (params) => {
        params.arrowHeadType = "arrowclosed";
        let style = {
            strokeWidth: strokeWidth,
            stroke: edgeNormal,
        }
        params.style = style;
        this.setState({
            elements: addEdge(params, this.state.elements)
        })
    };
     */

    function onElementsRemove(elementsToRemove: any) {
  //      this.setState({
    //        elements: removeElements(elementsToRemove, this.state.elements)
      //  })
    }

    function onInit(_reactFlowInstance: any) {
        console.log("On Load");
        console.log(_reactFlowInstance);
        setReactFlowInstance(_reactFlowInstance)
    }

    function onDragOver(event: any) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    function onDrop(event: any) {
        console.log("On Drop Event!");
        event.preventDefault();
        const type = event.dataTransfer.getData('application/reactflow');
        console.log("type: ", type);
        let data = JSON.parse(event.dataTransfer.getData('application/customData'));
        console.log(data);

        //@ts-ignore
        const reactFlowBounds: any = reactFlowWrapper.current.getBoundingClientRect();
        console.log(reactFlowBounds)

        console.log(reactFlowWrapper.current);
        if(reactFlowInstance!=null){
            //@ts-ignore
            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            let newId = getId();

            data = Object.assign(data,{id: newId});

            const newNode = {
                id: newId,
                type,
                position,
                data: data,
            };
            setNodes(nodes.concat(newNode))
        }
    };

    async function setNodeDuration(nodeId: any, duration: any){
        setNodeDataProperty(nodeId, "duration", duration)
    }

    async function setNodeLabel(nodeId: any, label: any){
        setNodeDataProperty(nodeId, "label", label)
    }

    async function setNodeDataProperty(nodeId: any, key: any, value: any){
        let elementsCopy = nodes;
        let newElements = [];
        for(let i=0; i<elementsCopy.length; i++){
            let element = elementsCopy[i];
            if(element.id === nodeId){
                let data = element.data;
                //@ts-ignore
                data[key] = value;
                element.data = data;
                elementsCopy[i] = element
            }
            newElements.push(element);
        }
        updateReactFlowElements(newElements);
    }

        let height = 700;

        return (
           <ReactFlow
               fitView
                    ref={reactFlowWrapper}
                    key={reloadNumber+""}
                    nodes={nodes} edges={edges}
                    onConnect={onConnect}
                   onNodesChange={onNodesChange}
                   onEdgesChange={onEdgesChange}
//                    onElementsRemove={onElementsRemove}
                    //onNodesChange={onNodesChange}
                    onInit={onInit}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                >
                    <Controls />
                </ReactFlow>
        );
}