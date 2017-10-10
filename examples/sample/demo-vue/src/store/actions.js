import $ from 'jquery'
import * as types from './mutationsTypes'

const GnaviAPI = {
  search: function(query) {
    const defer = $.Deferred();
    $.ajax({
      url: 'http://api.gnavi.co.jp/RestSearchAPI/20150630/?callback=?',
      data: query,
      dataType: 'jsonp',
      success: defer.resolve,
      error: defer.reject
    });
    return defer.promise();
  }
}

export default {
  initLocation({ commit, state }) {
    if (!navigator.geolocation) {
      alert( 'あなたの端末では、現在位置を取得できません。' )
      return
    }

    function successFunc(position) {
      // set gnavi api param
      commit (types.SET_LOCATION, position)
    }
    function errorFunc(error) {
      var errorMessage = {
        0: '原因不明のエラーが発生しました。',
        1: '位置情報の取得が許可されませんでした。',
        2: '電波状況などで位置情報が取得できませんでした。',
        3: '位置情報の取得に時間がかかり過ぎてタイムアウトしました。',
      }

      alert( errorMessage[error.code] )
    }
    const optionObj = {
      'enableHighAccuracy': false,
      'timeout': 8000,
      'maximumAge': 5000,
    }

    navigator.geolocation.getCurrentPosition(successFunc, errorFunc, optionObj)
  },
  updateSearchOpt({ commit, state }, order) {
    commit(types.UPDATE_SEARCH_OPT, order)
  },
  getGnaviList({ commit, state }) {
    $.when(GnaviAPI.search(state.searchOpt))
      .then((result) => {
        commit(types.SET_RESULT, result)
      })
  },
  resetState({ commit, state }) {
    commit(types.RESET)
  }
}
