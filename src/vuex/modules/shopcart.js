import { SWITCH_PRODUCT_IN_CART, DELETE_PRODUCT_IN_CART, SELECT_PRODUCT_INDEX, LOGING_REFRESH_CART, SWITCH_PRODUCT_STATE } from '../types'
import * as cookie from '../../lib/cookie'

/* 获取userinfo的tag */
function getSkiTag () {
    return cookie.hasCookie('skiId') ? 'userinfo_' + cookie.getCookie('skiId') : false
}

/* 获取cookieTag */
function getShopCartTag () {
    var tag = getSkiTag()
    if (!tag) return false
    if (cookie.hasCookie(tag)) {
        var userId = cookie.getCookie(tag).userId
        var skiId = cookie.getCookie('skiId')
        return `shop_shopcart_${skiId}_${userId}`
    }
    return false
}

function getCartFromCookie () {
    var userShop = getShopCartTag()
    if (!userShop) return false
    if (cookie.hasCookie(userShop)) {
        return cookie.getCookie(userShop)
    }
    return false
}

const state = {
    cart: getCartFromCookie() || [],
    selectedIndex: []
}

const mutations = {
    [SWITCH_PRODUCT_IN_CART] (state, product) {
        var addshopcart = true
        var multishopcart = false
        var multiIndex = -1
        state.cart.forEach(function (item, i) {
            if (item.id == product.id) {
                addshopcart = false
                item.count += product.count
                if (!item.count) {
                    multishopcart = true
                    multiIndex = i
                }
            }
        })
        if (addshopcart) {
            product.state = 1
            state.cart.push(product)
        }
        if (multishopcart) {
            state.cart.splice(multiIndex, 1)
        }
        cookie.delCookie(getShopCartTag())
        cookie.setCookie(getShopCartTag(), state.cart, 3600)
    },
    [DELETE_PRODUCT_IN_CART] (state, ids) {
        ids.forEach(function (id, index) {
            for (let i = 0; i < state.cart.length; i++) {
                if (state.cart[i].id == id) {
                    state.cart.splice(i, 1)
                    break
                }
            }
        })
        cookie.delCookie(getShopCartTag())
        cookie.setCookie(getShopCartTag(), state.cart, 3600)
    },
    [SWITCH_PRODUCT_STATE] (state, ids) {
        if (ids === 'all') {
            for (let i = 0; i < state.cart.length; i++) {
                state.cart[i].state = 0
            }
        } else {
            for (let i = 0; i < state.cart.length; i++) {
                if (state.cart[i].id == ids) {
                    state.cart[i].state = 0
                    break
                }
            }
        }
        cookie.delCookie(getShopCartTag())
        cookie.setCookie(getShopCartTag(), state.cart, 3600)
    },
    [SELECT_PRODUCT_INDEX] (state, indexs) {
        state.selectedIndex = indexs
    },
    [LOGING_REFRESH_CART] (state) {
        var cart = getCartFromCookie() || []
        state.cart = cart
    }
}

export default {
    state,
    mutations
}