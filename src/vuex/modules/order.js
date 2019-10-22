import { INIT_ORDER_LIST, CLEAR_ORDER_LIST, SWITCH_ORDER_TYPE } from '../types'

const state = {
    orderList: [],
    orderType: ''
}

const mutations = {
    [INIT_ORDER_LIST] (state, list) {
        state.orderList = list
    },
    [CLEAR_ORDER_LIST] (state) {
        state.orderList = []
    },
    [SWITCH_ORDER_TYPE] (state, type) {
        state.orderType = type
    }
}

export default {
    state,
    mutations
}