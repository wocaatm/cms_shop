<template>
    <div class="index-container">
<!--        <div class="search-contianer" ref='search'>-->
<!--            <router-link class='search-rotuer' :to="{path: '/search'}">-->
<!--                <div class="search-content-container">-->
<!--                    <span class="search-icon"><i class="fa fa-search"></i></span><span class="search-placeholder">搜索票务、酒店</span>-->
<!--                </div>-->
<!--            </router-link>-->
<!--        </div>-->
        <div class="index-main-container">
            <div class="slider-modules" v-if='swipes.length'>
                <mt-swipe :auto="4000">
                    <mt-swipe-item v-for='swipe in swipes' :key='swipe.pid'>
                        <a class='block' :href="swipe.url"><img :src="swipe.thumb" alt="" width='100%' height="200px" :pid="swipe.pid"></a>
                    </mt-swipe-item>
                </mt-swipe>
            </div>
            <shop-product-list></shop-product-list>
        </div>
        <shop-footer :type='0'></shop-footer>
    </div>
</template>

<script>
    import shopFooter from '../components/footer'
    import shopProductList from '../components/productlist'
    import { mapActions, mapGetters } from 'vuex'

    export default {
        computed: {
            ...mapGetters({
                'swipes': 'getSwipe',
                'categorys': 'getCategory'
            })
        },
        mounted () {
            this.initSwipe()
            this.initScrollEvent()
        },
        methods: {
            initScrollEvent () {
                this.$nextTick(() => {
                    document.addEventListener('scroll', this.scrollRgb)
                })
            },
            scrollRgb () {
                const scrollTop = document.documentElement.scrollTop
                let opacity
                // 144为焦点图的高度
                if (scrollTop > 144) {
                    opacity = 1
                } else {
                    opacity = (scrollTop / 144).toFixed(2)
                }
                this.$refs.search.style.background = `rgba(244,244,244,${opacity})`
            },
            ...mapActions([
                'initSwipe'
            ])
        },
        beforeRouteLeave (to, from, next) {
            document.removeEventListener('scroll', this.scrollRgb)
            next()
        },
        components: {
            shopFooter,
            shopProductList
        }
    }
</script>

<style lang='stylus'>
    .index-container
        padding-bottom 50px
        background #eee
        background-clip content-box
        min-height calc(100vh - 50px)
        .search-contianer
            box-sizing border-box
            position fixed
            top 0
            left 0
            right 0
            z-index 999
            height 40px
            color #666
            text-align center
            .search-rotuer
                display block
                padding 7px 0
            .search-content-container
                box-sizing border-box
                display inline-block
                width 60%
                padding-left 12px
                border-radius 12px
                line-height 26px
                text-align left
                color #333
                background rgba(255,255,255,.8)
                .search-icon
                    margin-right 5px
        .slider-modules
            height 200px
        .category-modules
            background #fff
            .category-ul-container
                display flex
                padding 10px 0
                flex-wrap nowrap
                width 100%
                overflow-x auto
                .category-item
                    box-sizing border-box
                    flex 0 0 20%
                    text-align center
                    .category-item-link
                        display block
                    .category-item-thumb
                        display inline-block
                        box-sizing border-box
                        width 50px
                        height 50px
                    .category-title
                        margin-top 6px
                        color #666
</style>
