<template>
    <div class="header">
        <div class="header-left">
            <slot name='left'></slot>
        </div>
        <div class="header-title">{{title}}</div>
        <div class="header-right">
            <slot name='right'></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                required: true,
                type: String
            }
        }
    }
</script>

<style lang="stylus">
    .header
        display flex
        justify-content space-between
        align-items center
        position fixed
        top 0
        left 0
        right 0
        z-index 999
        height 49px
        color #333
        background #fff
        border-bottom 1px solid #eee
        .header-left
            flex-basis 40px
            text-align center
        .header-title
            flex-grow 1
            text-align center
            font-size 16px
            font-weight 500
        .header-right
            flex-basis 40px
            text-align center
</style>