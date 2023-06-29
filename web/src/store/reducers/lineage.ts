// Copyright 2018-2023 contributors to the Marquez project
// SPDX-License-Identifier: Apache-2.0

import {
  FETCH_LINEAGE_SUCCESS,
  RESET_LINEAGE,
  SET_BOTTOM_BAR_HEIGHT,
  SET_SELECTED_NODE
} from '../actionCreators/actionTypes'
import { HEADER_HEIGHT } from '../../helpers/theme'
import { LineageGraph } from '../../types/api'
import { Nullable } from '../../types/util/Nullable'
import { setSelectedNode } from '../actionCreators'

export interface ILineageState {
  lineage: LineageGraph
  selectedNode: Nullable<string>
}

const initialState: ILineageState = {
  lineage: { graph: [] },
  selectedNode: null,
}

type ILineageActions = ReturnType<typeof setSelectedNode>

const DRAG_BAR_HEIGHT = 8

export default (state = initialState, action: ILineageActions) => {
  switch (action.type) {
    case FETCH_LINEAGE_SUCCESS:
      return { ...state, lineage: action.payload }
    case SET_SELECTED_NODE:
      return { ...state, selectedNode: action.payload }
    case RESET_LINEAGE: {
      return { ...state, lineage: { graph: [] } }
    }
    default:
      return state
  }
}
