<template>
    <div class="user-detail-info-container">
        <shop-header title='二维码信息'>
            <span slot='left' @click='goBack()'><i class="fa fa-angle-left fa-2x"></i></span>
        </shop-header>
        <div class="detail-info-row" v-for='field in fields'>
            <label class='detail-label'>{{field.title}}</label>
            <div class="detail-input-container">
                <input class="detail-input" :type='field.type' :value='field.value' :readonly='field.readonly' :data-key='field.name' v-if="getType(field.type, 'input')"/>
                <textarea class="detail-input textarea" resize='none' v-else-if="getType(field.type, 'textarea')" :readonly="field.readonly" :data-key='field.name'>{{field.value}}</textarea>
                <div class="detail-input" @click='openDatePicker($event)' :data-key="field.name" v-else-if="getType(field.type, 'date')">{{field.value}}</div>
                <div class="detail-input" @click='openTimePicker($event)' :data-key="field.name" v-else-if="getType(field.type, 'time')">{{field.value}}</div>
                <ul class="detail-input J-more-value auto clearfix" v-else-if="getType(field.type, 'checkbox')" :data-key='field.name'>
                    <li class="check-list-item fl" v-for='(value, key) in field.valueArr'>
                        <label class="checkbox-container" :for='field.name + key'>
                            <input type="checkbox" class='checkbox-input' :value="key" :id='field.name + key' :checked="value.checked">
                            <span class="checkbox-core"></span>
                        </label>
                        <span>{{value.title}}</span>
                    </li>
                </ul>
                <ul class="detail-input J-more-value auto clearfix" v-else-if="getType(field.type, 'radio')" :data-key='field.name'>
                    <li class="check-list-item fl" v-for='(value, key) in field.valueArr'>
                        <label class="radio-container time-select" :for="field.name + key">
                            <input type="radio" class='radio-input' :value='key' :id="field.name + key" :name='field.name' :checked="value.checked">
                            <span class="radio-core"></span>
                        </label>
                        <span>{{value.title}}</span>
                    </li>
                </ul>
                <select class="detail-input" :data-key='field.name' v-else-if="getType(field.type, 'select')">
                    <option v-for='(value, key) in field.valueArr' :value="key">{{value}}</option>
                </select>
            </div>
        </div>
        <div class="save-userinfo-container">
            <span class="save-userinfo-btn" @click='saveInfo()'>保存消费信息</span>
        </div>
        <mt-datetime-picker
            :startDate="new Date(1900,1,1)"
            ref='datepicker'
            type="date"
            @confirm="dateSelected">
        </mt-datetime-picker>
        <mt-datetime-picker
            :startDate="new Date(1900,1,1)"
            ref='timepicker'
            type="time"
            @confirm="timeSelected">
        </mt-datetime-picker>
    </div>
</template>

<script>
    import shopHeader from '../../components/header'
    import * as types from '../../lib/inputType'
    import Api from '../../api/index'
    import { Toast } from 'mint-ui'

    export default {
        data () {
            return {
                fields: '',
                orderId: '',
                qrcodeId: '',
                dateElement: '',
                timeElement: ''
            }
        },
        mounted () {
            this.orderId = this.$route.query.orderId
            this.qrcodeId = this.$route.query.qrcodeId
            this.initField()
        },
        methods: {
            initField () {
                Api.getQrcodeNeedInfo()
                    .then((response) => {
                        this.fields = response.data
                    })
            },
            getType (type, result) {
                return types[result].indexOf(type) === -1 ? 0 : 1
            },
            serializa () {
                var inputs = [].slice.call(document.getElementsByClassName('detail-input'))
                var userInfo = {}
                inputs.forEach(function (item) {
                    var key = item.getAttribute('data-key')
                    var value
                    if (item.classList.contains('J-more-value')) {
                        var checkSelected = [].slice.call(item.querySelectorAll('input:checked'))
                        value = checkSelected.map(function (item) {
                            return item.value
                        })
                    } else {
                        value = item.value ? item.value : item.innerHTML
                    }
                    userInfo[key] = value
                })
                return userInfo
            },
            saveInfo () {
                var qrcodeInfo = this.serializa()
                var data = {
                    orderId: this.orderId,
                    qrcodeId: this.qrcodeId,
                    qrcodeInfo: qrcodeInfo
                }
                Api.saveQrocdeInfo(data)
                    .then((response) => {
                        if (response.data.success) {
                            Toast({
                                message: '提交成功',
                                position: 'middle',
                                duration: 1500
                            })
                            setTimeout(() => {
                                this.goBack()
                            }, 1500)
                        } else {
                            Toast({
                                message: response.data.errorMsg,
                                position: 'middle',
                                duration: 1500
                            })
                        }
                    })
            },
            openDatePicker (e) {
                this.dateElement = e.target
                this.$refs.datepicker.open()
            },
            openTimePicker (e) {
                this.timeElement = e.target
                this.$refs.timepicker.open()
            },
            dateSelected (value) {
                var date = new Date(value)
                this.dateElement.innerHTML = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            },
            timeSelected (value) {
                this.timeElement.innerHTML = value
            },
            goBack () {
                this.$router.go(-1)
            }
        },
        components: {
            shopHeader
        },
        watch: {
            '$route' (to) {
                this.initField()
            }
        }
    }
</script>

<style lang='stylus'>
    @import "../../assets/css/global"
    .user-detail-info-container
        padding 50px 0 20px
        .detail-info-row
            position relative
            padding-left 10px
            font-size 16px
            border-bottom 1px solid #eee
            .detail-label
                display inline-block
                width 100px
            .detail-input-container
                display inline-block
                vertical-align middle
                .detail-input
                    box-sizing border-box
                    display inline-block
                    width calc(100vw - 130px)
                    height 50px
                    line-height 50px
                    border none
                    vertical-align middle
                    &.textarea
                        height 150px
                        line-height noraml
                    &.auto
                        height auto
                        line-height noraml
                    .check-list-item
                        margin-right 10px
                    .checkbox-container
                        vertical-align 2px
            .validate-state
                position absolute
                top 0
                right 10px
                &.success
                    color $globalColor
                &.error
                    color $globalFontColor
        .more-info-container
            margin-top 20px
            padding-right 10px
            text-align right
            .more-info-link
                font-size 14px
                color #333
                text-decoration underline
        .save-userinfo-container
            margin-top 30px
            .save-userinfo-btn
                display block
                width 96%
                margin 0 auto
                border-radius 4px
                line-height 46px
                text-align center
                color #fff
                font-size 14px
                background $globalColor
</style>