import { INIT_LOGING_USER, USER_LOGOUT_ACTION } from '../types'
import * as cookie from '../../lib/cookie'

function getSkiTag () {
    return cookie.hasCookie('skiId') ? 'userinfo_' + cookie.getCookie('skiId') : false
}
function getUserFromCookie () {
    var tag = getSkiTag()
    if (!tag) return false
    if (cookie.hasCookie(tag)) {
        return cookie.getCookie(tag)
    }
    return false
}

const state = {
    userinfo: getUserFromCookie() || ''
}

const mutations = {
    [INIT_LOGING_USER] (state, info) {
        cookie.setCookie(getSkiTag(), info, 3600)
        state.userinfo = info
    },
    [USER_LOGOUT_ACTION] (state) {
        cookie.delCookie(getSkiTag())
        state.userinfo = ''
    }
}

export default {
    state,
    mutations
}