// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './assets/css/reset.css'
import 'wangeditor/dist/css/wangEditor.min.css'
import 'font-awesome/css/font-awesome.min.css'
import 'mint-ui/lib/style.css'
import router from './router'
import MintUI from 'mint-ui'
import store from './vuex/index'

Vue.use(MintUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    router,
    store
}).$mount('#app')