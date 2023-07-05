import { Box } from '@mui/system';
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { Tree, hierarchy } from "@visx/hierarchy";
import { Zoom } from "@visx/zoom";
import React, { useEffect, useState } from 'react';
import { LineageDataset, LineageEdge, LineageJob, LineageNode } from '../../../../types';
import AnimatedLinks from './AnimatedLinks';
import AnimatedNodes from './AnimatedNodes';
import Node, { NodeType } from './Node';

import 'reactflow/dist/style.css';

interface IKedraData {
    nodes: Array<{
        id: string,
        name: string
    }>;
    edges: Array<{
        source: string,
        target: string
    }>;
}

export type TreeLayout = "cartesian" | "polar";
export type TreeOrientation = "horizontal" | "vertical";
export type LinkType = "diagonal" | "step" | "curve" | "line" | "elbow";

interface FlowHierarchyKedroProps {
    lineageNode: LineageNode[]
}

export interface sourceType {
    children: sourceType[];
    data: { name: string, children: sourceType[], id: string, x0: number, y0: number };
    depth: number;
    height: number;
    parent: sourceType | null;
    x: number;
    y: number;
}

const FlowHierarchyKedro: React.FC<FlowHierarchyKedroProps> = ({ lineageNode }) => {
    const [expandedNodeKeys, setExpandedNodeKeys] = useState<
        Array<string | number>
    >([]);

    // TODO set it in props
    const nodeId = (d: any) => d.id;
    const renderNode = (node: NodeType, onClick: () => any) => {
        return (
            <Node node={node} onClick={onClick} width={192} height={24} />
        )
    }

    const convertLineageNodeDataToD3Hierarchy = (lineageNode: LineageNode[]) => {
        interface INodeData {
            id: string;
            name: string;
            data?: LineageDataset | LineageJob,
            parentsId?: string[],
            children?: Array<INodeData>;
        }

        let data: INodeData = { id: 'root', name: 'root', children: [] } as INodeData;

        const buildNode = (node: LineageNode): INodeData => {
            const children = node.outEdges.map((edge) => lineageNode.find((node) => node.id === edge.destination));

            const parents = node.inEdges.map((edge) => lineageNode.find((node) => node.id === edge.origin));

            return {
                id: node.id,
                name: node.data.name,
                data: node.data,
                parentsId: parents.map((parent) => {
                    if (parent) {
                        parent.id
                    }
                    return ''
                }).filter((parent) => parent !== ''),
                children: children.map((child) => {
                    if (child) {
                        return buildNode(child)
                    }
                    return {} as INodeData;
                }).filter((child) => Object.keys(child).includes('id')),
            }
        }

        console.log('>>>lineageNode', lineageNode)
        // convert kedro data to sourceType
        lineageNode.forEach((node) => {
            if (node.inEdges.length === 0) {
                data.children?.push(buildNode(node))
            }
        })

        console.log('>>>data', data)
        return data;
    }

    const data = convertLineageNodeDataToD3Hierarchy(lineageNode);
    const margin = {
        top: 48, // do not overlap zoom controls by default
        left: 24,
        right: 24,
        bottom: 24
    }
    const nodeWidth = 192 * 1.5
    const nodeHeight = 24 + 16
    const width = 1200 // TODO check the <ParentSize> component
    const height = 800 // TODO check the <ParentSize> component
    //------------------

    const [layout, setLayout] = useState<TreeLayout>("cartesian");
    const [orientation, setOrientation] = useState<TreeOrientation>("horizontal");
    const [linkType, setLinkType] = useState<LinkType>("step");
    const [stepPercent, setStepPercent] = useState<number>(0.5);
    const [layoutSize, setLayoutSize] = useState<"node" | "layout">("node");

    const root = hierarchy(data, (d: any) =>
        expandedNodeKeys.includes(nodeId(d)) ? d.children : null
    );

    // Expand all children by default
    useEffect(() => {
        const allNodeIds: Array<string | number> = [];
        const rootAllChildren = hierarchy(data);
        rootAllChildren.each((node) => allNodeIds.push(nodeId(node.data)));
        setExpandedNodeKeys(allNodeIds);
    }, [lineageNode]);

    let origin: { x: number; y: number };
    let size: [number, number];
    let nodeSize: [number, number] | undefined;

    if (layout === "polar") {
        origin = {
            x: innerWidth / 2 + margin.left,
            y: innerHeight / 2 + margin.top
        };
        size = [2 * Math.PI, Math.min(innerWidth, innerHeight) / 2];
    } else {
        origin = { x: margin.left, y: margin.top };
        if (orientation === "vertical") {
            size = [innerWidth, innerHeight];
            nodeSize =
                layoutSize === "node" && nodeWidth && nodeHeight
                    ? [nodeWidth, nodeHeight]
                    : undefined;
        } else {
            size = [innerHeight, innerWidth];
            nodeSize =
                layoutSize === "node" && nodeWidth && nodeHeight
                    ? [nodeHeight, nodeWidth]
                    : undefined;
        }
    }

    const initialTransform = {
        scaleX: 0.5,
        scaleY: 0.5,
        translateX: orientation === "vertical" ? innerWidth / 2 : origin.x,
        translateY: orientation === "vertical" ? origin.y : innerHeight / 2,
        skewX: 0,
        skewY: 0
    };

    return (
        <div>
            <Box
                position="relative"
                bgcolor="rgba(0,0,0,0.05)"
                border={1}
                borderColor="rgba(0,0,0,.1)"
            >
                <Zoom
                    width={width}
                    height={height}
                    scaleXMin={1 / 4}
                    scaleXMax={4}
                    scaleYMin={1 / 4}
                    scaleYMax={4}
                    initialTransformMatrix={initialTransform}
                >
                    {(zoom: any) => (
                        <>
                            <svg
                                width={width}
                                height={height}
                                style={{ cursor: zoom.isDragging ? "grabbing" : "grab" }}
                            >
                                <Tree
                                    root={root}
                                    size={size}
                                    nodeSize={nodeSize}
                                // separation={(a: any, b: any) =>
                                //   (a.parent == b.parent ? 1 : 0.5) / a.depth
                                // }
                                >
                                    {(tree: any) => {
                                        return (
                                            <>
                                                <rect
                                                    width={width}
                                                    height={height}
                                                    fill="transparent"
                                                    onWheel={(event) => {
                                                        event.preventDefault();
                                                        // zoom.handleWheel(event);
                                                    }}
                                                    onMouseDown={zoom.dragStart}
                                                    onMouseMove={zoom.dragMove}
                                                    onMouseUp={zoom.dragEnd}
                                                    onMouseLeave={() => {
                                                        if (!zoom.isDragging) return;
                                                        zoom.dragEnd();
                                                    }}
                                                    onDoubleClick={(event) => {
                                                        if (event.altKey) {
                                                            const point = localPoint(event);
                                                            zoom.scale({ scaleX: 0.5, scaleY: 0.5, point });
                                                        } else {
                                                            const point = localPoint(event);
                                                            zoom.scale({ scaleX: 2.0, scaleY: 2.0, point });
                                                        }
                                                    }}
                                                />

                                                <Group
                                                    // top={origin.y}
                                                    // left={origin.x}
                                                    transform={zoom.toString()}
                                                >
                                                    <AnimatedLinks
                                                        links={tree.links()}
                                                        nodeId={nodeId}
                                                        linkType={linkType}
                                                        layout={layout}
                                                        orientation={orientation}
                                                        stepPercent={stepPercent}
                                                        stroke="#ccc"
                                                    />
                                                    <AnimatedNodes
                                                        nodes={tree.descendants().reverse()} // render parents on top of children
                                                        nodeId={nodeId}
                                                        layout={layout}
                                                        orientation={orientation}
                                                        renderNode={renderNode}
                                                        onNodeClick={(node) => {
                                                            const nodeKey = nodeId(node.data);
                                                            const isExpanded = expandedNodeKeys.includes(
                                                                nodeKey
                                                            );
                                                            if (isExpanded) {
                                                                setExpandedNodeKeys((prevState) =>
                                                                    prevState.filter((key) => key !== nodeKey)
                                                                );
                                                            } else {
                                                                // Probably not good to edit the node directly
                                                                node.data.x0 = node.x;
                                                                node.data.y0 = node.y;

                                                                setExpandedNodeKeys((prevState) => [
                                                                    ...prevState,
                                                                    nodeKey
                                                                ]);
                                                            }
                                                        }}
                                                    />
                                                </Group>
                                            </>
                                        )
                                    }}
                                </Tree>
                            </svg>
                        </>
                    )}
                </Zoom>
            </Box>
        </div>
    )
}

export default FlowHierarchyKedro