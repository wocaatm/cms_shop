<template>
    <div class="search-container">
        <div class="search-input-container clearfix">
            <span class='goback fl' @click='goBack()'><i class="fa fa-angle-left fa-2x"></i></span>
            <div class="search-input fl">
                <input type="text" placeholder="搜索" v-model='keyword' ref='search'>
                <i class="fa fa-search fa-lg icon-search"></i>
            </div>
            <span class="search-btn fr" @click='search()'>搜索</span>
        </div>
        <div class="search-result-container" v-if='result.length'>
            <div class="search-type-container" v-for='type in result'>
                <h3 class="search-type-title">{{type.type}}</h3>
                <ul class="type-product-container">
                    <li class="type-product-item" v-for='product in type.products'>
                        <router-link class='search-link' :to="{path: '/detail', query: {pid: product.id}}">
                            <div class="product-info">
                                <img class="inline product-thumb" :src="product.thumb" alt="">
                                <span class="product-title single-ellipsis">{{product.title}}</span>
                            </div>
                            <i class="fa fa-angle-right fa-2x" style="color:#000"></i>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <div class="no-search-result" v-if='!result.length && searched'>
            <i class="fa fa-search fa-2x"></i>
            <p class="no-search-result-tip">没有符合的内容</p>
        </div>
    </div>
</template>

<script>
    import { Toast } from 'mint-ui'
    import { mapGetters } from 'vuex'

    export default {
        data () {
            return {
                keyword: '',
                searched: false
            }
        },
        computed: {
            ...mapGetters({
                'keywordStore': 'keyword',
                'result': 'searchResult'
            })
        },
        mounted () {
            this.$refs.search.focus()
            this.keyword = this.keywordStore
        },
        methods: {
            search () {
                if (!this.keyword) {
                    Toast({
                        message: '请输入关键词',
                        position: 'middle',
                        duration: 1500
                    })
                    return
                }
                this.$store.dispatch('search', { keyword: this.keyword })
                    .then(() => {
                        this.searched = true
                    })
            },
            goBack () {
                this.$router.go(-1)
            }
        },
        // 进入详情页才会清除掉搜索的关键字
        beforeRouteLeave (to, from, next) {
            if ((to.path.indexOf('/detail') === -1)) {
                this.$store.dispatch('clearSearch')
                    .then(function () {
                        next()
                    })
            } else {
                next()
            }
        }
    }
</script>

<style lang="stylus">
    @import "../assets/css/global"
    .search-container
        padding-top 50px
        .search-input-container
            box-sizing border-box
            position fixed
            top 0
            left 0
            right 0
            height 50px
            padding 10px 2%
            background #f5f5f5
            line-height 30px
            .goback
                box-sizing border-box
                display inline-block
                width 10%
                padding-left 10px
                color #999
                .fa
                    vertical-align -3px
            .search-input
                display inline-block
                position relative
                width 70%
                input
                    box-sizing border-box
                    display inline-block
                    width 100%
                    height 30px
                    padding 0 38px
                    border-radius 15px
                .icon-search
                    position absolute
                    top 50%
                    left 13px
                    color #d9d9d9
                    transform translateY(-50%)
            .search-btn
                display inline-block
                width 16%
                border-radius 3px
                text-align center
                color #fff
                background $globalColor
        .search-result-container
            padding 10px
            .search-type-container
                margin-bottom 10px
                .search-type-title
                    line-height 30px
                    font-size 14px
                .search-link
                    display flex
                    justify-content space-between
                    align-items center
                    height 80px
                    padding-left 20px
                    border-bottom 1px solid #f5f5f5
                    color #000
                    .product-thumb
                        width 60px
                        height 60px
                        margin-right 20px
                        vertical-align middle
                    .product-title
                        max-width 180px
                        font-size 14px
        .no-search-result
            position absolute
            top 30%
            left 50%
            padding 0 30px
            text-align center
            font-size 14px
            color #666
            transform translate(-50%,-50%)
            .no-search-result-tip
                margin-top 10px
</style>
