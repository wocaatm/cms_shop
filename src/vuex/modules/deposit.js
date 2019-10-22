import { DEPOSIT_ORDER_INFO, CLEAR_DEPOSIT_INFO } from '../types'

const state = {
    info: ''
}

const mutations = {
    [DEPOSIT_ORDER_INFO] (state, info) {
        state.info = info
    },
    [CLEAR_DEPOSIT_INFO] (state) {
        state.info = ''
    }
}

export default {
    state,
    mutations
}