<template>
    <div class="user-center-container">
        <router-link class='user-info-container clearfix' :to="{path: '/userinfo'}">
            <div class="info-thumb-container fl">
                <img class='thumb' :src="info.thumb">
            </div>
            <div class="info-username fl">{{info.username}}</div>
            <span class="info-more-icon fr"><i class="fa fa-angle-right fa-2x"></i></span>
        </router-link>
        <div class="user-order-container">
            <div class="order-header">
                <router-link class='order-all-link clearfix' :to="{path: '/order'}">
                    <span class="fl">我的订单</span>
                    <div class="order-all fr">全部订单<i class="fa fa-angle-right fa-lg"></i></div>
                </router-link>
            </div>
            <ul class="order-tab-container">
                <li class="order-tab-item">
                    <router-link class='order-tab-link' :to="{path: '/order', query: {tab: 1}}">
                        <div class="tab-content">
                            <img class='tab-thumb inline' src="../assets/images/no_pay.png" alt="">
                            <p>待付款</p>
                        </div>
                    </router-link>
                </li>
                <li class="order-tab-item">
                    <router-link class='order-tab-link' :to="{path: '/order', query: {tab: 2}}">
                        <div class="tab-content">
                            <img class='tab-thumb inline' src="../assets/images/pay.png" alt="">
                            <p>已付款</p>
                        </div>
                    </router-link>
                </li>
                <li class="order-tab-item">
                    <router-link class='order-tab-link' :to="{path: '/order', query: {tab: 4}}">
                        <div class="tab-content">
                            <img class='tab-thumb bigger inline' src="../assets/images/finish.png" alt="">
                            <p>已消费</p>
                        </div>
                    </router-link>
                </li>
                <li class="order-tab-item">
                    <router-link class='order-tab-link' :to="{path: '/order', query: {tab: 5}}">
                        <div class="tab-content">
                            <img class='tab-thumb inline' src="../assets/images/pay_back.png" alt="">
                            <p>退款</p>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
        <div class="user-order-container" v-if='!oldVersion'>
            <div class="order-header">
                <router-link class='order-all-link clearfix' :to="{path: '/order_third'}">
                    <span class="fl">关联订单</span>
                    <div class="order-all fr">全部订单<i class="fa fa-angle-right fa-lg"></i></div>
                </router-link>
            </div>
            <div class="associate-order-container">
                <label class="associate-tip" for='associateCode'>消费码</label>
                <input id='associateCode' class='associate-input' type="number" v-model='associationQrcode' placeholder="请输入需要关联的订单消费码">
                <span class="associate-btn" @click='associate()'>关联</span>
            </div>
            <ul class="order-tab-container">
                <li class="order-tab-item">
                    <router-link class='order-tab-link' :to="{path: '/order_third', query: {tab: 2}}">
                        <div class="tab-content">
                            <img class='tab-thumb inline' src="../assets/images/pay.png" alt="">
                            <p>未消费</p>
                        </div>
                    </router-link>
                </li>
                <li class="order-tab-item">
                    <router-link class='order-tab-link' :to="{path: '/order_third', query: {tab: 4}}">
                        <div class="tab-content">
                            <img class='tab-thumb bigger inline' src="../assets/images/finish.png" alt="">
                            <p>已消费</p>
                        </div>
                    </router-link>
                </li>
                <li class="order-tab-item">
                </li>
                <li class="order-tab-item">
                </li>
            </ul>
        </div>
        <div class="logout-btn-container"><span class="logout-btn" @click='logout()'>退出</span></div>
        <shop-footer :type='2'></shop-footer>
    </div>
</template>

<script>
    import shopFooter from '../components/footer'
    import { mapGetters } from 'vuex'
    import { Toast, MessageBox } from 'mint-ui'
    import * as tips from '../lib/tips'
    import Api from '../api/index'

    export default {
        data () {
            return {
                associationQrcode: '',
                oldVersion: true
            }
        },
        computed: {
            ...mapGetters({
                'info': 'userCenterInfo'
            })
        },
        // mounted () {
        //     if (cookie.hasCookie('oldVersion')) this.oldVersion = cookie.getCookie('oldVersion')
        // },
        methods: {
            associate () {
                if (!this.associationQrcode) {
                    Toast({
                        message: tips.INPUT_QRCODE_FROM_THIRD,
                        position: 'middle',
                        duration: 1500
                    })
                    return
                }
                Api.assocaiteOrder({ assocaiteOrder: this.associationQrcode })
                    .then((response) => {
                        if (response.data.success) {
                            MessageBox.confirm(tips.ASSOCAITE_SUCCESS)
                                .then(() => {
                                    this.$router.push({
                                        path: '/order_third',
                                        query: {
                                            tab: 2
                                        }
                                    })
                                }, () => {})
                        } else {
                            MessageBox.alert(`关联失败！${response.data.errorMsg}`)
                        }
                    })
                    .catch(() => {
                        Toast({
                            message: tips.ERROR_SERVER,
                            position: 'middle',
                            duration: 1500
                        })
                    })
            },
            logout () {
                MessageBox.confirm(tips.LOGOUT_COMFIRM)
                    .then(() => {
                        this.$store.dispatch('logout')
                            .then(() => {
                                this.$router.push('/login')
                            })
                    }, () => {})
            }
        },
        components: {
            shopFooter
        }
    }
</script>

<style lang='stylus'>
    @import "../assets/css/global"
    .user-center-container
        padding-bottom 50px
        background #eee
        background-clip content-box
        overflow hidden
        .user-info-container
            margin-top 16px
            display block
            height 60px
            padding 10px 15px
            color #333
            line-height 60px
            background #fff
            .info-thumb-container
                width 60px
                height 60px
                border-radius 4px
                overflow hidden
                .thumb
                    width 100%
                    height 100%
            .info-username
                margin-left 10px
                font-size 20px
        .user-order-container
            margin-top 12px
            background #fff
            .order-header
                padding 0 15px
                font-size 15px
                line-height 50px
                .order-all-link
                    display block
                    color #000
                .order-all
                    color #666
                    .fa
                        margin-left 10px
                        vertical-align -1px
            .order-tab-container
                display flex
                justify-content space-around
                border-top 1px solid #efefef
                border-bottom 1px solid #efefef
                .order-tab-item
                    flex-basis 25%
                    text-align center
                    font-size 13px
                    border-right 1px solid #efefef
                    .order-tab-link
                        display block
                        padding 12px 0 6px
                        color #333
                    .tab-thumb
                        width 20px
                        height 20px
                        margin-bottom 4px
                        &.bigger
                            width 22px
                            height 22px
                            margin-bottom 2px
        .associate-order-container
            position relative
            padding 0 15px
            border-top 1px solid #eee
            .associate-tip
                position absolute
                top 50%
                width 60px
                left 15px
                font-size 14px
                transform translateY(-50%)
            .associate-input
                box-sizing border-box
                width 100%
                height 45px
                padding-left 70px
            .associate-btn
                position absolute
                top 50%
                right 15px
                width 66px
                border-radius 3px
                color #fff
                line-height 29px
                text-align center
                font-size 14px
                background $globalColor
                transform translateY(-50%)
        .logout-btn-container
            padding 30px 15px 10px
            background #fff
            text-align center
            .logout-btn
                display inline-block
                width 100%
                border-radius 4px
                line-height 44px
                color #fff
                font-size 18px
                background $globalColor
</style>
