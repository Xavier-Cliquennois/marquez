import React, { useEffect, useMemo, useState } from 'react'
import { LineageNode } from '../../types';
import * as d3 from "d3";

import 'reactflow/dist/style.css'
import { ParentSize } from '@visx/responsive';

interface ForceGraphProps {
    nodes: any[];
    edges: any[];
    charge: number;
}
const ForceGraph: React.FC<ForceGraphProps> = ({ nodes, edges, charge }) => {
    console.log('nodes', nodes, 'edges', edges)
    const [animatedNodes, setAnimatedNodes] = useState<d3.SimulationNodeDatum[]>([]);

    // re-create animation every time nodes change
    useEffect(() => {
        const simulation = d3
            .forceSimulation()
            // @ts-ignore
            .force("link", d3.forceLink(edges).id(d => d.id))
            .force("charge", d3.forceManyBody().strength(charge))
            .force("collision", d3.forceCollide(5))
            .force("x", d3.forceX(400))
            .force("y", d3.forceY(300))

        // update state on every frame
        simulation.on("tick", () => {
            setAnimatedNodes([...simulation.nodes()]);
        });

        // copy nodes into simulation
        simulation.nodes([...nodes]);
        // slow down with a small alpha
        simulation.alpha(0.1).restart();

        // stop simulation on unmount
        return () => { simulation.stop() };
    }, [nodes, charge]);

    return (
        <g>
            {animatedNodes.map((node) => (
                <circle
                    cx={node.x}
                    cy={node.y}
                    // @ts-ignore
                    r={node.r}
                    // @ts-ignore
                    key={node.id}
                    stroke="black"
                    fill="transparent"
                />
            ))}
        </g>
    );
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
        getLayoutedElements(lineageNode);
    }, [lineageNode]);

    return (
        <div>
            <p>Current charge: {charge}</p>
            <input
                type="range"
                min="-30"
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
                <ForceGraph nodes={nodes} edges={edges} charge={charge} />
            </svg>
        </div>
    );

    // const nodeWidth = 300;
    // const nodeHeight = 36;

    // // TODO find a way to get the width and height of the parent element
    // const width = 1000;
    // const height = 1000;

    // const getLayoutedElements = (lineageNode: LineageNode[], direction = 'TB') => {
    //     // convert MqNode to ReactFlow Nodes and Edges
    //     let nodes: Array<{ index: number, id: string, label: string }> = [];
    //     let edges: Array<{ index: number, id: string, source: string, target: string }> = [];

    //     lineageNode.forEach((lineageNode) => {
    //         nodes.push({
    //             index: nodes.length - 1,
    //             id: lineageNode.id,
    //             label: lineageNode.data.id.name
    //         });

    //         lineageNode.inEdges.forEach((inEdge) => {
    //             if (!edges.find(edge => edge.id === JSON.stringify(inEdge))) {
    //                 edges.push({
    //                     index: edges.length - 1,
    //                     id: `${inEdge.origin}->${inEdge.destination}`,
    //                     source: inEdge.origin,
    //                     target: inEdge.destination
    //                 })
    //             }
    //         });

    //         lineageNode.outEdges.forEach((outEdge) => {
    //             if (!edges.find(edge => edge.id === JSON.stringify(outEdge))) {
    //                 edges.push({
    //                     index: edges.length - 1,
    //                     id: JSON.stringify(outEdge),
    //                     source: outEdge.origin,
    //                     target: outEdge.destination
    //                 })
    //             }
    //         });
    //     });

    //     const simulation = d3.forceSimulation(nodes)

    //         .force("link", d3.forceLink(edges).id((d: d3.SimulationNodeDatum) => {
    //             console.log('>>>>d', d)
    //             // @ts-ignore
    //             return d.id || ''
    //         }))
    //         .force("charge", d3.forceManyBody().strength(-400))
    //         .force("x", d3.forceX())
    //         .force("y", d3.forceY());

    //     const svg = d3.create("svg")
    //         .attr("viewBox", [-width / 2, -height / 2, width, height])
    //         .style("font", "12px sans-serif");

    //     // Per-type markers, as they don't inherit styles.
    //     svg.append("defs").selectAll("marker")
    //         //.data(types)
    //         .join("marker")
    //         .attr("id", d => `arrow-${d}`)
    //         .attr("viewBox", "0 -5 10 10")
    //         .attr("refX", 15)
    //         .attr("refY", -0.5)
    //         .attr("markerWidth", 6)
    //         .attr("markerHeight", 6)
    //         .attr("orient", "auto")
    //         .append("path")
    //         //.attr("fill", color)
    //         .attr("d", "M0,-5L10,0L0,5");

    //     const link = svg.append("g")
    //         .attr("fill", "none")
    //         .attr("stroke-width", 1.5)
    //         .selectAll("path")
    //         .data(edges)
    //         .join("path")
    //         .attr("stroke", /*d => color(d.type)*/ 'blue')
    //         .attr("marker-end", d => {
    //             console.log('>>>>d', d)
    //             return `${d.source}-${d.target}`
    //             //return `url(${new URL(`#arrow-${d.type}`, location)})`
    //         });

    //     const node = svg.append("g")
    //         .attr("fill", "currentColor")
    //         .attr("stroke-linecap", "round")
    //         .attr("stroke-linejoin", "round")
    //         .selectAll("g")
    //         .data(nodes)
    //         .join("g")
    //     //.call(drag(simulation));

    //     node.append("circle")
    //         .attr("stroke", "white")
    //         .attr("stroke-width", 1.5)
    //         .attr("r", 4);

    //     node.append("text")
    //         .attr("x", 8)
    //         .attr("y", "0.31em")
    //         .text(d => d.id)
    //         .clone(true).lower()
    //         .attr("fill", "none")
    //         .attr("stroke", "white")
    //         .attr("stroke-width", 3);

    //     simulation.on("tick", () => {
    //         link.attr("d", function linkArc(d) {
    //             //@ts-ignore
    //             const targetPosition = { x: d.target.x, y: d.target.y };
    //             //@ts-ignore
    //             const sourcePosition = { x: d.source.x, y: d.source.y };

    //             const r = Math.hypot(targetPosition.x - sourcePosition.x, targetPosition.y - sourcePosition.y);
    //             return `
    //               M${sourcePosition.x},${sourcePosition.y}
    //               A${r},${r} 0 0,1 ${targetPosition.x},${targetPosition.y}
    //             `;
    //         });
    //         // @ts-ignore
    //         node.attr("transform", d => `translate(${d.x},${d.y})`);
    //     });

    //     //invalidation.then(() => simulation.stop());

    //     return svg.node();
    // };

    // useEffect(() => {
    //     getLayoutedElements(lineageNode, 'LR');

    // }, [lineageNode]);


    // return (
    //     <>
    //         {/* TODO check why this component doesn't exist in this branch
    //         <DepthConfig depth={this.props.depth} /> */}
    //         {dagreGraph && (
    //             <ParentSize>
    //                 {parent => (
    //                     <svg
    //                         id={'GRAPH'}
    //                         width={parent.width}
    //                         height={parent.height}
    //                         style={{ border: '1px solid red' }}
    //                     >
    //                     </svg>
    //                 )}
    //             </ParentSize >
    //         )}
    //     </>
    // )
}

export default FlowD3Force