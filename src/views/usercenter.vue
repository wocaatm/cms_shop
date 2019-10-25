<template>
    <div class="user-center-container">
        <div class='user-info-container clearfix'>
            <div class="info-thumb-container fl">
                <img class='thumb' :src="info.portrait">
            </div>
            <div class="info-username fl">{{info.wechaname}}</div>
        </div>
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
        <div class="logout-btn-container"><span class="logout-btn" @click="goToBindTel">绑定手机</span></div>
        <shop-footer :type='2'></shop-footer>
    </div>
</template>

<script>
    import shopFooter from '../components/footer'
    import { mapGetters } from 'vuex'

    export default {
        computed: {
            ...mapGetters({
                'info': 'userCenterInfo'
            })
        },
        created () {
          console.log(this.info);
        },
        components: {
            shopFooter
        },
        methods: {
          goToBindTel () {
            this.$router.push('/bindtel');
          }
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
                border 1px solid #eee
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
