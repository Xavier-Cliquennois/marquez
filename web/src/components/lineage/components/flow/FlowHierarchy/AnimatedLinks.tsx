import React from 'react';
import { Group } from '@visx/group';
import { useTransition, animated } from 'react-spring';

import Link, { LinkProps } from './Link';
import { findCollapsedParent } from './utils/treeUtils';
import { sourceType } from './FlowHierarchy';

interface LinkData {
    source: sourceType;
    target: sourceType;
}

type AnimatedLinksProps = {
    links: LinkData[];
    nodeId: (node: sourceType) => string | number;
} & Omit<LinkProps, 'sx' | 'sy' | 'tx' | 'ty' | 'ref'>;

const AnimatedLink = animated(Link);

// TODO: Offset based on nodeWidth

function AnimatedLinks(props: AnimatedLinksProps) {
    const { links, nodeId, ...linkProps } = props;
    const transitions = useTransition<LinkData, any>(
        links,
        {
            from: (linkdata: LinkData) => ({
                sx: linkdata.source.data.x0 ?? linkdata.source.x,
                sy: linkdata.source.data.y0 ?? linkdata.source.y,
                tx: linkdata.source.data.x0 ?? linkdata.target.x,
                ty: linkdata.source.data.y0 ?? linkdata.target.y,
            }),
            enter: (linkdata: LinkData) => ({
                sx: linkdata.source.x,
                sy: linkdata.source.y,
                tx: linkdata.target.x,
                ty: linkdata.target.y,
            }),
            update: (linkdata: LinkData) => ({
                sx: linkdata.source.x,
                sy: linkdata.source.y,
                tx: linkdata.target.x,
                ty: linkdata.target.y,
            }),
            leave: (linkdata: LinkData) => {
                const collapsedParent = findCollapsedParent(linkdata.source);
                return {
                    sx: collapsedParent.data.x0 ?? collapsedParent.x,
                    sy: collapsedParent.data.y0 ?? collapsedParent.y,
                    tx: collapsedParent.data.x0 ?? collapsedParent.x,
                    ty: collapsedParent.data.y0 ?? collapsedParent.y,
                };
            },
        }
    );

    return (
        <Group>
            {transitions((style, item, transitionState, index) => (
                <AnimatedLink
                    sx={style.sx}
                    sy={style.sy}
                    tx={style.tx}
                    ty={style.ty}
                    {...linkProps}
                    key={index}
                />
            ))}
        </Group>
    );
}

export default AnimatedLinks;
