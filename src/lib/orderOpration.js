//response 响应的状态码  1 未付款  2 已付款未激活  3 已付款已激活未使用 4 已付款已激活已使用 5 已使用 6 退款
//opration 1 跳转付款 2 删除订单confirm  3 办理押金  4 分配消费码  5 申请退款  6 解除绑定
const opration = {
    "1": [
        {
            opration: 1,
            text: '去付款',
            router: '/pay',
            class: ''
        },
        {
            opration: 2,
            text: '删除订单',
            router: '',
            class: 'delete'
        }
    ],
    "2": [
        {
            opration: 5,
            text: '申请退款',
            router: '',
            class: ''
        },
        {
            opration: 3,
            text: '办理押金',
            router: '/order_deposit',
            class: ''
        }
    ],
    "21": [
        {
            opration: 6,
            text: '解除绑定',
            router: '',
            class: ''
        },
        {
            opration: 3,
            text: '办理押金',
            router: '/order_deposit',
            class: ''
        }
    ],
    "22": [
        {
            opration: 3,
            text: '办理押金',
            router: '/order_deposit',
            class: ''
        }
    ],
    "23": [
        {
            opration: 5,
            text: '申请退款',
            router: '',
            class: ''
        }
    ],
    "3": [
        {
            opration: 4,
            text: '卡码',
            router: '/order_qrcode',
            class: ''
        }
    ],
    "4": [
        {
            opration: 4,
            text: '卡码',
            router: '/order_qrcode',
            class: ''
        }
    ],
    "d": [
        {
            opration: 2,
            text: '删除订单',
            router: '',
            class: 'delete'
        }
    ]
}

export default opration