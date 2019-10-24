import Vue from 'vue'
import VueRouter from 'vue-router'
// import * as cookie from './lib/cookie'

Vue.use(VueRouter)

const index = resolve => {
    require.ensure(['./views/index'], () => {
        resolve(require('./views/index'))
    })
}

const search = resolve => {
    require.ensure(['./views/search'], () => {
        resolve(require('./views/search'))
    })
}

// const shopcart = resolve => {
//     require.ensure(['./views/shopcart'], () => {
//         resolve(require('./views/shopcart'))
//     })
// }

const usercenter = resolve => {
    require.ensure(['./views/usercenter'], () => {
        resolve(require('./views/usercenter'))
    })
}

// 商品列表
// const category = resolve => {
//     require.ensure(['./views/category'], () => {
//         resolve(require('./views/category'))
//     })
// }

const detail = resolve => {
    require.ensure(['./views/detail'], () => {
        resolve(require('./views/detail'))
    })
}

// const login = resolve => {
//     require.ensure(['./views/login'], () => {
//         resolve(require('./views/login'))
//     })
// }

const order = resolve => {
    require.ensure(['./views/user/order'], () => {
        resolve(require('./views/user/order'))
    })
}

// const orderThird = resolve => {
//     require.ensure(['./views/user/order_third'], () => {
//         resolve(require('./views/user/order_third'))
//     })
// }
//
// const userinfo = resolve => {
//     require.ensure(['./views/user/userinfo'], () => {
//         resolve(require('./views/user/userinfo'))
//     })
// }

const payProduct = resolve => {
    require.ensure(['./views/pay/pay'], () => {
        resolve(require('./views/pay/pay'))
    })
}

// 订单办理押金
// const orderDeposit = resolve => {
//     require.ensure(['./views/user/order_deposit'], () => {
//         resolve(require('./views/user/order_deposit'))
//     })
// }

// 转换为订单详情
const orderQrcode = resolve => {
    require.ensure(['./views/user/order_qrcode'], () => {
        resolve(require('./views/user/order_qrcode'))
    })
}

// 二维码信息
// const orderQrcodeInfo = resolve => {
//     require.ensure(['./views/user/qrcode_info'], () => {
//         resolve(require('./views/user/qrcode_info'))
//     })
// }

const payDeposit = resolve => {
    require.ensure(['./views/pay/pay_deposit'], () => {
        resolve(require('./views/pay/pay_deposit'))
    })
}

var routers = new VueRouter({
    mode: 'history',
    base: '/shop/',
    routes: [
        {
            path: '/',
            component: index
        },
        {
            path: '/search',
            component: search
        },
        // {
        //     path: '/shopcart',
        //     component: shopcart,
        //     meta: { requiresAuth: true }
        // },
        {
            path: '/usercenter',
            component: usercenter,
            meta: { requiresAuth: true }
        },
        // {
        //     path: '/category',
        //     component: category
        // },
        {
            path: '/detail',
            component: detail
        },
        // {
        //     path: '/login',
        //     component: login
        // },
        {
            path: '/order',
            component: order,
            meta: { requiresAuth: true }
        },
        // {
        //     path: '/order_third',
        //     component: orderThird,
        //     meta: { requiresAuth: true }
        // },
        // {
        //     path: '/userinfo',
        //     component: userinfo,
        //     meta: { requiresAuth: true }
        // },
        {
            path: '/pay',
            component: payProduct,
            meta: { requiresAuth: true }
        },
        // {
        //     path: '/order_deposit',
        //     component: orderDeposit,
        //     meta: { requiresAuth: true }
        // },
        {
            path: '/order_qrcode',
            component: orderQrcode,
            meta: { requiresAuth: true }
        },
        // {
        //     path: '/qrcode_info',
        //     component: orderQrcodeInfo,
        //     meta: { requiresAuth: true }
        // },
        {
            path: '/payDeposit',
            component: payDeposit,
            meta: { requiresAuth: true }
        }
    ]
})

routers.beforeEach((to, from, next) => {
    next()
    /* 检测id没有的话就跳转到首页 */
    // if (!cookie.hasCookie('jfyopenid') || !cookie.hasCookie('openid') || !cookie.hasCookie('skiId')) {
    //     window.location.href = 'http://wei.softykt.com'
    //     return
    // }
    // if (cookie.hasCookie('newscenic')) {
    //     cookie.delCookie('newscenic')
    //     cookie.delCookie('userinfo')
    // }
    // if (cookie.hasCookie('scenicinfo')) {
    //     document.title = cookie.getCookie('scenicinfo') ? cookie.getCookie('scenicinfo') : '金色飞鹰'
    // }
    // if (to.matched.some(record => record.meta.requiresAuth)) {
    //     if (!cookie.hasCookie('userinfo_' + cookie.getCookie('skiId'))) {
    //         next({
    //             path: '/login',
    //             query: {
    //                 redirect: to.fullPath
    //             }
    //         })
    //     } else {
    //         next()
    //     }
    // } else {
    //     next()
    // }
})

export default routers
