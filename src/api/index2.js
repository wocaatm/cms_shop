import axios from 'axios'

function config(query) {
    const config = {
        baseURL: 'http://localhost:8002'
    }
    if (query) {
        config.params = query
    }
    return config
}

export default {
    initSwipe: function () {
        return axios.get('/api/initSwipe', config())
    },
    getProductList: function (data) {
        return axios.get('/index/product', config(data))
    },
    getIndexCategory: function () {
        return axios.get('/api/getIndexCategory', config())
    },
    getShopCart: function () {
        return axios.get('/api/getShopCart', config())
    },
    getProductDetail: function (data) {
        return axios.get('/api/getProductDetail', config(data))
    },
    sendQrcode: function (data) {
        return axios.post('/api/sendQrcode', data, config())
    },
    login: function (data) {
        return axios.post('/api/login', data, config())
    },
    getOrderList: function (data) {
        return axios.get('/api/getOrderList', config(data))
    },
    getOrderDetail: function (data) {
        return axios.get('/api/getOrderDetail', config(data))
    },
    verifyCart: function (data) {
        return axios.post('/api/verifyCart', data, config())
    },
    getPayJsParameters: function (data) {
        return axios.post('/api/getPayJsParameters', data, config())
    },
    search: function (data) {
        return axios.get('/api/search', config(data))
    },
    assocaiteOrder: function (data) {
        return axios.post('/api/assocaiteOrder', data, config())
    },
    payDeposit: function (data) {
        return axios.post('/api/payDeposit', data, config())
    },
    getQrcodeInfo: function (data) {
        return axios.get('/api/getQrcodeInfo', config(data))
    },
    remark: function (data) {
        return axios.post('/api/remark', data, config())
    },
    deleteOrder: function (data) {
        return axios.post('/api/deleteOrder', data, config())
    },
    payBack: function (data) {
        return axios.post('/api/payBack', data, config())
    },
    unbindOrder: function (data) {
        return axios.post('/api/unbindOrder', data, config())
    },
    getUserField: function (data) {
        return axios.get('/api/getUserField', config(data))
    },
    saveUserInfo: function (data) {
        return axios.post('/api/saveUserInfo', data, config())
    },
    getQrcodeNeedInfo: function (data) {
        return axios.get('/api/getQrcodeNeedInfo', config())
    },
    saveQrocdeInfo: function (data) {
        return axios.post('/api/saveQrocdeInfo', data, config())
    }
}
