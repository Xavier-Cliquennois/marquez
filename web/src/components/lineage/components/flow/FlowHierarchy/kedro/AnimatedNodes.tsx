import React from 'react';
import { useTransition, animated } from 'react-spring';

import { findCollapsedParent, translateCoords } from '../utils/treeUtils';
import { TreeLayout, TreeOrientation } from '../FlowHierarchy';

export type AnimatedNodesProps = {
    nodes: any[];
    nodeId: (node: any) => number | string;
    layout?: TreeLayout;
    orientation?: TreeOrientation;
    renderNode: (node: any, onClick: () => any) => React.ReactNode;
    onNodeClick: (node: any) => any;
};

type transitionProps = {
    opacity: number;
    xy: number[];
}

function AnimatedNodes(props: AnimatedNodesProps) {
    const { nodes, nodeId, renderNode, onNodeClick } = props;

    const transitions = useTransition<
        transitionProps,
        any
    >(
        nodes,
        //(node) => nodeId(node.data), 
        {
            // config: { tension: 1000, friction: 130, mass: 5 },
            from: (node: any) => {
                const { x, y } = translateCoords(
                    node.parent || { x: 0, y: 0 },
                    props.layout,
                    props.orientation
                );
                return {
                    xy: [x, y],
                    opacity: 0,
                };
            },
            enter: (node: any) => {
                const { x, y } = translateCoords(node, props.layout, props.orientation);
                return {
                    xy: [x, y],
                    opacity: 1,
                };
            },
            update: (node: any) => {
                const { x, y } = translateCoords(node, props.layout, props.orientation);
                return {
                    xy: [x, y],
                    opacity: 1,
                };
            },
            leave: (node: any) => {
                if (node.parent) {
                    // child leaving
                    const collapsedParent = findCollapsedParent(node.parent);
                    const { x, y } = translateCoords(
                        {
                            x: collapsedParent
                                ? collapsedParent.data.x0 ?? collapsedParent.x
                                : 0,
                            y: collapsedParent
                                ? collapsedParent.data.y0 ?? collapsedParent.y
                                : 0,
                        },
                        props.layout,
                        props.orientation
                    );
                    return {
                        xy: [x, y],
                        opacity: 0,
                    };
                } else {
                    // root node leaving (new tree likely)
                    const { x, y } = translateCoords(
                        { x: 0, y: 0 },
                        props.layout,
                        props.orientation
                    );
                    return {
                        xy: [x, y],
                        opacity: 0,
                    };
                }
            },
        });

    return (
        <>
            {transitions((style, item, transitionState, index) => (
                <animated.g
                    opacity={style.opacity}
                    transform={style.xy.interpolate(
                        (x: number, y: number) => `translate(${x}, ${y})`
                    )}
                    key={index}
                >
                    {renderNode(item, () => onNodeClick(item))}
                </animated.g>
            ))}
        </>
    );
}

export default AnimatedNodes;
