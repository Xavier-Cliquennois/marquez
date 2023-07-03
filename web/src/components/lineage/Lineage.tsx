// Copyright 2018-2023 contributors to the Marquez project
// SPDX-License-Identifier: Apache-2.0

import React from 'react'

import '../../i18n/config'
import * as Redux from 'redux'
import { Box } from '@mui/material'
import { DAGRE_CONFIG, NODE_SIZE } from './config'
import { GraphEdge, Node as GraphNode, graphlib, layout } from 'dagre'
import { HEADER_HEIGHT } from '../../helpers/theme'
import { IState } from '../../store/reducers'
import { JobOrDataset, LineageNode, MqNode } from './types'
import { LineageGraph } from '../../types/api'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchLineage, resetLineage, setSelectedNode } from '../../store/actionCreators'
import { generateNodeId } from '../../helpers/nodes'
import { useParams } from 'react-router-dom'
import MqEmpty from '../core/empty/MqEmpty'
import MqText from '../core/text/MqText'
import FlowDagre from './components/flow/FlowDagre'
import FlowHierarchy from './components/flow/FlowHierarchy/FlowHierarchy'

const BOTTOM_OFFSET = 8

interface StateProps {
  lineage: LineageGraph
  selectedNode: string
}

interface LineageState {
  graph: graphlib.Graph<MqNode>
  edges: GraphEdge[]
  nodes: GraphNode<MqNode>[]
}

interface DispatchProps {
  setSelectedNode: typeof setSelectedNode
  fetchLineage: typeof fetchLineage
  resetLineage: typeof resetLineage
}

export interface JobOrDatasetMatchParams {
  nodeName: string
  namespace: string
  nodeType: string
}

export function initGraph() {
  const g = new graphlib.Graph<MqNode>({ directed: true })
  g.setGraph(DAGRE_CONFIG)
  g.setDefaultEdgeLabel(() => {
    return {}
  })

  return g;
}

export function buildGraphAll(g: graphlib.Graph<MqNode>, graph: LineageNode[], callBack: (g: graphlib.Graph<MqNode>) => void) {
  // nodes
  for (let i = 0; i < graph.length; i++) {
    g.setNode(graph[i].id, {
      label: graph[i].id,
      data: graph[i].data,
      width: NODE_SIZE,
      height: NODE_SIZE
    })
  }

  // edges
  for (let i = 0; i < graph.length; i++) {
    for (let j = 0; j < graph[i].inEdges.length; j++) {
      g.setEdge(graph[i].inEdges[j].origin, graph[i].id)
    }
  }
  layout(g)

  callBack(g)
}


export function getSelectedPaths(g: graphlib.Graph<MqNode>, selectedNode: string) {
  const paths = [] as Array<[string, string]>

  // Sets used to detect cycles and break out of the recursive loop
  const visitedNodes = {
    successors: new Set(),
    predecessors: new Set()
  }

  const getSuccessors = (node: string) => {
    if (visitedNodes.successors.has(node)) return
    visitedNodes.successors.add(node)

    const successors = g?.successors(node)
    if (successors?.length) {
      for (let i = 0; i < node.length - 1; i++) {
        if (successors[i]) {
          paths.push([node, (successors[i] as unknown) as string])
          getSuccessors((successors[i] as unknown) as string)
        }
      }
    }
  }

  const getPredecessors = (node: string) => {
    if (visitedNodes.predecessors.has(node)) return
    visitedNodes.predecessors.add(node)

    const predecessors = g?.predecessors(node)
    if (predecessors?.length) {
      for (let i = 0; i < node.length - 1; i++) {
        if (predecessors[i]) {
          paths.push([(predecessors[i] as unknown) as string, node])
          getPredecessors((predecessors[i] as unknown) as string)
        }
      }
    }
  }

  getSuccessors(selectedNode)
  getPredecessors(selectedNode)

  return paths
}

export interface LineageProps extends StateProps, DispatchProps {}

let g: graphlib.Graph<MqNode>

const Lineage: React.FC<LineageProps> = (props: LineageProps) => {

  const [state, setState] = React.useState<LineageState>({
    graph: g,
    edges: [],
    nodes: []
  })
  const { nodeName, namespace, nodeType } = useParams()
  const mounted = React.useRef<boolean>(false)

  const prevLineage = React.useRef<LineageGraph>()
  const prevSelectedNode = React.useRef<string>()

  React.useEffect(() => {
    if (!mounted.current) {
      // on mount
      if (nodeName && namespace && nodeType) {
        const nodeId = generateNodeId(
          nodeType.toUpperCase() as JobOrDataset,
          namespace,
          nodeName
        )
        props.setSelectedNode(nodeId)
        props.fetchLineage(
          nodeType.toUpperCase() as JobOrDataset,
          namespace,
          nodeName
        )
      }
      mounted.current = true
    } else {
      // on update
      if (
        JSON.stringify(props.lineage) !== JSON.stringify(prevLineage.current) &&
        props.selectedNode
      ) {
        g = initGraph()
        buildGraphAll(g, props.lineage.graph, (gResult: graphlib.Graph<MqNode>) => {
          setState({
            graph: gResult,
            edges: getEdges(),
            nodes: gResult.nodes().map(v => gResult.node(v))
          })
        })
      }
      if (props.selectedNode !== prevSelectedNode.current) {
        props.fetchLineage(
          nodeType?.toUpperCase() as JobOrDataset,
          namespace || '',
          nodeName || ''
        )
        getEdges()
      }

      prevLineage.current = props.lineage
      prevSelectedNode.current = props.selectedNode
    }
  })

  React.useEffect(() => {
    // on unmount
    return () => {
      props.resetLineage()
    }
  }, [])

  const getEdges = () => {
    const selectedPaths = getSelectedPaths(g, props.selectedNode)

    return g?.edges().map(e => {
      const isSelected = selectedPaths.some((r: any) => e.v === r[0] && e.w === r[1])
      return Object.assign(g.edge(e), { isSelected: isSelected })
    })
  }

  const i18next = require('i18next')

    return (
      <Box sx={{
        marginTop: `${HEADER_HEIGHT}px`,
        height: `calc(100vh - ${HEADER_HEIGHT}px - ${BOTTOM_OFFSET}px)`
      }}>
        {props.selectedNode === null && (
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'} pt={2}>
            <MqEmpty title={i18next.t('lineage.empty_title')}>
              <MqText subdued>{i18next.t('lineage.empty_body')}</MqText>
            </MqEmpty>
          </Box>
        )}
        {state?.graph && <FlowHierarchy lineageNode={props.lineage.graph} />}
      </Box>
    )
}

const mapStateToProps = (state: IState) => ({
  lineage: state.lineage.lineage,
  selectedNode: state.lineage.selectedNode
})

const mapDispatchToProps = (dispatch: Redux.Dispatch) =>
  bindActionCreators(
    {
      setSelectedNode: setSelectedNode,
      fetchLineage: fetchLineage,
      resetLineage: resetLineage
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Lineage)