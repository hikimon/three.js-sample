import { cloneDeep } from 'lodash'
import * as types from './mutationsTypes'
import { defaultSearchOpt } from './defaults'

export default {
  [types.UPDATE_SEARCH_OPT](state, data) {
    console.log(data)
    state.searchOpt[data.key] = data.value
  },
  [types.SET_LOCATION](state, data) {
    state.location = data.coords
    state.searchOpt.latitude  = data.coords.latitude
    state.searchOpt.longitude = data.coords.longitude
  },
  [types.SET_RESULT](state, data) {
    state.result = data
    state.init   = false
  },
  [types.RESET](state, data) {
    state.searchOpt = cloneDeep(defaultSearchOpt)
    state.searchOpt.latitude  = state.location.latitude
    state.searchOpt.longitude = state.location.longitude
    state.init                = true
  },
}
