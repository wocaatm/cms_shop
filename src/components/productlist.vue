<template>
    <div class="product-list-modules">
        <div class="no-product-in-type" v-if='!products.length && loaded'>
            <span><i class="fa fa-shopping-bag fa-3x"></i></span>
            <p class="no-product-tips">目前还没有商品~</p>
        </div>
        <ul class="product-list-container"
            v-else
        >
            <li class="product-item" v-for='(product, index) in products' :key="index">
                <router-link class='product-info-container' :to="{path: '/detail', query: {pid: product.id}}">
                    <div class="info-thumb-container">
                      <img :src="product.pic" alt="" class="info-thumb">
                    </div>
                    <div class="title-part">{{ product.name }}</div>
                </router-link>
            </li>
            <div class="loading-more-container" v-if='loading'>
                <mt-spinner type="fading-circle" color='#000' :size='24'></mt-spinner><span class="loading-tips">正在加载中...</span>
            </div>
            <div class="loaded-all">
                <span>已加载全部数据...</span>
            </div>
        </ul>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        data () {
            return {
                limit: 10,
                loading: false,
                type: '',
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
            offset () {
                return this.products.length
            },
            ...mapGetters({
                'products': 'getProductList',
                'userinfo': 'userCenterInfo'
            })
        },
        mounted () {
            this.initData()
        },
        methods: {
            initData () {
                this.$store.dispatch('initProductList', {})
                    .then(() => {
                        this.loaded = true
                    })
            }
        }
    }
</script>

<style lang="stylus">
    .product-list-container
        margin 10px 0
        background #eee
        .product-item
            margin 12px 9px 0px
            background #fff
            border-radius 6px
            overflow hidden
            .info-thumb
              width 100%
              height 180px
          .title-part
              position absolute
              left 0
              right 0
              bottom 0
              background rgba(0,0,0,.4)
              padding 6px 10px
              color #fff
              font-size 16px
          .product-info-container
              position relative
              display block
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
