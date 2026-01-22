import React from 'react';
import { getBezierPath, getEdgeCenter, getMarkerEnd } from 'react-flow-renderer';

import './EdgeButton.css';

const foreignObjectSize = 40;

export default function CustomEdge({
                                       id,
                                       sourceX,
                                       sourceY,
                                       targetX,
                                       targetY,
                                       sourcePosition,
                                       targetPosition,
                                       style = {},
                                       markerEnd,
                                       arrowHeadType,
                                   }, removeEdge) {
    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    const markerId = `edge-arrow-${id}`;
    const strokeColor = (style && style.stroke) ? style.stroke : '#222';

    return (
        <>
            <defs>
                <marker id={markerId} markerWidth="16" markerHeight="16" viewBox="0 0 16 16" refX="13" refY="8" orient="auto" markerUnits="userSpaceOnUse">
                    <path d="M0,0 L16,8 L0,16 L3,8 z" fill={strokeColor} />
                </marker>
            </defs>
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={`url(#${markerId})`}
            />
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={edgeCenterX - foreignObjectSize / 2}
                y={edgeCenterY - foreignObjectSize / 2}
                className="edgebutton-foreignobject"
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <body>
                <button className="edgebutton" onClick={(event) => removeEdge(event, id)}>
                    ×
                </button>
                </body>
            </foreignObject>
        </>
    );
}
