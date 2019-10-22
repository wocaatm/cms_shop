import { INIT_PRODUCT_LIST, LOAD_MORE_PRODUCT, HAS_MORE_PRODUCT} from '../types'

const state = {
    productList: [],
    hasMore: false
}

const mutations = {
    [INIT_PRODUCT_LIST] (state, list) {
        state.productList = list
    },
    [LOAD_MORE_PRODUCT] (state, more) {
        more.forEach(function (item) {
            state.productList.push(item)
        })
    },
    [HAS_MORE_PRODUCT] (state, flag) {
        state.hasMore = flag
    }
}

export default {
    state,
    mutations
}