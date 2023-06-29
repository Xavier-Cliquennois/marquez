// Copyright 2018-2023 contributors to the Marquez project
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react'

import { Box, Container, Drawer, createTheme } from '@mui/material'
import { HEADER_HEIGHT } from '../../helpers/theme'
import { IState } from '../../store/reducers'
import { LineageNode } from '../lineage/types'
import { Undefinable } from '../../types/util/Nullable'
import { connect } from 'react-redux'
import { isLineageDataset, isLineageJob } from '../../helpers/nodes'
import { useTheme } from '@emotion/react'
import DatasetDetailPage from '../datasets/DatasetDetailPage'
import JobDetailPage from '../jobs/JobDetailPage'

interface OwnProps {
  selectedNodeData: Undefinable<LineageNode>
}

interface StateProps {
  bottomBarHeight: number
}

type BottomBarProps = StateProps & OwnProps

const BottomBar: React.FC<BottomBarProps> = ({ selectedNodeData }) => {
  const [isOpen, setIsOpen] = React.useState(selectedNodeData ? true : false)
  const theme = createTheme(useTheme())

  const lineageJob = isLineageJob(selectedNodeData?.data)
  const lineageDataset = isLineageDataset(selectedNodeData?.data)

  useEffect(() => {
    setIsOpen(selectedNodeData ? true : false)
  }, [selectedNodeData])

  return (
    <Drawer
      open={isOpen}
      anchor='right'
      onClose={() => setIsOpen(false)}
      hideBackdrop={true}
      sx={{
        width: 'fit-content'
      }}
    >
      <Box sx={{
        backgroundColor: theme.palette.background.default,
        marginTop: `${HEADER_HEIGHT}px`,
        minWidth: '600px',
        height: '100%',
        padding: '0rem 1rem'
      }}>
        <Container maxWidth={'lg'} disableGutters={true}>
          {lineageJob && <JobDetailPage job={lineageJob} />}
          {lineageDataset && <DatasetDetailPage lineageDataset={lineageDataset} />}
        </Container>
      </Box>
    </Drawer >
  )
}

const mapStateToProps = (state: IState) => ({
  bottomBarHeight: state.lineage.bottomBarHeight,
  selectedNodeData: state.lineage.lineage.graph.find(node => state.lineage.selectedNode === node.id)
})

export default connect(mapStateToProps)(BottomBar)
