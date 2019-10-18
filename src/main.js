import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import '@/plugin';
import "@/directives";
import '@/utils/prototype';
import "@/api";
import "@/utils/bus";

// v-charts图表
import VCharts from 'v-charts';
Vue.use(VCharts);

// i-view组件库
import 'iview/dist/styles/iview.css';
import { DatePicker, TimePicker, Switch } from 'iview';
Vue.component('DatePicker', DatePicker);
Vue.component('TimePicker', TimePicker);
Vue.component('iSwitch', Switch);

import "@/static/css/global.scss";
import "@/static/css/custom.scss";
import "@/static/css/reset.scss";

// vue-amap组件
import VueAMap from "vue-amap";
Vue.use(VueAMap);

VueAMap.initAMapApiLoader({
    key: 'eb4247050dc36657f7b899eafd47998e',
    plugin: [
        'AMap.PlaceSearch',
        'AMap.CitySearch',
        'AMap.Scale',
        'AMap.ToolBar',
        'AMap.Autocomplete',
        'AMap.Marker',
        'AMap.Circle',
        'AMap.Geolocation',

        'AMap.MapType',
        'AMap.PolyEditor',
        'AMap.CircleEditor',
        'AMap.OverView'
    ],
    uiVersion: '1.0.11',
});

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
}).$mount('#app');
