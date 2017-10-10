import { cloneDeep } from 'lodash'
import { defaultSearchOpt } from './defaults'

export default {
  // 検索結果
  result: {},
  // 検索オプション
  searchOpt: cloneDeep(defaultSearchOpt),
  location: null,
  init: true
}
