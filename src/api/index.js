import axios from 'axios'
import * as cookie from '../lib/cookie'

const bid = cookie.getCookie('bid');

function config(query) {
    const config = {
        baseURL: 'http://v.xujiangyu.com/'
    }
    
    if (query) {
      config.params = {
        bid,
        ...query
      }
    }
    return config
}

export default {
    initSwipe: function () {
        return axios.get('/getBusinessInfo', config({}))
    },
    getProductList: function (data) {
        return axios.get('/getProductList', config(data))
    },
    getIndexCategory: function () {
        return axios.get('/index/category', config())
    },
    getShopCart: function () {
        return axios.get('/cart/detail', config())
    },
    getProductDetail: function (data) {
        return axios.get('/getProductInfo', config(data))
    },
    sendQrcode: function (data) {
        return axios.post('/index/sendqrcode', data, config())
    },
    login: function (data) {
        return axios.post('/index/login', data, config())
    },
    getOrderList: function (data) {
        return axios.get('/order/list', config(data))
    },
    getOrderDetail: function (data) {
        return axios.get('/getOrderDetail', config(data))
    },
    verifyCart: function (data) {
        return axios.get('/createOrder', config(data))
    },
    getPayJsParameters: function (data) {
        return axios.post('/index/pay', data, config())
    },
    search: function (data) {
        return axios.get('/index/search', config(data))
    },
    assocaiteOrder: function (data) {
        return axios.post('/index/assocaite', data, config())
    },
    payDeposit: function (data) {
        return axios.post('/index/payDeposit', data, config())
    },
    getQrcodeInfo: function (data) {
        return axios.get('/index/qrcode', config(data))
    },
    remark: function (data) {
        return axios.post('/index/remark', data, config())
    },
    deleteOrder: function (data) {
        return axios.post('/index/deleteOrder', data, config())
    },
    payBack: function (data) {
        return axios.post('/index/payBack', data, config())
    },
    unbindOrder: function (data) {
        return axios.post('/index/unbindOrder', data, config())
    },
    getUserField: function (data) {
        return axios.get('/user/info', config(data))
    },
    saveUserInfo: function (data) {
        return axios.post('/user/save', data, config())
    },
    getQrcodeNeedInfo: function (data) {
        return axios.get('/user/qrcode', config())
    },
    saveQrocdeInfo: function (data) {
        return axios.post('/user/saveQrcode', data, config())
    }
}
