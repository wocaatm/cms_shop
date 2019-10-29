import { INIT_LOGING_USER, USER_LOGOUT_ACTION, BIND_TEL_FLAG } from '../types'
import * as cookie from '../../lib/cookie'

function getSkiTag () {
  if (cookie.hasCookie('userInfo')) {
    let userInfoStr = cookie.getCookie('userInfo');
    let decodeInfo = decodeURIComponent(userInfoStr);
    let realInfo = decodeInfo.substr(6, decodeInfo.length - 6)
    
    // console.log(decodeURIComponent(cookie.getCookie('userInfo')).substr(7, ))
    // 去掉think:
    const userInfo = JSON.parse(realInfo);
    
    const bindedTel = cookie.getCookie('bindedTel');
    
    return {
      ...userInfo,
      portrait: decodeURIComponent(userInfo.portrait),
      bindedTel
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
    },
    [BIND_TEL_FLAG] (state, tel) {
      state.userinfo.bindedTel = tel;
    }
}

export default {
    state,
    mutations
}
