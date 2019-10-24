import { INIT_LOGING_USER, USER_LOGOUT_ACTION } from '../types'
import * as cookie from '../../lib/cookie'

function getSkiTag () {
  if (cookie.hasCookie('userInfo')) {
    // 去掉think:
    const userInfo = JSON.parse(decodeURIComponent(cookie.getCookie('userInfo')).substr(6));
    
    return {
      ...userInfo,
      portrait: decodeURIComponent(userInfo.portrait)
    }
  } else {
    return false
  }
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
    userinfo: getSkiTag() || ''
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
