import React, { useEffect } from 'react'
import { LineageNode } from '../../types';
import dagreD3 from 'dagre-d3';
import * as d3 from "d3";

import 'reactflow/dist/style.css'
import { ParentSize } from '@visx/responsive';


interface FlowDagreD3Props {
    lineageNode: LineageNode[]
}

const FlowDagreD3: React.FC<FlowDagreD3Props> = ({ lineageNode }) => {
    const MIN_ZOOM = 1 / 4
    const MAX_ZOOM = 4
    const DOUBLE_CLICK_MAGNIFICATION = 1.1

    const dagreGraph = new dagreD3.graphlib.Graph({ compound: true });

    const nodeWidth = 300;
    const nodeHeight = 36;

    const getLayoutedElements = (lineageNode: LineageNode[], direction = 'TB') => {
        // convert MqNode to ReactFlow Nodes and Edges
        let nodes: Array<{ id: string, label: string }> = [];
        let edges: Array<{ id: string, source: string, target: string }> = [];

        lineageNode.forEach((lineageNode) => {
            nodes.push({
                id: lineageNode.id,
                label: lineageNode.data.id.name
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

        dagreGraph.setGraph({ rankdir: direction, ranksep: 300/*, ranker: 'longest-path'*/ });

        nodes.forEach((node) => {
            dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight, style: 'fill: white;', label: node.label, anchor: 'left' });
        });

        console.log('nodes', dagreGraph)

        edges.forEach((edge) => {
            dagreGraph.setEdge(
                edge.source,
                edge.target,
                {
                    /*label: `${edge.source}->${edge.target}`, */
                    style: 'stroke: #ffffff; fill: none;',
                    arrowheadStyle: 'fill: #ffffff;',
                    curve: d3.curveBasis
                }
            );
        });

        dagreGraph.nodes().forEach(function (v) {
            var node = dagreGraph.node(v);
            // Round the corners of the nodes
            node.rx = node.ry = 5;
        });

        // Create the renderer
        var render = new dagreD3.render();

        // Set up an SVG group so that we can translate the final graph.
        const svg = d3.select('#GRAPH')
        const g = d3.select('#GRAPH g').empty() ? svg.append('g') : d3.select('#GRAPH g');

        // zoom
        svg.call(d3.zoom()
            .extent([[0, 0], [parseInt(svg.attr('width')) || 0, parseInt(svg.attr('height')) || 0]])
            .scaleExtent([0.1, 8])
            .on("zoom", zoomed));

        // @ts-ignore
        function zoomed({ transform }) {
            g.attr('transform', transform);
        }

        // Run the renderer. This is what draws the final graph.
        // @ts-ignore
        render(d3.select('#GRAPH g'), dagreGraph);

        console.log('nodes / edges', nodes, edges)
    };

    useEffect(() => {
        getLayoutedElements(lineageNode, 'LR');

    }, [lineageNode]);


    return (
        <>
            {/* TODO check why this component doesn't exist in this branch
            <DepthConfig depth={this.props.depth} /> */}
            {dagreGraph && (
                <ParentSize>
                    {parent => (
                        <svg
                            id={'GRAPH'}
                            width={parent.width}
                            height={parent.height}
                            style={{ border: '1px solid red' }}
                        >
                            {/* background */}
                            {/* <g transform={zoom.toString()}>
                                                <Edge edgePoints={this.state.edges} />
                                            </g>
                                            <rect
                                                width={parent.width}
                                                height={parent.height}
                                                fill={'transparent'}
                                                onTouchStart={zoom.dragStart}
                                                onTouchMove={zoom.dragMove}
                                                onTouchEnd={zoom.dragEnd}
                                                onMouseDown={event => {
                                                    zoom.dragStart(event)
                                                }}
                                                onMouseMove={zoom.dragMove}
                                                onMouseUp={zoom.dragEnd}
                                                onMouseLeave={() => {
                                                    if (zoom.isDragging) zoom.dragEnd()
                                                }}
                                                onDoubleClick={event => {
                                                    const point = localPoint(event) || {
                                                        x: 0,
                                                        y: 0
                                                    }
                                                    zoom.scale({
                                                        scaleX: DOUBLE_CLICK_MAGNIFICATION,
                                                        scaleY: DOUBLE_CLICK_MAGNIFICATION,
                                                        point
                                                    })
                                                }}
                                            /> */}
                            {/* foreground */}
                            {/* <g transform={zoom.toString()}>
                                                {this.state.nodes.map(node => (
                                                    <Node
                                                        key={node.data.name}
                                                        node={node}
                                                        selectedNode={this.props.selectedNode}
                                                    />
                                                ))}
                                            </g>*/}
                        </svg>
                    )}
                </ParentSize >
            )}
        </>
    )
}

export default FlowDagreD3