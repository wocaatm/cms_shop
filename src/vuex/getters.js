//获取list
export const getSwipe = (state) => state.index.swipe

//获取分类列表
export const getCategory = (state) => state.index.category

//获取产品列表
export const getProductList = (state) => state.product.productList

//产品列表hasMore
export const hasMoreProduct = (state) => state.product.hasMore

//购物车
export const shopCart = (state) => state.shopcart.cart

//购物车的总数量
export const shopCartCount = (state) => {
    let count = 0
    state.shopcart.cart.forEach(function (item) {
        count += item.count
    })
    return count
}

//获取选中购物车的index
export const getProductIndex = (state) => state.shopcart.selectedIndex

//获取商品详情
export const productDetail = (state) => state.detail.info

//获取用户信息
export const userCenterInfo = (state) => state.user.userinfo

//获取订单列表
export const getOrderList = (state) => state.order.orderList

//订单列表状态
export const getOrderType = (state) => state.order.orderType

//搜索页面
export const keyword = (state) => state.search.keyword

export const searchResult = (state) => state.search.searchResult

//获取办理押金的信息
export const depositInfo = (state) => state.deposit.info

// 详情页商家信息
export const sceneInfo = (state) => state.index.sceneInfo
