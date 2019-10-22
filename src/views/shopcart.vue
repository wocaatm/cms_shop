<template>
    <div class="shop-cart-container">
        <ul class="cart-list-container" v-if='shopCart.length' ref='shopcart'>
            <li class="cart-list-item" v-for='(product, index) in shopCart' :data-index='index'>
                <router-link class='block' :to="{path: '/detail', query: {pid: product.id}}">
                    <div class="list-item-content clearfix" :class="{'delete-state': deleteActive[index]}">
                        <div class="list-item-opration fl">
                            <label class="checkbox-container" @click.prevent='selectProduct($event)' :data-index='index'>
                                <input type="checkbox" class='checkbox-input' :class="{selected: checkbox[index]}">
                                <span class="checkbox-core"></span>
                            </label>
                        </div>
                        <div class="list-item-thumb-container fl">
                            <img class='list-product-thumb' :src="product.thumb" alt="">
                        </div>
                        <div class="list-product-info fl">
                            <h3 class="product-info-title single-ellipsis">{{product.title}}</h3>
                            <p class="product-info-description single-ellipsis">{{product.description}}</p>
                            <div class="list-pay-info">
                                <span class="price">￥ {{product.price}}</span>
                                <span class="opration-container">
                                    <span class='opration-btn multi' @click.prevent='switchCart(index, -1)'><img class='opration-icon' src="../assets/images/multi.png"></span><span class="pro-num">{{product.count}}</span><span class='opration-btn plus' @click.prevent='switchCart(index, 1)'><img class='opration-icon' src="../assets/images/plus.png" alt=""></span>
                                </span>
                            </div>
                        </div>
                    </div>
                </router-link>
                <transition name='slideLeft'>
                    <div class="delete-cart-container" v-if='deleteActive[index]' @click="hideDelete(index)" :data-index='index'>
                        <span class="delete-btn" @click.stop='deleteCart(index, product.id)'>删除</span>
                    </div>
                </transition>
                
            </li>
        </ul>
        <div class="no-product" v-else>
            <i class="fa fa-cart-plus fa-3x"></i>
            <p class="no-product-tip">购物车没有商品~</p>
        </div>
        <div class="pay-opration-container clearfix">
            <div class="select-all-product fl">
                <label class="checkbox-container" @click.prevent='switchCheckAll()'>
                    <input type="checkbox" class='checkbox-input' :class="{selected: checkAll && shopCart.length}">
                    <span class="checkbox-core"></span>
                </label>
                <span class="selected-all-tip">全选</span>
            </div>
            <div class="fr">
                <span>合计<i class="price">{{totalPrice}}</i>元</span>
                <button class="pay-btn" @click='payMoney()'>结算<i class="fa fa-caret-right"></i></button>
            </div>
        </div>
        <shop-footer :type='2'></shop-footer>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { searchParentNode } from '../lib/util'
    import * as tips from '../lib/tips'
    import { Toast, MessageBox } from 'mint-ui'
    import Api from '../api/index'
    import shopFooter from '../components/footer'
    import '../lib/hammer.min'

    export default {
        data () {
            return {
                checkbox: [],
                deleteActive: []
            }
        },
        mounted () {
            this.checkbox = this.shopCart.map(function (item) {
                return item.state
            })
            this.initDeleteArr()
            this.initDelteEvent()
        },
        computed: {
            checkAll () {
                return (this.checkbox.reduce(function (pre, curr) {
                    return pre + curr
                }, 0)) === this.checkbox.length
            },
            totalPrice () {
                var totalPrice = 0
                this.checkbox.forEach((item, index) => {
                    if (item && this.shopCart[index]) {
                        var product = this.shopCart[index]
                        totalPrice += product.price * product.count
                    }
                })
                return totalPrice.toFixed(2)
            },
            ...mapGetters([
                'shopCart'
            ])
        },
        methods: {
            initCheckbox (checked) {
                this.checkbox = this.shopCart.map(function () {
                    return checked
                })
            },
            initDeleteArr () {
                this.deleteActive = this.shopCart.map(function () {
                    return 0
                })
            },
            initDelteEvent () {
                if (!this.shopCart.length) return
                var hammertime = new window.Hammer(this.$refs.shopcart)
                hammertime.on('swipeleft', (e) => {
                    var node = searchParentNode(e.target, 'li')
                    var nodeIndex = node.getAttribute('data-index')
                    this.deleteActive.splice(nodeIndex, 1, 1)
                })
                hammertime.on('swiperight', (e) => {
                    var node = searchParentNode(e.target, 'li')
                    var nodeIndex = node.getAttribute('data-index')
                    this.deleteActive.splice(nodeIndex, 1, 0)
                })
            },
            selectProduct (e) {
                var target = e.target
                if (target.nodeName.toLowerCase() !== 'label') target = target.parentNode
                var index = target.getAttribute('data-index')
                var newValue = 1 - this.checkbox[index]
                if (this.shopCart[index].state) {
                    var id = this.shopCart[index].id
                    this.$store.dispatch('switchCartState', id)
                        .then(() => {
                            this.shopCart[index].state = false
                        })
                }
                this.checkbox.splice(index, 1, newValue)
            },
            switchCheckAll () {
                if (this.checkAll) {
                    this.$store.dispatch('switchCartState', 'all')
                        .then(() => {
                            this.initCheckbox(0)
                        })
                } else {
                    this.initCheckbox(1)
                }
            },
            switchCart (index, count) {
                /* count是变化量 */
                var product = this.shopCart[index]
                if (product.count === 1 && count === -1) return
                var data = Object.assign({}, product)
                data.count = count
                this.$store.dispatch('switchShopCart', data)
            },
            hideDelete (index) {
                this.deleteActive.splice(index, 1, 0)
            },
            deleteCart (index, id) {
                this.$store.dispatch('deleteShopCart', [id])
                    .then(() => {
                        this.deleteActive.splice(index, 1)
                        this.checkbox.splice(index, 1)
                    })
            },
            deleteCartSelected () {
                var ids = []
                var indexs = []
                var checkOne = false
                if (!this.checkbox.length) return
                this.checkbox.forEach((item, index) => {
                    if (item) {
                        ids.push(this.shopCart[index].id)
                        indexs.push(index)
                        if (!checkOne) checkOne = true
                    }
                })
                if (!checkOne) {
                    MessageBox.alert(tips.SELECT_DELETE_PRODUCT)
                    return
                }
                MessageBox.confirm(tips.DELETE_PRODUCT_OR_NOT)
                    .then(() => {
                        this.$store.dispatch('deleteShopCart', ids)
                            .then(() => {
                                var newTarget = []
                                indexs.forEach((i) => {
                                    this.checkbox[i] = false
                                })
                                this.checkbox.forEach(function (item) {
                                    if (item !== false) newTarget.push(item)
                                })
                                this.checkbox = newTarget
                            })
                    }, () => {})
            },
            payMoney () {
                /* 先验证购物车产品的有效性 */
                var products = []
                this.checkbox.forEach((item, index) => {
                    if (item) {
                        products.push(this.shopCart[index])
                    }
                })
                if (!products.length) {
                    Toast({
                        message: tips.SELECT_PAY_PRODUCT,
                        position: 'middle',
                        duration: 1500
                    })
                    return
                }
                /* 添加选择产品的index */
                Api.verifyCart({ products })
                    .then((response) => {
                        if (response.data.success) {
                            this.$store.dispatch('selectProductIndex', products)
                                .then(() => {
                                    this.$router.push('/pay')
                                })
                        } else {
                            MessageBox.alert(response.data.errorMsg)
                        }
                    })
            }
        },
        components: {
            shopFooter
        }
    }
</script>

<style lang='stylus'>
    @import "../assets/css/global"
    
    .shop-cart-container
        padding-bottom 50px
        .no-product
            position absolute
            top 45%
            left 50%
            font-size 16px
            text-align center
            color #999
            transform translate(-50%,-50%)
            .no-product-tip
                margin-top 10px
        .cart-list-container
            padding-bottom 50px
            background #eee
            background-clip content-box
            overflow-x hidden
            .cart-list-item
                position relative
                margin-bottom 1px
                background #fff
                .list-item-content
                    position relative
                    padding 16px 0
                    transition transform 0.4s
                    .list-item-opration
                        display flex
                        align-items center
                        height 80px
                        padding 0 8px
                    .list-item-thumb-container
                        margin-right 10px
                        .list-product-thumb
                            width 80px
                            height 80px
                    &.delete-state
                        transform translateX(-60px)
                .list-product-info
                    width 60%
                    .product-info-title
                        font-weight 500
                        font-size 16px
                        color #000
                    .product-info-description
                        margin 6px 0
                        color #666
                        font-size 14px
                    .list-pay-info
                        display flex
                        justify-content space-between
                        align-items center
                        .price
                            font-weight bold
                            color $globalFontColor
                        .opration-container
                            margin-right 8px
                            .opration-btn
                                box-sizing border-box
                                display inline-block
                                width 26px
                                height 26px
                                background transparent
                                vertical-align middle
                                overflow hidden
                                &.multi
                                    margin-right 3px
                                &.plus
                                    margin-left 3px
                            .pro-num
                                margin 0 8px
                                color #000
                                font-size 14px
                .delete-cart-container
                    position absolute
                    background transparent
                    top 0
                    left 0 
                    right 0
                    bottom 0
                    .delete-btn
                        display flex
                        align-items center
                        justify-content center
                        box-sizing border-box
                        position absolute
                        right 0
                        top 0
                        bottom 0
                        width 60px
                        color #fff
                        font-size 16px
                        background $globalFontColor
                &:last-child
                    margin-bottom 0
        .pay-opration-container
            position fixed
            bottom 50px
            left 0
            right 0
            height 50px
            line-height 50px
            padding-left 10px
            border-top 1px solid #eee
            background rgba(255,255,255,.9)
            .selected-all-tip
                margin-left 10px
            .price
                margin 0 5px
                font-size 16px
                font-style normal
                font-weight blod
                color $globalFontColor
            .pay-btn
                display inline-block
                height 50px
                margin-left 10px
                padding 0 30px
                border none
                font-size 16px
                color #fff
                text-align center
                background $globalColor
                .fa
                    margin-left 10px
    .slideLeft-enter, .slideLeft-leave-to
        transform translateX(60px)
    .slideLeft-enter-active, .slideLeft-leave-active
        transition transform 0.4s
</style>