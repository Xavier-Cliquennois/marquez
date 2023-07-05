import React, { useCallback, useEffect, useState } from 'react'
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Node, Edge, Position, Panel, ConnectionLineType } from 'reactflow'
import dagre from 'dagre';
import { LineageNode } from '../../types';

import 'reactflow/dist/style.css'
import Graphviz from 'graphviz-react';



interface FlowGraphvizProps {
    lineageNode: LineageNode[]
}

const FlowGraphviz: React.FC<FlowGraphvizProps> = ({ lineageNode }) => {
    return (
        <Graphviz dot={`graph {
            rankdir=LR;
            a -- { b c d }; b -- { c e }; c -- { e f }; d -- { f g }; e -- h;
            f -- { h i j g }; g -- k; h -- { o l }; i -- { l m j }; j -- { m n k };
            k -- { n r }; l -- { o m }; m -- { o p n }; n -- { q r };
            o -- { s p }; p -- { s t q }; q -- { t r }; r -- t; s -- z; t -- z;
            { rank=same; b, c, d }
            { rank=same; e, f, g }
            { rank=same; h, i, j, k }
            { rank=same; l, m, n }
            { rank=same; o, p, q, r }
            { rank=same; s, t }
        }`} />
    )
}

export default FlowGraphviz