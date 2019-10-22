<template>
    <div class="category-container">
        <shop-header title='商品列表'></shop-header>
        <shop-product-list></shop-product-list>
        <shop-footer :type='1'></shop-footer>
    </div>
</template>

<script>
    import shopProductList from '../components/productlist'
    import shopFooter from '../components/footer'
    import shopHeader from '../components/header'

    export default {
        components: {
            shopProductList,
            shopFooter,
            shopHeader
        }
    }
</script>

<style lang='stylus'>
    .category-container
        padding 50px 0
</style>