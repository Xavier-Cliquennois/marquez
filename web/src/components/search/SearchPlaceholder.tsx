// Copyright 2018-2023 contributors to the Marquez project
// SPDX-License-Identifier: Apache-2.0

import { Box } from '@mui/material'
import { theme } from '../../helpers/theme'
import MqText from '../core/text/MqText'
import React from 'react'

const importI18next = () => {
  const i18next = require('i18next')
  return i18next
}

interface SearchPlaceholderProps { }

const SearchPlaceholder: React.FC<SearchPlaceholderProps> = () => {
  const i18next = importI18next()
  return (
    <Box sx={{
      zIndex: theme.zIndex.appBar + 3,
      position: 'absolute',
      top: 8,
      left: 122,
      height: 0,
      overflow: 'visible',
      pointerEvents: 'none'
    }}>
      <Box display={'inline'}>
        <MqText disabled inline>
          {' '}
          {i18next.t('search.search')}
        </MqText>{' '}
        <MqText bold inline font={'mono'} color={theme.palette.common.white}>
          {' '}
          {i18next.t('search.jobs')}
        </MqText>{' '}
        <MqText disabled inline>
          {' '}
          {i18next.t('search.and')}
        </MqText>{' '}
        <MqText bold inline font={'mono'} color={theme.palette.common.white}>
          {' '}
          {i18next.t('search.datasets')}
        </MqText>
      </Box>
    </Box>
  )
}

export default SearchPlaceholder
