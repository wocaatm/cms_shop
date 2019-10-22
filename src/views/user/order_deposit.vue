<template>
    <div class="order-deposit-container">
        <shop-header title='办理产品押金'>
            <span slot='left' @click='goBack()'><i class="fa fa-angle-left fa-2x"></i></span>
        </shop-header>
        <ul class="deposit-list-container" v-if='orderInfo'>
            <li class="deposit-list-item" v-for='(product, index) in orderInfo.products'>
                <div class="deposit-product-info clearfix">
                    <div class="deposit-product-thumb fl">
                        <img :src="product.thumb" alt="" width="100%" height="100%">
                    </div>
                    <div class="deposit-product-opration fl">
                        <div class="deposit-opration-header clearfix">
                            <span class="deposit-product-title single-ellipsis fl">{{product.title}}</span>
                            <p class="fr">可用数量<span class="deposit-product-count">x{{product.count}}</span></p>
                        </div>
                        <div class="deposit-opration-middle single-ellipsis">{{product.description}}</div>
                        <div class="deposit-product-real-time" v-if='product.realTime'>消费有效期：{{product.realTime}}</div>
                        <div class="deposit-opration-bottom clearfix">
                            <span class="price fl">￥ {{product.price}}</span>
                            <div class="deposit-num-select fr">
                                <div v-if='product.state'>
                                    <label class="deposit-num-title">办理数量</label><input class='deposit-num-input' type="number" :value='depositNum[index]' @input='switchDeposit($event)' :data-index='index' :data-count='depositNum[index]'>
                                </div>
                                <span class="out-time-product" v-else>产品不在消费期内</span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="desposit-fee-style deposit-all">
            <label class="checkbox-container" @click.prevent='switchCheckAll()'>
                <input type="checkbox" class='checkbox-input' :class="{selected: (depositCount === depositMaxCount) && canDeposit}">
                <span class="checkbox-core"></span>
            </label><span class="deposit-all-tip">全部办理</span>
        </div>
        <p class="desposit-fee-style"><span class="fee-tip">滑雪押金</span>￥ {{skiDepositFee}}</p>
        <p class="desposit-fee-style custome-fee"><span class="fee-tip">消费押金</span><input type="number" value='0' @change='switchCustomeFee($event)' :data-fee='customeFee'></p>
        <p class="desposit-fee-style fee-all"><span class="fee-tip">总计</span>￥ {{feeAll}}</p>
        <div class="make-confirm-btn" @click='deposit()'>办理押金</div>
    </div>
</template>

<script>
    import shopHeader from '../../components/header'
    import { Toast, Indicator } from 'mint-ui'
    import Api from '../../api/index'
    import { isPositiveNum } from '../../lib/util'
    import * as tips from '../../lib/tips'

    export default {
        data () {
            return {
                orderId: '',
                orderInfo: '',
                customeFee: 0,
                depositNum: [],
                depositMaxNum: [],
                depositAll: false
            }
        },
        computed: {
            canDeposit () {
                var flag = false
                this.depositMaxNum.forEach(function (item) {
                    if (item !== false && item !== 0) {
                        flag = true
                    }
                })
                return flag
            },
            depositCount () {
                return this.depositNum.reduce(function (pre, curr) {
                    return pre + curr
                }, 0)
            },
            depositMaxCount () {
                return this.depositMaxNum.reduce(function (pre, curr) {
                    return pre + curr
                }, 0)
            },
            skiDepositFee () {
                var fee = 0
                this.depositNum.forEach((item, index) => {
                    fee += this.orderInfo.products[index].depositFee * item
                })
                return fee
            },
            feeAll () {
                return this.skiDepositFee + parseInt(this.customeFee)
            }
        },
        mounted () {
            this.orderId = this.$route.query.oid
            this.initData()
        },
        methods: {
            initData () {
                Indicator.open({
                    text: '加载中...'
                })
                Api.getOrderDetail({ orderId: this.orderId, verification: true })
                    .then((response) => {
                        this.orderInfo = response.data
                        this.depositNum = this.orderInfo.products.map(function (item) {
                            return item.state ? 0 : false
                        })
                        this.depositMaxNum = this.orderInfo.products.map(function (item) {
                            return item.state ? item.count : false
                        })
                        Indicator.close()
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
            switchDeposit (e) {
                var target = e.target
                var index = target.getAttribute('data-index')
                var countBefore = target.getAttribute('data-count')
                var countSwitch = +target.value
                var errorMsg
                if (!(isPositiveNum(countSwitch) || countSwitch === 0)) {
                    errorMsg = tips.DEPOSIT_NUM_ERROR
                }
                if (countSwitch > this.depositMaxNum[index]) {
                    errorMsg = tips.DEPOSIT_MAX_NUM
                }
                if (errorMsg) {
                    Toast({
                        message: errorMsg,
                        position: 'middle',
                        duration: 1500
                    })
                    target.value = countBefore
                    return
                }
                this.depositNum.splice(index, 1, countSwitch)
            },
            switchCheckAll () {
                this.depositAll = !this.depositAll
                var deposit
                if (this.depositAll) {
                    deposit = this.depositMaxNum.map(function (item) {
                        return item
                    })
                } else {
                    deposit = this.depositMaxNum.map(function () {
                        return 0
                    })
                }
                this.depositNum = deposit
            },
            switchCustomeFee (e) {
                var target = e.target
                var feeBefore = target.getAttribute('data-fee')
                var fee = +target.value
                var errorMsg
                if (!(isPositiveNum(fee) || fee === 0)) {
                    errorMsg = tips.DEPOSIT_FEE_ERROR
                }
                if (errorMsg) {
                    Toast({
                        message: errorMsg,
                        position: 'middle',
                        duration: 1500
                    })
                    target.value = feeBefore
                    return
                }
                this.customeFee = fee
            },
            deposit () {
                if (!this.depositCount) {
                    Toast({
                        message: tips.NO_PRODUCT_SELECT_TO_DEPOSIT,
                        position: 'middle',
                        duration: 1500
                    })
                    return
                }
                var products = {}
                this.depositNum.forEach((item, index) => {
                    if (item) {
                        products[this.orderInfo.products[index].id] = {
                            depositName: this.orderInfo.products[index].title,
                            depositCount: item
                        }
                    }
                })
                var data = {
                    orderId: this.orderId,
                    products: products,
                    skiDepositFee: this.skiDepositFee,
                    customeFee: this.customeFee,
                    feeAll: this.feeAll
                }
                this.$store.dispatch('orderDeposit', data)
                    .then(() => {
                        this.$router.push({
                            path: '/payDeposit'
                        })
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
    .order-deposit-container
        padding-top 50px
        .deposit-list-container
            background #eee
            border-bottom 1px solid #f5f5f5
            .deposit-list-item
                margin-bottom 1px
                background #fff
                .deposit-product-info
                    padding 10px 0
                    .deposit-product-thumb
                        width 80px
                        height 80px
                        margin 0 10px
                    .deposit-product-opration
                        width calc(100vw - 100px)
                        .deposit-opration-header
                            line-height 30px
                            .deposit-product-title
                                max-width 60%
                                font-size 16px
                                color #000
                            .deposit-product-count
                                color #fe4200
                                margin 0 10px
                        .deposit-opration-middle
                            width 80%
                            font-size 14px
                            color #666
                        .deposit-opration-bottom
                            font-size 14px
                            line-height 28px
                            .price
                                color $globalFontColor
                            .deposit-num-input
                                width 48px
                                margin 0 10px
                                height 24px
                                border 1px solid #ccc
                                text-align center
                                &:focus
                                    border-color $globalColor
                            .out-time-product
                                padding-right 10px
                                text-align center
                                color $globalFontColor
                        .deposit-product-real-time
                            line-height 28px
                            font-size 14px
                            color #666
                &:last-child
                    margin-bottom 0
        .desposit-fee-style
            padding-left 10px
            line-height 36px
            font-size 14px
            .fee-tip
                display inline-block
                width 70px
                color #000
            &.fee-all
                color $globalFontColor
            &.custome-fee input
                box-sizing border-box
                width 60px
                padding-left 6px
                line-height 24px
                border 1px solid #ccc
                &:focus
                    border-color $globalColor
            &.deposit-all
                line-height 44px
                padding-right 10px
                text-align right
                .deposit-all-tip
                    margin-left 6px
        .make-confirm-btn
            margin 20px auto 0
            width 96%
            border-radius 4px
            line-height 46px
            text-align center
            font-size 16px
            color #fff
            background $globalColor
</style>