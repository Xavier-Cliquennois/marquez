import React, { useEffect, useState } from 'react'
import { LineageNode } from '../../../types';
import * as d3 from "d3";

import 'reactflow/dist/style.css'
import './FlowD3Force.css';

interface ForceGraphProps {
    nodes: any[];
    edges: any[];
    charge: number;
}

interface FlowD3ForceProps {
    lineageNode: LineageNode[]
}


const FlowD3Force: React.FC<FlowD3ForceProps> = ({ lineageNode }) => {
    const [charge, setCharge] = useState(-3);
    const [nodes, setNodes] = useState<any[]>([]);
    const [edges, setEdges] = useState<any[]>([]);

    const getLayoutedElements = (lineageNode: LineageNode[], direction = 'TB') => {
        // convert MqNode to ReactFlow Nodes and Edges
        let nodes: Array<{ id: string, label: string, r: number }> = [];
        let edges: Array<{ id: string, source: string, target: string }> = [];

        lineageNode.forEach((lineageNode) => {
            nodes.push({
                id: lineageNode.id,
                label: lineageNode.data.id.name,
                r: 5
            });

            lineageNode.inEdges.forEach((inEdge) => {
                if (!edges.find(edge => edge.id === JSON.stringify(inEdge))) {
                    edges.push({
                        id: `${inEdge.origin}->${inEdge.destination}`,
                        source: inEdge.origin,
                        target: inEdge.destination
                    })
                }
            });

            lineageNode.outEdges.forEach((outEdge) => {
                if (!edges.find(edge => edge.id === JSON.stringify(outEdge))) {
                    edges.push({
                        id: JSON.stringify(outEdge),
                        source: outEdge.origin,
                        target: outEdge.destination
                    })
                }
            });
        });

        setNodes(nodes);
        setEdges(edges);
    }

    useEffect(() => {
        if (lineageNode.length > 0) {
            getLayoutedElements(lineageNode);
        }
    }, [lineageNode]);

    useEffect(() => {

        const updateLinks = () => {
            d3.select('#edges')
                .selectAll('line')
                .data(edges)
                .join('line')
                .attr('x1', function (d) {
                    return d.source.x
                })
                .attr('y1', function (d) {
                    return d.source.y
                })
                .attr('x2', function (d) {
                    return d.target.x
                })
                .attr('y2', function (d) {
                    return d.target.y
                });
        }

        const updateNodes = () => {
            d3.select('#nodes')
                .selectAll('text')
                .data(nodes)
                .join('text')
                .text(function (d) {
                    return d.label
                })
                .attr('x', function (d) {
                    return d.x
                })
                .attr('y', function (d) {
                    return d.y
                })
                .attr('dy', function (d) {
                    return 5
                });
        }

        const simulation = d3
            .forceSimulation(nodes)
            // @ts-ignore
            .force("link", d3.forceLink(edges).id(d => d.id))
            .force("charge", d3.forceManyBody().strength(charge))
            .force("collision", d3.forceCollide(80))
            .force("x", d3.forceX(400))
            .force("y", d3.forceY(300))
            .on("tick", () => {
                updateLinks()
                updateNodes()
            });

        // stop simulation on unmount
        return () => { simulation.stop() };
    }, [nodes, edges, charge]);

    return (
        <div>
            <p>Current charge: {charge}</p>
            <input
                type="range"
                min="-300"
                max="30"
                step="1"
                value={charge}
                onChange={(e) => setCharge(parseInt(e.target.value))}
            />
            <svg
                id={'GRAPH'}
                width={1200}
                height={800}
                style={{ border: '1px solid red' }}
            >
                <g id="edges"></g>
                <g id="nodes"></g>
            </svg>
        </div>
    );
}

export default FlowD3Force