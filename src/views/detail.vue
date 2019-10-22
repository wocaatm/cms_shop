<template>
    <div class="product-detail-container">
        <shop-header title='商品详情'>
            <span slot='left' @click='goBack()'><i class="fa fa-angle-left fa-2x"></i></span>
        </shop-header>
        <div class="detail-main-container" v-if="!loading">
            <div class="detail-info-container">
                <div class="detail-info-thumb" v-if='detail.thumb'>
                    <img class='detail-thumb' :src="detail.thumb.thumbUrl" alt="">
                </div>
                <div class="detail-info-msg">
                    <h3 class="info-msg-title">{{detail.title}}</h3>
                    <div class="detail-row" v-for='(value, key) in detail.parameters'>
                        <span class="detail-row-title">{{key}}：</span><span class="detail-row-content">{{value}}</span>
                    </div>
                    <div class="product-select-row" :key="index" v-for="(option, index) in detail.productOption">
                      <span class="select-name">{{option.select}}：</span>
                      <div class="select-option-container">
                        <span class="option-item" @click="switchOption(tag.id, index)" v-for="tag in option.options" :key="tag.id" :class="{active: tag.id == productOptions[index]}">{{ tag.label }}</span>
                      </div>
                    </div>
                    <div class="detail-row">
                      <span class="detail-row-title">单价：</span><span class="detail-row-content price">￥ {{singleProductPrice}}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-row-title">购买数量：</span>
                        <div class="opration-container">
                            <input class='pro-num' type="num" :value="count" @blur='swtichCartNum($event)'>
                        </div>
                    </div>
                </div>
            </div>
            <h3 class="detail-content-title">产品内容</h3>
            <div class="wangEditor-container">
                <div class="wangEditor-txt" v-html='detail.content'></div>
            </div>
        </div>
        <div class="buy-product-info">
            <div class="all-price"><span>总价：</span>￥{{ allPrice }}</div>
            <span class="buy-now" @click="buy">立即购买</span>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { isPositiveNum } from '../lib/util'
    import { Toast } from 'mint-ui'
    import * as tips from '../lib/tips'
    import shopHeader from '../components/header'

    export default {
        data () {
            return {
                pid: '',
                count: 1,
                productOptions: [],
                loading: true,
                basePrice: 0
            }
        },
        computed: {
            ...mapGetters({
                'detail': 'productDetail',
                'userinfo': 'userCenterInfo'
            }),
            extraPrice () {
                let extra = 0
                this.productOptions.forEach((item, index) => {
                    const options = this.detail.productOption[index].options || []
                    options.forEach(o => {
                        if (o.id == item) {
                            extra += +o.priceExtra
                        }
                    })
                })
                return extra
            },
            singleProductPrice () {
                return this.basePrice + this.extraPrice
            },
            allPrice () {
                return this.singleProductPrice * this.count
            }
        },
        mounted () {
            this.pid = this.$route.query.pid
            this.$store.dispatch('getProductDetail', { pid: this.pid })
        },
        methods: {
            swtichCartNum (e) {
                let target = e.target
                if (!isPositiveNum(target.value)) {
                    Toast({
                        message: tips.NOT_POSITIVE_NUMBER,
                        position: 'middle',
                        duration: 1500
                    })
                    target.value = this.count
                    return
                }
                this.count = target.value
            },
            switchOption (id, index) {
                this.productOptions.splice(index, 1, id)
            },
            buy () {
                // 验证是否可以购买
                this.$router.push({ path: '/pay', query: { orderId: 201908171013 } })
            },
            goBack () {
                this.$router.go(-1)
            }
        },
        components: {
            shopHeader
        },
        watch: {
            detail (to) {
                let priceOptions = to && to.productOption
                this.basePrice = +to.basePrice
                if (Array.isArray(priceOptions) && priceOptions.length) {
                    this.productOptions = priceOptions.map((o) => {
                        return o.options[0].id
                    })
                }
                this.loading = false
            }
        }
    }
</script>

<style lang="stylus">
    @import "../assets/css/global"
    .product-detail-container
        padding 50px 0
        .detail-main-container
            padding-bottom 40px
            .detail-category
                padding 10px 15px
                font-size 16px
                color #000
                background #f0f2f5
            .detail-info-container
                padding 0 10px
                margin-top 10px
                .detail-info-thumb
                    width calc(100vw - 20px)
                    height calc(100vw - 20px)
                    .block
                        height 100%
                    .detail-thumb
                        width 100%
                        height 100%
                .detail-info-msg
                    margin-top 10px
                    .info-msg-title
                        padding 5px 0
                        font-size 16px
                        color #000
                    .detail-row
                        padding 8px 0
                        font-size 14px
                        color #000
                        .detail-row-title
                            display inline-block
                            min-width 80px
                        .detail-row-content
                            color #333
                            &.price
                                color $globalFontColor
                        .opration-container
                            display inline-block
                            margin-right 8px
                            vertical-align middle
                            .opration-btn
                                display inline-block
                                width 26px
                                height 26px
                                vertical-align middle
                                &.multi
                                    margin-right 3px
                                &.plus
                                    margin-left 3px
                            input
                                width 36px
                                height 18px
                                border-bottom 1px solid #eee
                                border-radius 3px
                                text-align center
                .product-select-row
                  margin 8px 0 0px
                  display flex
                  .select-name
                    color #000
                    font-size 14px
                    min-width 80px
                  .select-option-container
                    display flex
                    flex-wrap wrap
                    .option-item
                      padding 2px 10px
                      border 1px solid #11b111
                      border-radius 4px
                      color #333
                      margin 0 6px 8px 0
                      &.active
                        background #11b111
                        color #fff
            .detail-content-title
                margin-top 10px
                padding-left 15px
                line-height 40px
                color #000
                background #eee
            .wangEditor-container
                border none
        .buy-product-info
            position fixed
            left 0
            right 0
            bottom 0px
            z-index 10
            display flex
            padding-left 20px
            justify-content space-between
            align-items center
            height  48px
            font-size 16px
            background #ffffff
            box-shadow 0 -1px 2px rgba(0, 0, 0, 0.1)
            .all-price
              color #fe2400
              span
                color #333
            .buy-now
              background $globalColor
              color #fff
              line-height 48px
              padding 0 20px
              cursor pointer
</style>
