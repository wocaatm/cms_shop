import Vue from 'vue'
import VueRouter from 'vue-router'
// import * as cookie from './lib/cookie'

Vue.use(VueRouter)

const index = resolve => {
    require.ensure(['./views/index'], () => {
        resolve(require('./views/index'))
    })
}

const usercenter = resolve => {
    require.ensure(['./views/usercenter'], () => {
        resolve(require('./views/usercenter'))
    })
}

const detail = resolve => {
    require.ensure(['./views/detail'], () => {
        resolve(require('./views/detail'))
    })
}

const login = resolve => {
    require.ensure(['./views/login'], () => {
        resolve(require('./views/login'))
    })
}

const order = resolve => {
    require.ensure(['./views/user/order'], () => {
        resolve(require('./views/user/order'))
    })
}

const payProduct = resolve => {
    require.ensure(['./views/pay/pay'], () => {
        resolve(require('./views/pay/pay'))
    })
}

// 转换为订单详情
const orderQrcode = resolve => {
    require.ensure(['./views/user/order_qrcode'], () => {
        resolve(require('./views/user/order_qrcode'))
    })
}

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
            path: '/usercenter',
            component: usercenter
        },
        {
            path: '/detail',
            component: detail
        },
        {
            path: '/bindtel',
            component: login
        },
        {
            path: '/order',
            component: order
        },
        {
            path: '/pay',
            component: payProduct
        },
        {
            path: '/order_qrcode',
            component: orderQrcode
        },
        {
            path: '/payDeposit',
            component: payDeposit
        }
    ]
})

routers.beforeEach((to, from, next) => {
    /* 检测id没有的话就跳转到首页 */
    // if (!cookie.hasCookie('jsfyopenid') || !cookie.hasCookie('bid')) {
    //     window.location.href = 'http://v.xujiangyu.com?bid=901'
    //     return
    // }

    next();
})

export default routers
