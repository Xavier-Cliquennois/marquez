import React, { useCallback, useEffect, useState } from 'react'
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Node, Edge, Position, Panel, ConnectionLineType } from 'reactflow'
import dagre from 'dagre';
import { LineageNode } from '../../types';
import * as d3 from "d3";

import 'reactflow/dist/style.css'



interface FlowDagreProps {
    lineageNode: LineageNode[]
}

const FlowDagre: React.FC<FlowDagreProps> = ({ lineageNode }) => {

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 172;
    const nodeHeight = 36;

    const getLayoutedElements = (lineageNode: LineageNode[], direction = 'TB') => {
        // convert MqNode to ReactFlow Nodes and Edges
        let nodes: Node[] = [];
        let edges: Edge[] = [];

        lineageNode.forEach((lineageNode) => {
            nodes.push({
                id: lineageNode.id,
                data: { label: lineageNode.data.id.name },
                position: { x: 0, y: 0 },
                type: lineageNode.inEdges.length > 0 && lineageNode.outEdges.length === 0 ? 'output' : lineageNode.inEdges.length === 0 && lineageNode.outEdges.length > 0 ? 'input' : undefined,
            });

            lineageNode.inEdges.forEach((inEdge) => {
                if (!edges.find(edge => edge.id === JSON.stringify(inEdge))) {
                    edges.push({
                        id: JSON.stringify(inEdge),
                        source: inEdge.origin,
                        target: inEdge.destination,
                        animated: true
                    })
                }
            });

            lineageNode.outEdges.forEach((outEdge) => {
                if (!edges.find(edge => edge.id === JSON.stringify(outEdge))) {
                    edges.push({
                        id: JSON.stringify(outEdge),
                        source: outEdge.origin,
                        target: outEdge.destination,
                        animated: true
                    })
                }
            });
        });

        const isHorizontal = direction === 'LR';
        dagreGraph.setGraph({ rankdir: direction, ranksep: 300 });

        nodes.forEach((node) => {
            dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
        });

        edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(dagreGraph);

        nodes.forEach((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            node.targetPosition = isHorizontal ? Position.Left : Position.Top;
            node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

            // We are shifting the dagre node position (anchor=center center) to the top left
            // so it matches the React Flow node anchor point (top left).
            node.position = {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            };

            return node;
        });
        console.log('nodes / edges', nodes, edges)
        return { nodes, edges };
    };

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        const { nodes, edges } = getLayoutedElements(lineageNode, 'LR');

        setNodes([...nodes]);
        setEdges([...edges]);
    }, [lineageNode]);

    const onConnect = useCallback(
        (params: any) =>
            setEdges((eds) =>
                addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
            ),
        []
    );
    const onLayout = useCallback(
        (direction: any) => {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                lineageNode,
                direction
            );

            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
        },
        [nodes, edges]
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionLineType={ConnectionLineType.SmoothStep}
            fitView
        >
            <Panel position="top-right">
                <button onClick={() => onLayout('TB')}>vertical layout</button>
                <button onClick={() => onLayout('LR')}>horizontal layout</button>
            </Panel>
            <MiniMap />
            <Controls />
            <Background />
        </ReactFlow>
    )
}

export default FlowDagre