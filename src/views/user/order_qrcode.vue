<template>
    <div class="order-qrcode-container">
        <shop-header title='卡码'>
            <span slot='left' @click='goBack()'><i class="fa fa-angle-left fa-2x"></i></span>
            <span slot='right' @click='initData()'><i class="fa fa-refresh fa-lg" ref='refresh'></i></span>
        </shop-header>
        <div class="order-qrcode-info" v-if='qrcodeInfo'>
            <p class="first">订单号:{{qrcodeInfo.ordernumber}}</p>
            <p>消费码:{{qrcodeInfo.ordercode}}</p>
        </div>
        <div v-if='loaded'>
            <div class="has-qrcode-container">
                <div class="qrcode-product-container">
                    <p class="product-title single-ellipsis">{{qrcodeInfo.name}}</p>
                    <p class="prodict-count">
                      <span>{{ `核销状况：` }}</span>
                      <span>{{ `${qrcodeInfo.useing}/${qrcodeInfo.count}张` }}</span>
                    </p>
                    <p class="prodict-count">
                      <span>{{ `票务类型：` }}</span>
                      <span>{{ qrcodeInfo.label }}</span>
                    </p>
                </div>
                <div class="qrcode-show-container">
                    <div class="qrcode-url-container">
                        <div class="transition-container" v-if="qrcodeUrl">
                          <img :src="qrcodeUrl" alt="" width="100%" height="100%">
                        </div>
                    </div>
                    <div class="qrcode-tip-line" v-if='qrcodeInfo.qrcodeDescribe'>长按识别二维码办理押金</div>
                </div>
            </div>
        </div>
        <div class="no-qrcode-container" v-else>
          <i class="fa fa-credit-card fa-3x"></i>
          <p class="tip-info">该订单下没有可用的卡码</p>
        </div>
    </div>
</template>

<script>
    import shopHeader from '../../components/header'
    import Api from '../../api/index'
    import { Toast, Indicator } from 'mint-ui'
    import '../../lib/hammer.min'
    import * as tips from '../../lib/tips'
    import QRCode from 'qrcode';

    export default {
        data () {
            return {
                orderId: '',
                qrcodeInfo: '',
                productIndex: 0,
                qrcodeIndex: 0,
                showAnimation: true,
                refreshing: false,
                loaded: false,
              qrcodeUrl: null
            }
        },
        mounted () {
            this.orderId = this.$route.query.orderId;
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
                Api.getQrcodeInfo({ ordernumber: this.orderId })
                    .then((response) => {
                      console.log(response);
                        this.qrcodeInfo = response.data.data
                        this.loaded = true
                        this.refreshing = false
                        Indicator.close();

                        console.log(this.qrcodeInfo.qrcode);

                        this.$nextTick(() => {
                          QRCode.toDataURL(this.qrcodeInfo.qrcode, (err, url) => {
                            if (err) console.log(err);
                            this.qrcodeUrl = url;
                          })
                        })
                    })
                    .catch((err) => {
                      console.log(err);
                        Toast({
                            message: tips.ERROR_SERVER,
                            position: 'middle',
                            duration: 1500
                        })
                        Indicator.close()
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
            padding 6px 15px
            border-bottom 1px solid #eee
            font-size 14px
            .first
              margin-bottom 10px
        .qrcode-product-container
            border-bottom 1px solid #eee
            .product-title
                line-height 36px
                text-align center
                font-weight bold
                font-size 16px
            .prodict-count
              margin-top 10px
              display flex
              padding 0 20px
              justify-content flex-start
              font-size 14px
              span
                margin-right 20px
        .qrcode-show-container
            margin-top 20px
            text-align center
            font-size 14px
            .qrcode-tip-line
                margin-top 10px
                font-size 14px
                color #333
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
