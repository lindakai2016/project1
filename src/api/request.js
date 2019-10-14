import axios from 'axios';
import qs from 'qs';
import $router from '@/router';
import Vue from "vue";
const crypto = require('crypto');

let vue = new Vue();

const ajax = axios.create({
    baseURL: process.env.VUE_APP_API_BASE,
    timeout: 20000,
    headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

ajax.defaults.paramsSerializer = function(params) {
    return qs.stringify(params);
};

let app_id = "e65a71565b634e3f9d6251084a03493c";
let app_secret_key = "UDZ4N3lFSVluTnJsLjVTSHo0RDY1VS5wSFlYOEUx";
let platform = "web";

// 处理请求
function dealRequest(config) {
    let time = new Date().getTime() + "";
    let signParams = {
        app_id:             app_id,
        app_secret_key:     app_secret_key,
        time:               time,
    }
    let sign = crypto.createHash('md5').update(JSON.stringify(signParams), 'utf-8').digest('hex');
    let commonParams = {
        app_id:     app_id,
        time:       time,
        sign:       sign,
        platform:   platform,
    }
    config.params = {...commonParams, ...config.params};

    if(config.auth) {
        let {token} = localStorage.getItemObj("loginInfo") || {};
        if(!token) {
            $router.push("/login");
            return false;
        }
        config.params.token = token;
    }

    config.loading && vue.$loading.open();
    config.mask && vue.$mask.open();
    return true;
}

// 处理响应
function dealResponse(config, response) {
    config.loading && vue.$loading.close();
    config.mask && vue.$mask.close();

    let res = response && response.data || {};
    if(res.code == "100406") {
        vue.$message.warning(res.message || "登录已失效，请重新登录");
        $router.push("/login");
        throw 0;
    }
    return res;
}

// 处理响应错误
function dealResponseErr(config, err) {
    config.loading && vue.$loading.close();
    config.mask && vue.$mask.close();
    vue.$message.failed(err);
}

export default function(config) {
    if(!dealRequest(config)) {
        return Promise.reject(0);
    }
    return ajax(config).then(response => {
        return dealResponse(config, response);
    }).catch(err => {
        dealResponseErr(config, err);
        throw err;
    });
}
