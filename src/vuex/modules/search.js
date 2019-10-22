import { SWITCH_SEARCH_RESULT, SWITCH_SEARCH_KEYWORD } from '../types'

const state = {
    keyword: '',
    searchResult: []
}

const mutations = {
    [SWITCH_SEARCH_RESULT] (state, result) {
        state.searchResult = result
    },
    [SWITCH_SEARCH_KEYWORD] (state, keyword) {
        state.keyword = keyword
    }
}

export default {
    state,
    mutations
}