import Vue from "vue";
import request from "./request";
import http from "./http";

let api = {};

http.map(item => {
    api[item.name] = params => request({ params, ...item });
});

Vue.prototype.$api = api;