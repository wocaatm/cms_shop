import { INIT_PRODUCT_DETAIL } from '../types'

const state = {
    info: {}
}

const mutations = {
    [INIT_PRODUCT_DETAIL] (state, info) {
        state.info = info
    }
}

export default {
    state,
    mutations
}