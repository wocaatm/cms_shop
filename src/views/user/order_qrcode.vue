<template>
    <div class="order-qrcode-container">
        <shop-header title='卡码'>
            <span slot='left' @click='goBack()'><i class="fa fa-angle-left fa-2x"></i></span>
            <span slot='right' @click='initData()'><i class="fa fa-refresh fa-lg" ref='refresh'></i></span>
        </shop-header>
        <div class="order-qrcode-info clearfix" v-if='qrcodeInfo'>
            <span class="fl">订单号:{{orderId}}</span>
            <span class="fr">手机号:{{qrcodeInfo.telephone}}</span>
        </div>
        <div v-if='loaded'>
            <div class="has-qrcode-container" v-if='qrcodeInfo && qrcodeInfo.products.length'>
                <div class="qrcode-product-container" v-if='qrcodeInfo' ref='product'>
                    <div class="arrow-btn"><i class="fa fa-angle-left fa-2x" v-if='productIndex > 0 && productTitle.length > 1' @click='switchProduct(-1)'></i></div>
                    <p class="product-title single-ellipsis">{{productTitle[productIndex]}}</p>
                    <div class="arrow-btn"><i class="fa fa-angle-right fa-2x"  v-if='productIndex < (productTitle.length - 1) && productTitle.length > 1' @click='switchProduct(1)'></i></div>
                </div>
                <div class="qrcode-show-container" v-if='qrcodeInfo'>
                    <h3 class="qrcode-tip">产品对应的卡码</h3>
                    <div class="qrcode-url-container" ref='qrcode'>
                        <div class="arrow-btn"><i class="pre-btn fa fa-angle-left fa-2x" v-if='qrcodeIndex > 0 && qrcode.qrcodeCount>1' @click='switchQrcode(-1)'></i></div>
                        <div class="transition-container">
                            <transition name='slider' mode='out-in'>
                                <div class="show-if-not-qrcode" v-if='showAnimation' :key='1'>
                                    <img class='qrcode inline' :src="qrcodeDetail.url">
                                    <div class="not-qrcode-shadow" v-if='qrcodeDetail.needMoreInfo'></div>
                                    <p class="not-qrcode-tip" v-if='qrcodeDetail.needMoreInfo'>需要完善信息</p>
                                </div>
                                <div class="show-if-not-qrcode" v-else :key='2'>
                                    <img class='qrcode inline' :src="qrcodeDetail.url">
                                    <div class="not-qrcode-shadow" v-if='qrcodeDetail.needMoreInfo'></div>
                                    <p class="not-qrcode-tip" v-if='qrcodeDetail.needMoreInfo'>需要完善信息</p>
                                </div>
                            </transition>
                        </div>
                        <div class="arrow-btn"><i class="next-btn fa fa-angle-right fa-2x" v-if='qrcodeIndex < (qrcode.qrcodeCount - 1) && qrcode.qrcodeCount > 1' @click='switchQrcode(1)'></i></div>
                    </div>
                    <div class="qrcode-state clearfix">
                        <div class="fl" v-if='qrcodeDetail.needMoreInfo'>
                            <a class='need-more-info' :href="qrcodeDetail.link" v-if='qrcodeDetail.link'>使用前需要完善信息</a>
                            <router-link class='need-more-info' :to="{path: '/qrcode_info', query: {orderId: orderId, qrcodeId: qrcodeDetail.id}}" v-else>使用前需要完善信息</router-link>
                        </div>
                        <div class="fr">
                            <span :class="{using: qrcodeDetail.state}">{{qrcodeDetail.state ? '正在使用': '未使用'}}</span>
                            <span class="nowIndex" :class="{using: qrcodeDetail.state}">{{qrcodeIndex + 1}}</span><span class="allCount"> / {{qrcode.qrcodeCount}}</span>
                        </div>
                    </div>
                    <div class="qrcode-remark-container clearfix">
                        <label class="remark-tip fl">备注：</label><input class='remark-input fl' type="text" placeholder="二维码备注" :value='qrcodeDetail.remark' ref='remark' :data-remark='qrcodeDetail.remark'><span class="remark-submit fr" @click='remark'>提交</span>
                    </div>
                </div>
            </div>
            <div class="no-qrcode-container" v-else>
                <i class="fa fa-credit-card fa-3x"></i>
                <p class="tip-info">该订单下没有可用的卡码</p>
            </div>
        </div>
    </div>
</template>

<script>
    import shopHeader from '../../components/header'
    import Api from '../../api/index'
    import { Toast, Indicator } from 'mint-ui'
    import '../../lib/hammer.min'
    import * as tips from '../../lib/tips'

    export default {
        data () {
            return {
                orderId: '',
                qrcodeInfo: '',
                productIndex: 0,
                qrcodeIndex: 0,
                showAnimation: true,
                refreshing: false,
                loaded: false
            }
        },
        computed: {
            productTitle () {
                return this.qrcodeInfo.products.length ? this.qrcodeInfo.products.map(function (item) {
                    return item.title
                }) : []
            },
            qrcode () {
                return this.qrcodeInfo.products.length ? this.qrcodeInfo.products[this.productIndex] : ''
            },
            qrcodeDetail () {
                return this.qrcode ? this.qrcode.qrcodeDetail[this.qrcodeIndex] : ''
            }
        },
        mounted () {
            this.orderId = this.$route.query.oid
            this.initData()
        },
        methods: {
            initData () {
                if (this.refreshing) return
                this.refreshing = true
                this.loaded = false
                this.qrcodeInfo = ''
                Indicator.open({
                    text: '加载中...'
                })
                Api.getQrcodeInfo({ orderId: this.orderId })
                    .then((response) => {
                        this.qrcodeInfo = response.data
                        this.loaded = true
                        this.productIndex = 0
                        this.qrcodeIndex = 0
                        this.refreshing = false
                        Indicator.close()
                        this.initSlider()
                    })
                    .catch(() => {
                        Toast({
                            message: tips.ERROR_SERVER,
                            position: 'middle',
                            duration: 1500
                        })
                        Indicator.close()
                    })
            },
            initSlider () {
                if (!this.productTitle.length) return
                this.$nextTick(() => {
                    var product = new window.Hammer(this.$refs.product)
                    product.on('swipeleft', (e) => {
                        if (this.productIndex === (this.productTitle.length - 1)) return
                        this.switchProduct(1)
                    })
                    product.on('swiperight', (e) => {
                        if (this.productIndex === 0) return
                        this.switchProduct(-1)
                    })

                    var qrcode = new window.Hammer(this.$refs.qrcode)
                    qrcode.on('swipeleft', (e) => {
                        if (this.qrcodeIndex === (this.qrcode.qrcodeDetail.length - 1)) return
                        this.switchQrcode(1)
                    })
                    qrcode.on('swiperight', (e) => {
                        if (this.qrcodeIndex === 0) return
                        this.switchQrcode(-1)
                    })
                })
            },
            switchQrcode (change) {
                if (change > 0 && (this.qrcodeIndex < this.qrcode.qrcodeCount - 1)) {
                    this.qrcodeIndex += 1
                } else if (change < 0 && this.qrcodeIndex > 0) {
                    this.qrcodeIndex += -1
                }
                this.showAnimation = !this.showAnimation
            },
            switchProduct (change) {
                if (change > 0 && (this.productIndex < this.productTitle.length - 1)) {
                    this.productIndex += 1
                } else if (change < 0 && this.productIndex > 0) {
                    this.productIndex += -1
                }
                this.qrcodeIndex = 0
            },
            remark () {
                var ele = this.$refs.remark
                var value = ele.value.trim()
                if (!value) {
                    Toast({
                        message: tips.ORDER_REMARK_EMPTY,
                        position: 'bottom',
                        duration: 1500
                    })
                    return
                }
                var already = ele.getAttribute('data-remark')
                if (already === value) {
                    Toast({
                        message: tips.REMARK_NO_MODIFY,
                        position: 'bottom',
                        duration: 1500
                    })
                    return
                }
                var data = {
                    orderId: this.orderId,
                    qrcodeId: this.qrcodeDetail.id,
                    remark: value
                }
                Api.remark(data)
                    .then((response) => {
                        if (response.data.success) {
                            Toast({
                                message: tips.REMARK_MODIFY_SUCCESS,
                                position: 'bottom',
                                duration: 1500
                            })
                            /* 修改提交的备注 */
                            this.qrcodeInfo.products[this.productIndex].qrcodeDetail[this.qrcodeIndex].remark = value
                        } else {
                            Toast({
                                message: response.data.errorMsg,
                                position: 'bottom',
                                duration: 1500
                            })
                        }
                    })
            },
            goBack () {
                this.$router.go(-1)
            }
        },
        beforeRouteLeave (to, from, next) {
            to.query.type = true
            next()
        },
        components: {
            shopHeader
        }
    }
</script>

<style lang='stylus'>
    @import "../../assets/css/global"
    .order-qrcode-container
        padding-top 50px
        padding-bottom 30px
        .order-qrcode-info
            padding 0 15px
            line-height 40px
            border-bottom 1px solid #eee
            font-size 14px
        .qrcode-product-container
            display flex
            justify-content space-between
            align-items center
            border-bottom 1px solid #eee
            height 60px
            text-align center
            .arrow-btn
                width 50px
                height 60px
                .fa
                    display block
                    line-height 60px
            .product-title
                width calc(100vw - 140px)
                font-weight bold
                font-size 16px
        .qrcode-show-container
            margin-top 20px
            text-align center
            font-size 14px
            .qrcode-tip
                font-weight 500
                font-size 14px
            .qrcode-url-container
                display flex
                justify-content center
                align-items center
                margin-top 10px
                .arrow-btn
                    width calc(50vw - 140px)
                    .fa
                        display block
                        line-height 60px
                .transition-container
                    width 280px
                    height 280px
                    position relative
                    overflow hidden
                    .qrcode
                        width 100%
                        height 100%
                    .not-qrcode-shadow
                        position absolute
                        top 0
                        left 0
                        right 0
                        bottom 0
                        background #fff
                        filter blur(24px)
                    .not-qrcode-tip
                        position absolute
                        top 50%
                        left 50%
                        color #000
                        transform translate(-50%, -50%)
            .qrcode-state
                margin-top 10px
                padding 0 calc(50vw - 140px)
                font-weight 600
                color #f0b474
                .need-more-info
                    color #000
                    font-weight normal
                    text-decoration underline
                .using
                    color $globalColor
                .nowIndex
                    margin-left 10px
                .allCount
                    color #000
            .qrcode-remark-container
                margin-top 20px
                text-align left
                padding 0 20px
                .remark-tip
                    line-height 30px
                    margin-right 4%
                .remark-input
                    box-sizing border-box
                    width 60%
                    padding-left 10px
                    height 30px
                    border 1px solid #eee
                    vertical-align middle
                    &:focus
                        border-color #26a2ff
                .remark-submit
                    display inline-block
                    width 20%
                    text-align center
                    line-height 30px
                    color #fff
                    border-radius 4px
                    background $globalColor
        .no-qrcode-container
            position absolute
            top 50%
            left 50%
            transform translate(-50%,-50%)
            color #999
            font-size 14px
            text-align center
            .tip-info
                margin-top 10px
    .slider-enter
        opacity 0
    .slider-enter-active, .slider-leave-active
        transition all .6s linear
    .slider-leave-to
        opacity 0
</style>