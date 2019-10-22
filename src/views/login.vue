<template>
    <div class="login-container">
        <shop-header title='验证手机'>
            <span slot='left' @click='goBack()'><i class="fa fa-angle-left fa-2x"></i></span>
        </shop-header>
        <div class="login-form-container">
            <div class="form-row telephone">
                <input class='input' type="text" placeholder="手机号码" v-model='telephone' maxlength="11">
                <span class="qrcode" :class='{active: !getQrcodeFlag}' @click='getQrcode()'>{{btnContent}}</span>
            </div>
            <div class="form-row">
                <input class='input' type="text" placeholder="短信验证码" v-model='qrcode'>
            </div>
        </div>
        <div class="form-submit-btn" @click='login()'>确定</div>
    </div>
</template>

<script>
    import shopHeader from '../components/header'
    import { checkTelephone } from '../lib/util'
    import * as tips from '../lib/tips'
    import { Toast } from 'mint-ui'
    import Api from '../api/index'
    import { mapGetters } from 'vuex'

    export default {
        data () {
            return {
                telephone: '',
                qrcode: '',
                getQrcodeFlag: true,
                time: 60,
                timeout: null,
                redirect: ''
            }
        },
        computed: {
            btnContent () {
                return this.getQrcodeFlag ? '获取验证码' : `重新获取（${this.time}）`
            },
            ...mapGetters({
                'info': 'userCenterInfo'
            })
        },
        beforeRouteLeave (to, from, next) {
            /* 清除路由内的setInterval定时器 */
            if (this.timeout) {
                clearInterval(this.timeout)
                this.timeout = null
            }
            /* 重新登录的购物车刷新 */
            this.$store.dispatch('loginRefreshCart')
                .then(() => {
                    next()
                })
        },
        mounted () {
            if (this.info) this.$router.push('/usercenter')
            /* 返回来源路由 */
            this.redirect = this.$route.query.redirect
        },
        methods: {
            getQrcode () {
                if (!this.getQrcodeFlag) return
                var telephone = this.telephone
                if (!checkTelephone(telephone)) {
                    Toast({
                        message: tips.ERROR_NUMBER,
                        position: 'middle',
                        duration: 1500,
                        iconClass: 'fa fa-close fa-lg'
                    })
                    return
                }
                Api.sendQrcode({ telephone })
                    .then((response) => {
                        if (response.data.success) {
                            Toast({
                                message: tips.ALREADY_SEND_QRCODE,
                                position: 'middle',
                                duration: 1500
                            })
                            this.getQrcodeFlag = false
                            this.timeout = setInterval(() => {
                                if (--this.time === 0) {
                                    clearInterval(this.timeout)
                                    this.timeout = null
                                    this.time = 60
                                    this.getQrcodeFlag = true
                                }
                            }, 1000)
                        } else {
                            Toast({
                                message: response.data.errorMsg,
                                position: 'middle',
                                duration: 1500
                            })
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
            login () {
                if (!checkTelephone(this.telephone)) {
                    Toast({
                        message: tips.ERROR_NUMBER,
                        position: 'middle',
                        duration: 1500,
                        iconClass: 'fa fa-close fa-lg'
                    })
                    return
                }
                if (!this.qrcode.length) {
                    Toast({
                        message: tips.QRCODE_EMPTY,
                        position: 'middle',
                        duration: 1500
                    })
                    return
                }
                var data = {
                    telephone: this.telephone,
                    qrcode: this.qrcode
                }
                this.$store.dispatch('login', data)
                    .then((value) => {
                        if (value.success === true) {
                            Toast({
                                message: tips.LOGIN_SUCCESS,
                                position: 'middle',
                                duration: 1500
                            })
                            if (value.redirectUrl) {
                                window.location.href = value.redirectUrl
                            } else {
                                setTimeout(() => {
                                    this.$router.push(this.redirect ? this.redirect : '/usercenter')
                                }, 1500)
                            }
                        } else {
                            Toast({
                                message: value.errorMsg,
                                position: 'middle',
                                duration: 1500
                            })
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
            goBack () {
                this.$router.push('/')
            }
        },
        components: {
            shopHeader
        }
    }
</script>

<style lang="stylus">
    @import "../assets/css/global"
    .login-container
        padding-top 50px
        .login-form-container
            margin-bottom 30px
            .form-row
                padding 10px 16px
                border-bottom 1px solid #eee
                .input
                    line-height 20px
                    font-size 14px
                    width 100%
                .qrcode
                    position absolute
                    top 50%
                    right 10px
                    padding 0 6px
                    border-radius 3px
                    line-height 30px
                    color #fff
                    background $globalColor
                    transform translateY(-50%)
                    &.active
                        background #ccc
                &.telephone
                    position relative
        .form-submit-btn
            width 94%
            margin 0 auto
            border-radius 4px
            line-height 40px
            color #fff
            text-align center
            font-size 18px
            background $globalColor
</style>