<template>
    <div class="pay-deposit-container" v-if='deposit'>
        <shop-header title='确认押金支付'>
            <span slot='left' @click='goBack()'><i class="fa fa-angle-left fa-2x"></i></span>
        </shop-header>
        <ul class="pay-deposit-product">
            <li class="pay-product-item clearfix" v-for='product in deposit.products'>
                <span class="fl">{{product.depositName}}</span>
                <span class="pay-product-count fr">x {{product.depositCount}}</span>
            </li>
        </ul>
        <p class="desposit-fee-style"><span class="fee-tip">滑雪押金</span>￥ {{deposit.skiDepositFee}}</p>
        <p class="desposit-fee-style"><span class="fee-tip">消费押金</span>￥ {{deposit.customeFee}}</p>
        <p class="desposit-fee-style deposit-fee-all"><span class="fee-tip">总计</span>￥ {{deposit.feeAll}}</p>
        <div class="deposit-pay-container"><span class="deposit-pay-btn" @click='pay()'>微信支付</span></div>
    </div>
</template>

<script>
    import shopHeader from '../../components/header'
    import { Indicator, Toast } from 'mint-ui'
    import { payUrl, depostRedirectUrlSuccess, depostRedirectUrlFail } from '../../lib/config'
    import { mapGetters } from 'vuex'
    import * as tips from '../../lib/tips'
    import Api from '../../api/index'

    export default {
        data () {
            return {
                payOnce: false
            }
        },
        computed: {
            ...mapGetters({
                'deposit': 'depositInfo'
            })
        },
        mounted () {
            if (!this.deposit) this.$router.push({path: '/order', query: {tab: 2, secondTab: 2}})
        },
        methods: {
            pay () {
                if (this.payOnce) return
                this.payOnce = true
                Indicator.open()
                var data = Object.assign({}, this.deposit)
                this.$store.dispatch('clearDeposit')
                Api.payDeposit(data)
                    .then((response) => {
                        /* 获取jsParams用于支付 */
                        Indicator.close()
                        if (response.data.success) {
                            if (response.data.jsParamters === 0) {
                                Toast({
                                    message: tips.DEPOSIT_PAY_SUCCESS,
                                    position: 'middle',
                                    duration: 1500
                                })
                                setTimeout(() => {
                                    this.$router.push({path: '/order', query: {tab: 2}})
                                }, 1500)
                                return
                            }
                            window.location.href = payUrl + '?jsParamters=' + encodeURI(JSON.stringify(response.data.jsParamters)) + '&successUrl=' + depostRedirectUrlSuccess + '&failUrl=' + depostRedirectUrlFail
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
    .pay-deposit-container
        padding-top 50px
        background #eee
        .pay-deposit-product
            margin-bottom 10px
            font-size 14px
            background #fff
            .pay-product-item
                padding 10px
                line-height 50px
                border-bottom 1px solid #eee
                .pay-product-count
                    color $globalFontColor
        .desposit-fee-style
            line-height 46px
            padding-left 10px
            color #000
            font-size 14px
            background #fff
            .fee-tip
                display inline-block
                width 70px
            &.deposit-fee-all
                color $globalFontColor
                font-size 16px
        .deposit-pay-container
            padding-top 20px
            background #fff
            .deposit-pay-btn
                display block
                margin 0 auto
                width 96%
                border-radius 4px
                line-height 46px
                text-align center
                color #fff
                font-size 18px
                background $globalColor
</style>