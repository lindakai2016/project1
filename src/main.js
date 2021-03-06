import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import '@/plugin';
import "@/directives";
import '@/utils/prototype';
import "@/api";

// i-view组件库
import 'iview/dist/styles/iview.css';
import { DatePicker, TimePicker, Switch } from 'iview';
Vue.component('DatePicker', DatePicker);
Vue.component('TimePicker', TimePicker);
Vue.component('iSwitch', Switch);

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);

Vue.config.productionTip = false;

import "@/static/css/global.scss";
import "@/static/css/custom.scss";
import "@/static/css/reset.scss";
import "@/static/css/ck-content.css";

// 设置title
let company = localStorage.getItemObj("companyInfo");
document.title = company.companyName + "企业版";

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
