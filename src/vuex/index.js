import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import index from './modules/index'
import product from './modules/product'
import shopcart from './modules/shopcart'
import detail from './modules/detail'
import user from './modules/user'
import order from './modules/order'
import search from './modules/search'
import deposit from './modules/deposit'

Vue.use(Vuex)

const store = new Vuex.Store({
    actions,
    getters,
    modules: {
        index,
        product,
        shopcart,
        detail,
        user,
        order,
        search,
        deposit
    }
})

export default store
