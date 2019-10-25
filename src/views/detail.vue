<template>
    <div class="product-detail-container">
        <shop-header title='商品详情'>
            <span slot='left' @click='goBack()'><i class="fa fa-angle-left fa-2x"></i></span>
        </shop-header>
        <div class="detail-main-container" v-if="!loading">
            <div class="detail-info-container">
                <div class="detail-info-thumb" v-if='detail.pic'>
                    <img class='detail-thumb' :src="detail.pic" alt="">
                </div>
                <h3 class="detail-content-title" style="margin: 6px -10px 0" v-if="sceneInfo">商家信息</h3>
                <div class="shop-info-container">
                  <div class="product-select-row">
                    <span class="select-name">景区名称：</span>
                    <span style="font-size: 14px;">{{ sceneInfo.name }}</span>
                  </div>
                  <div class="product-select-row">
                    <span class="select-name">景区地址：</span>
                    <span style="font-size: 14px;">{{ sceneInfo.address }}</span>
                  </div>
                  <div class="product-select-row">
                    <span class="select-name">景区电话：</span>
                    <a :href="`tel:${sceneInfo.tel}`" style="font-size: 14px;">{{ sceneInfo.tel }}</a>
                  </div>
                </div>
                <h3 class="detail-content-title" style="margin: 6px -10px 0">产品参数</h3>
                <div class="detail-info-msg">
                    <h3 class="info-msg-title">{{detail.name}}</h3>
                    <div class="product-select-row">
                      <span class="select-name">可用日期：</span>
                      <div class="select-option-container">
                        <span class="option-item" v-if="dateSet.includes(tag.id)" @click="changeDisabledOption(0, tag.id)" :key="tag.id" v-for="(tag) in detail.use_dates_label" :class="{active: tag.id == dataIndex}">{{ tag.name }}</span>
                        <span class="option-item disabled" v-else>{{tag.name}}</span>
                      </div>
                    </div>
                    <div class="product-select-row">
                      <span class="select-name">雪板类型：</span>
                      <div class="select-option-container">
                        <span class="option-item" v-if="stateSet.includes(tag.id)" @click="changeDisabledOption(1, tag.id)" :key="tag.id" v-for="(tag) in detail.skis_state_label" :class="{active: tag.id == stateIndex}">{{ tag.name }}</span>
                        <span class="option-item disabled" v-else>{{tag.name}}</span>
                      </div>
                    </div>
                    <div class="product-select-row">
                      <span class="select-name">滑雪时长：</span>
                      <div class="select-option-container">
                        <span class="option-item" v-if="timeSet.includes(tag.id)" @click="changeDisabledOption(2, tag.id)" :key="tag.id" v-for="(tag) in detail.skiing_time_label" :class="{active: tag.id == timeIndex}">{{ tag.name }}</span>
                        <span class="option-item disabled" v-else>{{tag.name}}</span>
                      </div>
                    </div>
                    <div class="product-select-row">
                      <span class="select-name">附加服务：</span>
                      <div class="select-option-container">
                        <span class="option-item" v-if="serviceSet.includes(tag.id)" @click="changeDisabledOption(3, tag.id)" :key="tag.id" v-for="(tag) in detail.add_services_label" :class="{active: tag.id == serviceIndex}">{{ tag.name }}</span>
                        <span class="option-item disabled" v-else>{{tag.name}}</span>
                      </div>
                    </div>
                    <div class="detail-row">
                      <span class="detail-row-title">单价：</span><span class="detail-row-content price">￥ {{singleProductPrice}}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-row-title">购买数量：</span>
                        <div class="opration-container">
                            <input class='pro-num' type="num" :value="count" @blur='swtichCartNum($event)'>
                        </div>
                    </div>
                </div>
            </div>
            <h3 class="detail-content-title">产品内容</h3>
            <div class="wangEditor-container">
                <div class="wangEditor-txt" v-html='detail.memo'></div>
            </div>
        </div>
        <div class="buy-product-info">
            <div class="all-price"><span>总价：</span>￥{{ allPrice }}</div>
            <span class="buy-now" @click="buy">立即购买</span>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import { isPositiveNum } from '../lib/util'
    import { Toast, MessageBox } from 'mint-ui'
    import * as tips from '../lib/tips'
    import shopHeader from '../components/header'
    import Api from '../api/index';

    export default {
        data () {
            return {
                pid: '',
                count: 1,
                loading: true,
                timeOriginal: [],
                stateOriginal: [],
                dateOriginal: [],
                serviceOriginal: [],
                timeSet: [],
                stateSet: [],
                dateSet: [],
                serviceSet: [],
                timeIndex: '',
                stateIndex: '',
                dataIndex: '',
                serviceIndex: ''
            }
        },
        computed: {
            ...mapGetters({
                'detail': 'productDetail',
                'sceneInfo': 'sceneInfo',
                'info': 'userCenterInfo'
            }),
            selectedProductId () {
              const t = this;
              return `${t.dataIndex}_${t.stateIndex}_${t.timeIndex}_${t.serviceIndex}`;
            },
            singleProductPrice () {
              const t = this;
              const list = t.detail.product_list;
              let price = 0;

              if (list) {
                list.forEach(li => {
                  if (li.label_view == t.selectedProductId) price = li.price
                })
              }

              return price
            },
            allPrice () {
                return this.singleProductPrice * this.count
            }
        },
        mounted () {
            this.pid = this.$route.query.pid
            this.$store.dispatch('getProductDetail', { pid: this.pid })
            if (!this.sceneInfo) this.initSwipe()
        },
        methods: {
            swtichCartNum (e) {
                let target = e.target
                if (!isPositiveNum(target.value)) {
                    Toast({
                        message: tips.NOT_POSITIVE_NUMBER,
                        position: 'middle',
                        duration: 1500
                    })
                    target.value = this.count
                    return
                }
                this.count = target.value
            },
            buy () {
              const t = this;
              const memberId = t.info.memberid;
              let id = ''
              t.detail.product_list.forEach(p => {
                if (p.label_view == t.selectedProductId) id = p.id;
              })
              // 验证是否可以购买
              Api.verifyCart({ pid: id, num: t.count, member_id: memberId })
                .then((response) => {
                  if (response.data.success) {
                    t.$router.push({ path: '/pay', query: { orderId: response.data.data.ordernumber } })
                  } else {
                    MessageBox.alert(response.data.errorMsg)
                  }
                })
            },
            goBack () {
                this.$router.go(-1)
            },
            splitOptions (productId) {
              const splitArr = productId.split('_');
              const setArr = ['dataIndex', 'stateIndex', 'timeIndex', 'serviceIndex'];

              setArr.forEach((k, i) => {
                this[k] = splitArr[i];
              })
            },
            changeDisabledOption (clickRowIndex, to) {
              const t = this;
              const list = t.detail.product_list;
              const setArr = ['dateSet', 'stateSet', 'timeSet', 'serviceSet'];
              const setOriArr = ['dateOriginal', 'stateOriginal', 'timeOriginal', 'serviceOriginal'];
              let canSelectP = [];
              let firstItem = ''

              // 检测改变是否能满足当前id
              const nowIdArr = t.selectedProductId.split('_');
              nowIdArr.splice(clickRowIndex, 1, to);
              const newId = nowIdArr.join('_');

              list.forEach(li => {
                if (li.label_view == newId) firstItem = newId;
              })

              // 寻找第一个满足条件的默认值
              list.forEach(li => {
                let splitArr = li.label_view.split('_');
                if (splitArr[clickRowIndex] == to) {
                  if (!firstItem) firstItem = li.label_view
                  canSelectP.push(li);
                }
              });

              // 如果没找到符合条件的
              if (!canSelectP.length) return;

              // 切换第一个维度的时候初始化其他维度
              setArr.forEach((item, index) => {
                if (index == clickRowIndex) {
                  t[item] = JSON.parse(JSON.stringify(t[setOriArr[index]]));
                } else {
                  t[item] = [];
                }
              })

              // 切割展示满足条件的第一个选项
              t.splitOptions(firstItem);

              // 根据选择的第一项去重新生成可选的set
              canSelectP.forEach(li => {
                const view = li.label_view.split('_');

                view.forEach((o, index) => {
                  // 只对应更新除了timeSet的集合
                  if (index != clickRowIndex) {
                    let set = t[setArr[index]];
                    if (!set.includes(+o)) {
                      set.push(+o)
                    }
                  }
                })
              });
            },
            ...mapActions([
              'initSwipe'
            ])
        },
        components: {
            shopHeader
        },
        watch: {
            detail (to) {
              const t = this;
              const list = to.product_list;
              const originalArr = ['dateOriginal', 'stateOriginal', 'timeOriginal', 'serviceOriginal'];

              list.forEach(li => {
                const arr = li.label_view.split('_');

                arr.forEach((item, index) => {
                  const originalSet = t[originalArr[index]];

                  if (!originalSet.includes(+item)) originalSet.push(+item);
                })
              });

              t.dateSet = JSON.parse(JSON.stringify(t.dateOriginal));

              t.dataIndex = t.dateSet[0];

              t.changeDisabledOption(0, t.dataIndex);

              this.loading = false
            }
        }
    }
</script>

<style lang="stylus">
    @import "../assets/css/global"
    .product-detail-container
        padding 50px 0
        .detail-main-container
            padding-bottom 40px
            .detail-category
                padding 10px 15px
                font-size 16px
                color #000
                background #f0f2f5
            .detail-info-container
                padding 0 10px
                margin-top 10px
                .detail-info-thumb
                    width calc(100vw - 20px)
                    height calc(100vw - 20px)
                    .block
                        height 100%
                    .detail-thumb
                        width 100%
                        height 100%
                .detail-info-msg
                    margin-top 10px
                    .info-msg-title
                        padding 5px 0
                        font-size 16px
                        color #000
                    .detail-row
                        padding 8px 0
                        font-size 14px
                        color #000
                        .detail-row-title
                            display inline-block
                            min-width 80px
                        .detail-row-content
                            color #333
                            &.price
                                color $globalFontColor
                        .opration-container
                            display inline-block
                            margin-right 8px
                            vertical-align middle
                            .opration-btn
                                display inline-block
                                width 26px
                                height 26px
                                vertical-align middle
                                &.multi
                                    margin-right 3px
                                &.plus
                                    margin-left 3px
                            input
                                width 36px
                                height 18px
                                border-bottom 1px solid #eee
                                border-radius 3px
                                text-align center
                .product-select-row
                  margin 8px 0 0px
                  display flex
                  .select-name
                    color #000
                    font-size 14px
                    min-width 80px
                  .select-option-container
                    display flex
                    flex-wrap wrap
                    .option-item
                      padding 2px 10px
                      border 1px solid #11b111
                      border-radius 4px
                      color #333
                      margin 0 6px 8px 0
                      &.active
                        background #11b111
                        color #fff
                      &.disabled
                        border-color #ccc
                        color: #ccc
            .detail-content-title
                margin-top 10px
                padding-left 15px
                line-height 40px
                color #000
                background #eee
            .wangEditor-container
                border none
        .buy-product-info
            position fixed
            left 0
            right 0
            bottom 0px
            z-index 10
            display flex
            padding-left 20px
            justify-content space-between
            align-items center
            height  48px
            font-size 16px
            background #ffffff
            box-shadow 0 -1px 2px rgba(0, 0, 0, 0.1)
            .all-price
              color #fe2400
              span
                color #333
            .buy-now
              background $globalColor
              color #fff
              line-height 48px
              padding 0 20px
              cursor pointer
</style>
