import React from 'react';

import { Text } from '@visx/text';
import { blue, common, grey } from '@mui/material/colors';

export type NodeType = {
    depth: number;
    children: any | null;
    data: any;
}

interface NodeProps {
    node: NodeType;
    width?: number;
    height?: number;
    onClick: () => any;
}

function Node(props: NodeProps) {
    const { node, onClick, width = 48, height = 24 } = props;

    return (
        <>
            <rect
                width={width}
                height={height}
                x={-width / 2}
                y={-height / 2}
                fill="white"
                stroke={node.data.children ? blue[500] : blue[300]}
                rx={8}
                onClick={onClick}
                {...(node.data.children && {
                    style: { cursor: 'pointer' },
                })}
            />
            <Text
                fontFamily="Arial"
                textAnchor="middle"
                verticalAnchor="middle"
                style={{ pointerEvents: 'none' }}
                fill={
                    node.data.children
                        ? common.black
                        : grey[500]
                }
            >
                {node.data.name}
            </Text>
        </>
    );
}

export default Node;
