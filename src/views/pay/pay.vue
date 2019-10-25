<template>
    <div class="product_pay_container" v-if='payInfo'>
        <shop-header title='支付产品详情'>
            <span slot='left' @click='goBack()'><i class="fa fa-angle-left fa-2x"></i></span>
        </shop-header>
        <ul class='product_pay_ul' v-if='payInfo'>
            <li class="product_pay_item" v-for='product in payInfo.products'>
                <div class="product_title_option">
                  <div class="product_title">{{product.title}}</div>
                  <div class="product_option">{{ product.options.join('，') }}</div>
                </div>
                <div class="product_count_price">
                    <span class="product_price flex-info">￥ {{product.price}}</span>
                    <span class="product_count flex-info">x {{product.count}}</span>
                </div>
            </li>
        </ul>
        <div class="pay_money_all"><span class="pay_all_tip">总价：</span>￥ {{payInfo.allPrice.toFixed(2)}}</div>
        <div class="maky-pay-container"><span class="make_pay_btn" @click='pay()'>微信支付</span></div>
    </div>
</template>

<script>
    import Api from '../../api/index'
    import * as tips from '../../lib/tips'
    import { payUrl, payRedirectUrlSuccess, payRedirectUrlFail } from '../../lib/config'
    import shopHeader from '../../components/header'
    import { Indicator, Toast } from 'mint-ui'

    export default {
        data () {
            return {
                orderId: '',
                payInfo: '',
                jsParamters: '',
                payOnce: false
            }
        },
        mounted () {
            this.orderId = this.$route.query.orderId
            console.log(this.orderId);
            if (this.orderId) {
                this.initPayOrder()
            } else {
                this.$router.push('/order')
            }
        },
        methods: {
            /* 从订单号进来 */
            initPayOrder () {
                Api.getOrderDetail({ ordernumber: this.orderId })
                    .then((response) => {
                        console.log(response)
                        if (response.data.success) {
                            // 获取订单的产品
                            this.payInfo = response.data
                        } else {
                            this.$router.push('/usercenter')
                        }
                    })
            },
            pay () {
                if (this.payOnce) return
                this.payOnce = true
                Indicator.open()
                let products = this.payInfo.products
                const payInfo = { products }
                payInfo.orderId = this.orderId
                Api.getPayJsParameters({ payInfo })
                    .then((response) => {
                        Indicator.close()
                        if (response.data.success) {
                            // 商品价格为0直接通过
                            if (response.data.jsParamters === 0) {
                                Toast({
                                    message: tips.PAY_SUCCESS,
                                    position: 'middle',
                                    duration: 1500
                                })
                                setTimeout(() => {
                                    this.$router.push({path: '/order', query: {tab: 2}})
                                }, 1500)
                                return
                            }
                            window.location.href = payUrl + '?jsParamters=' + encodeURI(JSON.stringify(response.data.jsParamters)) + '&successUrl=' + payRedirectUrlSuccess + '&failUrl=' + payRedirectUrlFail
                        } else {
                            Toast({
                                message: response.data.errorMsg,
                                position: 'middle',
                                duration: 1500
                            })
                        }
                    })
                    .catch(() => {
                        Indicator.close()
                        Toast({
                            message: tips.ERROR_SERVER,
                            position: 'middle',
                            duration: 1500
                        })
                    })
            },
            goBack () {
                this.$router.go(-1)
            }
        },
        components: {
            shopHeader
        }
    }
</script>

<style lang='stylus'>
    @import "../../assets/css/global"
    .product_pay_container
        padding-top 50px
        background #eee
        .product_pay_ul
            background #fff
            .product_pay_item
                display flex
                justify-content space-between
                align-items center
                height 50px
                padding 10px
                border-bottom 1px solid #f5f5f5
                .product_title
                    font-size 14px
                    color #000
                .product_option
                  margin-top 4px
                .product_count_price
                    display flex
                    flex-wrap wrap
                    font-size 14px
                    .flex-info
                        flex-basis 100%
                        text-align right
                        &.product_price
                            margin-bottom 10px
                            color $globalFontColor
        .pay_money_all
            margin-top 10px
            text-align center
            color $globalFontColor
            font-size 14px
            line-height 60px
            background #fff
            .pay_all_tip
                color #000
        .maky-pay-container
            background #fff
            .make_pay_btn
                display block
                width 96%
                margin 0 auto
                border-radius 4px
                line-height 46px
                text-align center
                color #fff
                font-size 18px
                background $globalColor
</style>
