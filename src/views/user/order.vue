<template>
    <div class="order-container">
        <shop-header title='我的订单'>
            <span slot='left' @click='goBack()'><i class="fa fa-angle-left fa-2x"></i></span>
            <span slot='right' @click='refresh()'><i class="fa fa-refresh fa-lg" ref='refresh'></i></span>
        </shop-header>
        <ul class="order-type-container">
            <li class="order-type-item" :class='{active: tab === 0}' @click='tab = 0'><span class="tab-content">全部订单</span></li>
            <li class="order-type-item" :class='{active: tab === 1}' @click='tab = 1'><span class="tab-content">待付款</span></li>
            <li class="order-type-item" :class='{active: tab === 2}' @click='tab = 2'><span class="tab-content">已付款</span></li>
            <li class="order-type-item" :class='{active: tab === 3}' @click='tab = 3'><span class="tab-content">已消费</span></li>
            <li class="order-type-item" :class='{active: tab === 4}' @click='tab = 4'><span class="tab-content">退款</span></li>
        </ul>
        <ul class="order-list-container" v-if='!loaded || orders.length'>
              <li class="order-list-item" v-for='(order, index) in orders' :key="index">
                <div @click='gotoDetail(order)'>
                  <div class="order-item-header">
                    <div class="header-left">
                      <p class="order-id">订单号：{{order.ordernumber}}</p>
                      <span class="order-create-time">{{order.createTime}}</span>
                    </div>
                    <div class='status' :class='getClass(order.state)'>
                      {{order.state | stateTips}}
                    </div>
                  </div>
                  <div class="order-product-container">
                    <ul>
                      <li class="order-product-item clearfix">
                        <div class="product-item-thumb fl">
                          <img :src="order.thumb" alt="">
                        </div>
                        <div class="product-item-title-description fl">
                          <p class="product-item-title single-ellipsis">{{order.name}}</p>
                          <p class="product-item-description">{{order.description}}</p>
                        </div>
                        <div class="product-price-count fr">
                          <p class="product-price">￥{{order.price}}</p>
                          <p class="product-user" v-if="order.state == 2">{{ `已使用${order.useing}` }}</p>
                          <p class="product-count">x {{order.count}}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="order-item-opration clearfix">
                  <span class="all-money fl">商品总额：<span class="price">￥{{order.total}}</span></span>
                  <div class="opration-btn-container fr">
                    <span class='opration-link' v-for='opration in oprationArr(order.state)' :data-a="opration.a" :data-opration='opration.opration' :data-router='opration.router' @click.stop='oprationOrder($event, index)' :data-oid='order.ordernumber' :data-style='opration.class'>{{opration.text}}</span>
                  </div>
                </div>
              </li>
        </ul>
        <div class="no-order-container" v-else>
            <img class='inline' src="../../assets/images/no_order.png" alt="">
            <p class="no-order-tips">您还没有订单</p>
        </div>
        <transition name='fullscreen'>
            <div class="show-associate-qrcode" v-if='showQrcode'>
                <div class="qrcode-expand">
                    <img class="qrcode-img" :src="showQrcodeUrl" alt="">
                    <div class="ordercode">消费码：{{orderCode}}</div>
                </div>
                <div class="close-full-screen-btn" @click='showQrcode=false'><i class="fa fa-close"></i></div>
            </div>
        </transition>
        <shop-footer :type='1'></shop-footer>
    </div>
</template>

<script>
    import shopHeader from '../../components/header'
    import shopFooter from '../../components/footer'
    import oprations from '../../lib/orderOpration'
    import Api from '../../api/index'
    import * as tips from '../../lib/tips'
    import { mapGetters } from 'vuex'
    import { stateText } from '../../filters'
    import { Indicator, MessageBox, Toast } from 'mint-ui'

    export default {
        data () {
            return {
                tab: 0,
                once: '',
                refreshFlag: false,
                loaded: false,
                showQrcode: false,
                showQrcodeUrl: '',
                orderCode: ''
            }
        },
        computed: {
            ...mapGetters({
                'orders': 'getOrderList',
                'orderType': 'getOrderType'
            })
        },
        mounted () {
            if (this.$route.query.tab !== undefined) this.tab = +this.$route.query.tab
            // if (this.$route.query.secondTab !== undefined) this.secondTab = +this.$route.query.secondTab
            if (this.$route.query.type && this.orderType) {
                this.tab = this.orderType.tab
            }
            this.initData()
        },
        methods: {
            gotoDetail (order) {
                const { state, ordernumber } = order;
                if (state === 1) return
                this.$router.push({ path: '/order_qrcode', query: { orderId: ordernumber } })
            },
            changeType () {
                const type = {
                    tab: this.tab
                }
                this.$store.dispatch('orderTabChange', type)
                    .then(() => {
                        this.initData()
                    })
            },
            initData () {
                this.$store.dispatch('clearOrderList')
                    .then(() => {
                        this.getOrderData()
                    })
            },
            getOrderData () {
                this.refreshFlag = true
                this.loaded = false
                Indicator.open({
                    text: '加载中...',
                    spinnerType: 'double-bounce'
                })
                const type = this.tab
                const data = {
                  state: type
                }
                this.$store.dispatch('getOrderList', data)
                    .then(() => {
                        this.refreshFlag = false
                        this.loaded = true
                        Indicator.close()
                    })
                    .catch(() => {
                        Toast({
                            message: tips.ERROR_SERVER,
                            position: 'middle',
                            duration: 1500
                        })
                        this.refreshFlag = false
                        this.loaded = true
                        Indicator.close()
                    })
            },
            getClass (value) {
                return stateText(value, true)
            },
            oprationArr (value) {
                return value in oprations ? oprations[value] : oprations['d']
            },
            oprationOrder (e, index) {
                var target = e.target
                var orderid = target.getAttribute('data-oid')
                var router = target.getAttribute('data-router')
                var opration = target.getAttribute('data-opration')
                var a = target.getAttribute('data-a');
                if (router) {
                    if (+opration === 1) {
                        /* 进入订单再支付query 订单号 */
                        this.$router.push({path: router, query: { orderId: orderid }})
                    }
                } else if (a) {
                  window.href = a;
                } else {
                    if (+opration === 2) {
                        this.delelteOrder(orderid, index)
                    } else {
                        this.payBack(orderid, index)
                    }
                }
            },
            goBack () {
                !this.refreshFlag && this.$router.go(-1)
            },
            refresh () {
                if (this.refreshFlag) return
                var ele = this.$refs.refresh
                ele.classList.add('rotate')
                ele.addEventListener('animationend', () => {
                    ele.classList.remove('rotate')
                })
                this.initData()
            },
            showAssociateQrcode (url, orderCode) {
                this.showQrcode = true
                this.showQrcodeUrl = url
                this.orderCode = orderCode
            },
            delelteOrder (orderId, index) {
                MessageBox.confirm(tips.DELETE_ORDER_OR_NOT)
                    .then(() => {
                        Api.deleteOrder({ ordernumber: orderId })
                            .then((response) => {
                                if (response.data.success) {
                                    Toast({
                                        message: tips.DELETE_SUCCESS,
                                        position: 'middle',
                                        duration: 1500
                                    })
                                   this.orders.splice(index, 1)
                                } else {
                                    Toast({
                                        message: response.data.msg,
                                        position: 'middle',
                                        duration: 1500
                                    })
                                }
                            })
                    }, () => {})
            },
            payBack (orderId, index) {
                MessageBox.confirm(tips.NEED_PAY_BACK)
                    .then(() => {
                        Api.payBack({ ordernumber: orderId })
                            .then((response) => {
                                if (response.data.success) {
                                    this.orders.splice(index, 1)
                                    Toast({
                                        message: tips.PAY_BACK_SUCCESS,
                                        position: 'middle',
                                        duration: 1500
                                    })
                                } else {
                                    Toast({
                                        message: response.data.msg,
                                        position: 'middle',
                                        duration: 1500
                                    })
                                }
                            })
                    }, () => {})
            }
        },
        beforeRouteEnter (to, from, next) {
            next((vm) => {
                vm.once = to.query.once
            })
        },
        beforeRouteLeave (to, from, next) {
            to.query.once = this.once
            next()
        },
        filters: {
            stateTips (value) {
                return stateText(value)
            }
        },
        components: {
            shopHeader,
            shopFooter
        },
        watch: {
            'tab' (to, from) {
                this.changeType()
            }
        }
    }
</script>

<style lang='stylus'>
    @import "../../assets/css/global"

    .order-container
        padding-top 90px
        padding-bottom 50px
        background #eee
        background-clip content-box
        &.has-second-type
            padding-top 130px
    .order-type-container
        box-sizing border-box
        position fixed
        top 50px
        left 0
        right 0
        display flex
        justify-content space-around
        height 40px
        border-bottom 1px solid #eee
        background #fff
        .order-type-item
            flex-basis 20%
            color #000
            text-align center
            font-size 14px
            .tab-content
                display inline-block
                line-height 38px
            &.active .tab-content
                color $globalColor
                border-bottom 2px solid currentColor
        &.second
            top 90px
    .order-list-container
        padding-top 10px
        background #eee
        .order-list-item
            margin-bottom 10px
            background #fff
            .order-item-header
                box-sizing border-box
                display flex
                justify-content space-between
                height 71px
                padding 10px
                border-bottom 1px solid #eee
                .header-left
                    display flex
                    flex-basis 60%
                    flex-wrap wrap
                    align-item stretch
                    .order-id
                        flex-basis 100%
                        color #000
                        font-size 16px
                    .order-create-time
                        display flex
                        flex-basis 100%
                        font-size 12px
                        color #666
                        align-items center
            .status
                display flex
                align-items center
                font-size 16px
                .associate-qrocde
                    margin-right 10px
                    color #666
                &.success
                    color $globalColor
                &.error
                    color $globalFontColor
                &.waring
                    color #fd9b0e
                &.used
                    color #666
            .order-product-state
                padding-left 10px
                line-height 30px
                font-size 14px
            .order-product-item
                height 80px
                padding 10px
                border-bottom 1px solid #eee
                .product-item-thumb
                    width 80px
                    height 80px
                    margin-right 10px
                    overflow hidden
                    img
                        width 100%
                        height 100%
                .product-item-title-description
                    width 50%
                    font-size 16px
                    .product-item-title
                        margin-bottom 10px
                        color #333
                    .product-item-description
                        max-height 3.5em
                        font-size 14px
                        color #666
                        line-height 1.75em
                        overflow hidden
                .product-price-count
                    font-size 14px
                    text-align right
                    .product-price
                        margin-bottom 30px
                        color $globalFontColor
                    .product-count
                        color #666
            .order-item-opration
                padding 8px 10px
                border-bottom 1px solid #eee
                text-align right
                .all-money
                    line-height 36px
                    font-size 16px
                    color #666
                    .price
                        color #000
                .opration-link
                    display inline-block
                    padding 0 10px
                    margin-left 10px
                    line-height 32px
                    font-size 14px
                    color $globalColor
                    border 1px solid #c9c9c9
                    &[data-style='delete']
                        color #999999
            &:last-child
                margin-bottom 0
    .no-order-container
        position absolute
        top 50%
        left 50%
        text-align center
        transform translate(-50%, -50%)
        .no-order-tips
            margin-top 10px
            color #999
    .show-associate-qrcode
        position fixed
        top 0
        left 0
        right 0
        bottom 0
        background rgba(0,0,0,.8)
        z-index 999
        .qrcode-expand
            position absolute
            left 50%
            top 40%
            max-width 80%
            text-align center
            transform translate(-50%,-50%)
            .qrcode-img
                border 10px solid #fff
            .ordercode
                margin-top 16px
                color #fff
                font-size 16px
        .close-full-screen-btn
            position absolute
            left 50%
            bottom 60px
            width 40px
            border-radius 100%
            text-align center
            line-height 40px
            color #fff
            background rgba(255,255,255,.4)
            transform translateX(-50%)
    .rotate
        animation rotate 0.8s ease-in-out
    @keyframes rotate
        100%{
            transform rotate(180deg)
        }
    .fullscreen-enter, .fullscreen-leave-to
        transform scale(0)
        opacity 0
    .fullscreen-enter-active, .fullscreen-leave-active
        transition all 0.4s
</style>
