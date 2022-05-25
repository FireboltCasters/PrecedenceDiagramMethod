import React, {useState, useRef, Component, FunctionComponent, useEffect} from 'react';
import ReactFlow, {
    addEdge,
//    removeElements,
    Controls, isNode,
    Background,
    getOutgoers, isEdge, useEdgesState, useNodesState, ReactFlowProvider, ReactFlowInstance
} from 'react-flow-renderer';
import {GraphHelper} from "./GraphHelper";
import {NetzplanNodeEditable} from "./NetzplanNodeEditable";
import {SidebarNodes} from "./SidebarNodes";
import {MyToolbar} from "./MyToolbar";
import NetzplanHelper from "./NetzplanHelper";
import App from "../../App";
import {PrecedenceGraph} from "../../api/src";

const strokeWidth = 2;
const edgeNormal = "#444444";
const edgeCritical = "#ff2222";

let id = 1;
const getId = () => `Activity_${id++}`;


export const Netzplan : FunctionComponent = (props) => {

    const reactFlowWrapper = React.createRef<HTMLDivElement>();
    const [nodeTypes, setNodetypes] = useState({});
    const [reloadNumber, setReloadNumber] = useState(0)
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>()
    //@ts-ignore
    const [nodes, setNodes, onNodesChange] = useNodesState(NetzplanHelper.initialNodes);
    //@ts-ignore
    const [edges, setEdges, onEdgesChange] = useEdgesState(NetzplanHelper.initialEdges);
    const onConnect = (params: any) => setEdges((eds) => addEdge({animated: true ,...params}, eds));

    function autoLayoutElements(){
        let layoutedElements: any = GraphHelper.getLayoutedElements(nodes, GraphHelper.DEFAULT_NODE_WIDTH, NetzplanHelper.NODE_HEIGHT);
        updateReactFlowElements(layoutedElements);
    }

    async function reset(){
        //@ts-ignore
        await setNodes(NetzplanHelper.initialNodes)
        //@ts-ignore
        await setEdges(NetzplanHelper.initialEdges)
        if(reactFlowInstance!=null){
            reactFlowInstance?.fitView()
        }
    }

    function getNetzplanJSONFromReactFlowElements(){
        let graphJSON = {};
        for(let i=0; i<nodes.length; i++){
            let element = nodes[i];
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
                //@ts-ignore
                duration: data?.duration || 0
            }
            //@ts-ignore
            graphJSON[label] = graphElement;
        }
        return graphJSON;
    }

    function calcNetzplan(){
        console.log("calcNetzplan")
        let startNodeLabel: string = NetzplanHelper.initNodeName;
        console.log("startNodeLabel: ", startNodeLabel);
        let graphJSON = getNetzplanJSONFromReactFlowElements();
        console.log(graphJSON);
        let precedenceGraph = new PrecedenceGraph(graphJSON, startNodeLabel);
        console.log(precedenceGraph);
        updateElementsByCalcedNetzplan(precedenceGraph.getGraph());
    }

    function updateReactFlowElements(nodes: any){
        setNodes(nodes)
        //setReloadNumber(reloadNumber+1);
    }

    function updateElementsByCalcedNetzplan(calcedNetzplan: any){
        let newNodes = [];
        for(let node of nodes){
            let id = node.id;
            let netzplanNode = calcedNetzplan[id];
            //@ts-ignore
            node.data.buffer = netzplanNode?.buffer;
            //@ts-ignore
            node.data.earliestStart = netzplanNode?.earliestStart;
            //@ts-ignore
            node.data.earliestEnd = netzplanNode?.earliestEnd;
            //@ts-ignore
            node.data.latestStart = netzplanNode?.latestStart;
            //@ts-ignore
            node.data.latestEnd = netzplanNode?.latestEnd;
            newNodes.push(node);
        }

        let newEdges = [];
        for(let edge of edges){
            let source = edge.source;
            let target = edge.target;
            let sourceNode = calcedNetzplan[source];
            let targetNode = calcedNetzplan[target];

            if(!!sourceNode && !!targetNode){
                let isCritical = sourceNode?.buffer === 0 && targetNode?.buffer === 0;
                edge.style = {};
                if(isCritical){
                    edge.style.stroke= edgeCritical;
                } else {
                    edge.style.stroke= edgeNormal;
                }
                edge.style.strokeWidth = strokeWidth;
            }
            newEdges.push(edge);
        }

        console.log("Finished applying")
        console.log(newNodes)
        console.log(newEdges);

        setNodes(newNodes);
        setEdges(newEdges);
        setReloadNumber(reloadNumber+1)
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

            data = Object.assign(data,{id: newId, instance: {
                    setNodeDuration: setNodeDuration,
                    setNodeLabel: setNodeLabel,
                }});

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
    App.netzplanRef.setNodeDuration = setNodeDuration

    async function setNodeLabel(nodeId: any, label: any){
        setNodeDataProperty(nodeId, "label", label)
    }
    App.netzplanRef.setNodeLabel = setNodeLabel

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

    function myOnNodesChange(nodesChanges: any){
        let filteredChanges = []
        for(let nodeChange of nodesChanges){
            if(nodeChange.id===NetzplanHelper.initNodeName && nodeChange?.type==="remove"){
                //prevent from deletion
            } else {
                filteredChanges.push(nodeChange)
            }
        }
        onNodesChange(filteredChanges);
    }

    useEffect(() => {
        const nodeTypes = Object.assign({}, NetzplanNodeEditable.getNodeType())
        //@ts-ignore
        setNodetypes(nodeTypes);
    }, [])

        let height = 700;

        return (
            <ReactFlowProvider key={reloadNumber+1+""}>
                <div style={{width: "100%", height: "10vh"}}>
                    <MyToolbar handleCalc={calcNetzplan} handleLayout={autoLayoutElements} handleClear={reset} nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} />
                </div>
                <div style={{width: "100%", height: "90vh"}}>
                        <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
                            <div style={{display: "flex", flex: 3}}>
                                <ReactFlow
                                    fitView
                                    ref={reactFlowWrapper}
                                    key={reloadNumber+""}
                                    nodes={nodes} edges={edges}
                                    onConnect={onConnect}
                                    onNodesChange={myOnNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    //                    onElementsRemove={onElementsRemove}
                                    //onNodesChange={onNodesChange}
                                    onInit={onInit}
                                    onDrop={onDrop}
                                    onDragOver={onDragOver}
                                    nodeTypes={nodeTypes}
                                    style={{alignContent: "flex-end"}}
                                >
                                    <Controls />
                                    <Background />
                                </ReactFlow>
                            </div>
                            <div style={{display: "flex", flex: 1, flexDirection: "column", backgroundColor: "#DDDDDD"}}>
                                <SidebarNodes nodeTypes={nodeTypes} />
                            </div>
                        </div>
                </div>
            </ReactFlowProvider>
        );
}