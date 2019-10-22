<template>
    <div class="product-list-modules">
        <div class="no-product-in-type" v-if='!products.length && loaded'>
            <span><i class="fa fa-shopping-bag fa-3x"></i></span>
            <p class="no-product-tips">目前还没有商品~</p>
        </div>
        <ul class="product-list-container"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
            infinite-scroll-immediate-check="false"
            v-else
        >
            <li class="product-item" v-for='(product, index) in products' :key="index">
                <router-link class='product-info-container' :to="{path: '/detail', query: {pid: product.id}}">
                    <div class="info-thumb-container">
                      <img :src="product.thumb" alt="" class="info-thumb">
                    </div>
                    <div style="margin: 0 9px;">
                      <div class="info-title-price-part">
                        <span class="title-part">{{ product.title }}</span>
                        <span class="price-part">￥{{ product.price }}</span>
                      </div>
                      <div class="info-description single-ellipsis">{{ product.description }}</div>
                    </div>
                </router-link>
            </li>
            <div class="loading-more-container" v-if='loading'>
                <mt-spinner type="fading-circle" color='#000' :size='24'></mt-spinner><span class="loading-tips">正在加载中...</span>
            </div>
            <div class="loaded-all" v-if='!hasMore && onceLoadMore'>
                <span>已加载全部数据...</span>
            </div>
        </ul>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { assignObj } from '../lib/util'
    import '../assets/js/jquery'
    import '../assets/js/fly'

    export default {
        data () {
            return {
                limit: 10,
                loading: false,
                type: '',
                onceLoadMore: false,
                loaded: false
            }
        },
        computed: {
            query () {
                return {
                    limit: this.limit,
                    offset: this.offset,
                    type: this.type || ''
                }
            },
            cartIds () {
                return this.shopCart.map(function (item) {
                    return item.id
                })
            },
            offset () {
                return this.products.length
            },
            ...mapGetters({
                'products': 'getProductList',
                'hasMore': 'hasMoreProduct',
                'shopCart': 'shopCart',
                'userinfo': 'userCenterInfo'
            })
        },
        mounted () {
            this.type = this.$route.query.type
            this.initData()
        },
        methods: {
            initData () {
                this.query.offset = 0
                this.$store.dispatch('initProductList', this.query)
                    .then(() => {
                        this.loaded = true
                    })
            },
            loadMore () {
                if (!this.hasMore) return
                if (!this.onceLoadMore) this.onceLoadMore = true
                this.loading = true
                this.$store.dispatch('loadMoreProduct', this.query)
                    .then(() => {
                        this.loading = false
                    })
            },
            getCartCount (value) {
                return this.shopCart[value].count
            },
            switchCart (e) {
                if (!this.userinfo) {
                    this.$router.push('/login')
                    return
                }
                var target = e.target
                if (target.classList.contains('opration-icon')) target = target.parentNode
                var product = this.products[+target.getAttribute('data-index')]
                var count = +target.getAttribute('data-switch')
                var data = {
                    id: '',
                    title: '',
                    description: '',
                    thumb: '',
                    price: '',
                    count: +target.getAttribute('data-switch')
                }
                var result = assignObj(data, product)
                this.$store.dispatch('switchShopCart', result)
                    .then(() => {
                        if (count === 1) {
                            this.addAnimation(e, target)
                        }
                    })
            },
            addAnimation (e, target) {
                var flyer = window.$("<img class='cart-add-animation'/>").attr('src', target.getAttribute('data-thumb'))
                flyer.fly({
                    start: {
                        left: e.pageX,
                        top: (e.pageY - window.$('body').scrollTop())
                    },
                    end: {
                        left: 3 * window.innerWidth / 4 - 30,
                        top: window.innerHeight - 40,
                        width: 0,
                        height: 0
                    },
                    onEnd: function () {
                        this.destory()
                    }
                })
            }
        }
    }
</script>

<style lang="stylus">
    .product-list-container
        margin-top 10px
        background #eee
        .product-item
            position relative
            margin 12px 9px 0px
            padding-bottom 10px
            background #fff
            border-radius 6px
            overflow hidden
            .info-thumb-container
              height 198px
            .info-title-price-part
              display flex
              justify-content space-between
              margin 9px 0 4px
              .title-part
                color #333
                font-size 18px
              .price-part
                color #46A9FC
                font-size 18px
                font-weight bold
            .info-description
              font-size 14px
              color #666
        .loading-more-container
            padding 6px 0
            text-align center
            background #fff
            color #000
            span
                display inline-block
                vertical-align middle
                &.loading-tips
                    margin-left 10px
                    font-size 14px
        .loaded-all
            padding 8px 0
            color #000
            text-align center
    .no-product-in-type
        padding-top 40px
        text-align center
        font-size 16px
        color #999
        background #fff
        .no-product-tips
            margin-top 10px
    .cart-add-animation
        position fixed
        display block
        width 60px
        height 60px
        border-radius 100%
        z-index 9999
</style>
