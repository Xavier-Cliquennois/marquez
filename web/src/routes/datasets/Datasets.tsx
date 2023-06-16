// Copyright 2018-2023 contributors to the Marquez project
// SPDX-License-Identifier: Apache-2.0

import * as Redux from 'redux'
import { Container, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { Dataset } from '../../types/api'
import { IState } from '../../store/reducers'
import { MqScreenLoad } from '../../components/core/screen-load/MqScreenLoad'
import { Nullable } from '../../types/util/Nullable'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { datasetFacetsStatus, encodeNode } from '../../helpers/nodes'
import { fetchDatasets, resetDatasets } from '../../store/actionCreators'
import { formatUpdatedAt } from '../../helpers'
import Box from '@mui/material/Box'
import MqEmpty from '../../components/core/empty/MqEmpty'
import MqStatus from '../../components/core/status/MqStatus'
import MqText from '../../components/core/text/MqText'
import React from 'react'

interface StateProps {
  datasets: Dataset[]
  isDatasetsLoading: boolean
  isDatasetsInit: boolean
  selectedNamespace: Nullable<string>
}

interface DispatchProps {
  fetchDatasets: typeof fetchDatasets
  resetDatasets: typeof resetDatasets
}

type DatasetsProps = StateProps & DispatchProps

const Datasets: React.FC<DatasetsProps> = ({ datasets, isDatasetsLoading, isDatasetsInit, selectedNamespace, fetchDatasets, resetDatasets }) => {
  const mounted = React.useRef<boolean>(false)
  const prevSelectedNamespace = React.useRef<Nullable<string>>()

  React.useEffect(() => {
    if (!mounted.current) {
      // on mount
      if (selectedNamespace) {
        fetchDatasets(selectedNamespace)
      }
      mounted.current = true
    } else {
      // on update
      if (
        prevSelectedNamespace.current !== selectedNamespace &&
        selectedNamespace
      ) {
        fetchDatasets(selectedNamespace)
      }

      prevSelectedNamespace.current = selectedNamespace
    }
  })

  React.useEffect(() => {
    return () => {
      // on unmount
      resetDatasets()
    }
  }, [])

  const i18next = require('i18next')
  return (
    <Container maxWidth={'lg'} disableGutters>
      <MqScreenLoad loading={isDatasetsLoading || !isDatasetsInit}>
        <>
          {datasets.length === 0 ? (
            <Box p={2}>
              <MqEmpty title={i18next.t('datasets_route.empty_title')}>
                <MqText subdued>{i18next.t('datasets_route.empty_body')}</MqText>
              </MqEmpty>
            </Box>
          ) : (
            <>
              <Box p={2}>
                <MqText heading>{i18next.t('datasets_route.heading')}</MqText>
              </Box>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell key={i18next.t('datasets_route.name_col')} align='left'>
                      <MqText subheading>{i18next.t('datasets_route.name_col')}</MqText>
                    </TableCell>
                    <TableCell key={i18next.t('datasets_route.namespace_col')} align='left'>
                      <MqText subheading>{i18next.t('datasets_route.namespace_col')}</MqText>
                    </TableCell>
                    <TableCell key={i18next.t('datasets_route.source_col')} align='left'>
                      <MqText subheading>{i18next.t('datasets_route.source_col')}</MqText>
                    </TableCell>
                    <TableCell key={i18next.t('datasets_route.updated_col')} align='left'>
                      <MqText subheading>{i18next.t('datasets_route.updated_col')}</MqText>
                    </TableCell>
                    <TableCell key={i18next.t('datasets_route.status_col')} align='left'>
                      <MqText subheading>{i18next.t('datasets_route.status_col')}</MqText>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datasets
                    .filter(dataset => !dataset.deleted)
                    .map(dataset => {
                      return (
                        <TableRow key={dataset.name}>
                          <TableCell align='left'>
                            <MqText
                              link
                              linkTo={`/lineage/${encodeNode(
                                'DATASET',
                                dataset.namespace,
                                dataset.name
                              )}`}
                            >
                              {dataset.name}
                            </MqText>
                          </TableCell>
                          <TableCell align='left'>
                            <MqText>{dataset.namespace}</MqText>
                          </TableCell>
                          <TableCell align='left'>
                            <MqText>{dataset.sourceName}</MqText>
                          </TableCell>
                          <TableCell align='left'>
                            <MqText>{formatUpdatedAt(dataset.updatedAt)}</MqText>
                          </TableCell>
                          <TableCell align='left'>
                            {datasetFacetsStatus(dataset.facets) ? (
                              <>
                                <MqStatus color={datasetFacetsStatus(dataset.facets)} />
                              </>
                            ) : (
                              <MqText>N/A</MqText>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </>
          )}
        </>
      </MqScreenLoad>
    </Container>
  )
}

const mapStateToProps = (state: IState) => ({
  datasets: state.datasets.result,
  isDatasetsLoading: state.datasets.isLoading,
  isDatasetsInit: state.datasets.init,
  selectedNamespace: state.namespaces.selectedNamespace
})

const mapDispatchToProps = (dispatch: Redux.Dispatch) =>
  bindActionCreators(
    {
      fetchDatasets: fetchDatasets,
      resetDatasets: resetDatasets
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Datasets)
