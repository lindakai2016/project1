<template>
    <div class="login" :style="{backgroundImage: `url(${companyBg})`}" @dragstart.prevent>
        <div class="loginBox">
            <div class="logo" v-if="company.customLogo">
                <img class="logoImg" :src="company.customLogo">
            </div>
            <p class="name" v-if="company.customName">{{company.customName}}</p>
            <p class="desc" v-if="company.customMsg">{{company.customMsg}}</p>
            <div class="loginForm">
                <ul class="tab">
                    <li class="tbi" :class="{active: loginType == 0}" @click="setLoginType(0)">短信登录</li>
                    <li class="tbi" :class="{active: loginType == 1}" @click="setLoginType(1)">密码登录</li>
                </ul>
                <keep-alive>
                    <component :is="loginTypeComponnet"></component>
                </keep-alive>
            </div>
        </div>
        <huoliLoginFooter></huoliLoginFooter>
    </div>
</template>

<script>
import smsLogin from "./loginType/smsLogin";
import passLogin from "./loginType/passLogin";
import huoliLoginFooter from "@/pages/huoli/loginFooter";

const defaultBg = require("../../static/images/login_bg.png");

export default {
    name: "login",
    components: {
        smsLogin,
        passLogin,
        huoliLoginFooter
    },
    data () {
        return {
            loginType: 0,   //0-短信，1-密码

            company: {},
        }
    },
    mounted() {
        this.company = localStorage.getItemObj("companyInfo");
    },
    computed: {
        loginTypeComponnet() {
            return {0: "smsLogin", 1: "passLogin"}[this.loginType];
        },
        companyBg() {
            return this.company.customLoginBg || defaultBg;
        },
    },
    methods: {
        setLoginType(n) {
            this.loginType = n;
        }
    }
}
</script>

<style lang="scss" scoped>
.login {
    height: 100vh;
    background: no-repeat 0 0;
    background-size: 100% 100%;
    position: relative;
    text-align: center;
    &:after {
        content: '';
        height: 100%;
        display: inline-block;
        vertical-align: middle;
    }
    .loginBox {
        width: 400px;
        display: inline-block;
        vertical-align: middle;
        margin-top: -36px;
        text-align: left;
        .logo {
            text-align: center;
            margin-bottom: 5px;
            .logoImg {
                width: 80px;
                height: 80px;
                border-radius: 50%;
            }
        }
        .name {
            font-weight: 600;
            color: #fff;
            font-size: 25px;
            text-align: center;
            letter-spacing: 1px;
            margin: 5px 0;
        }
        .desc {
            font-weight: 400;
            font-size: 15px;
            color: rgba(255, 255, 255, 0.8);
            text-align: center;
        }
        .loginForm {
            background: #fff;
            box-shadow: 0 3px 33px -10px #005ED3;
            border-radius: 5px;
            margin-top: 20px;
            padding: 33px;
            .tab {
                border-bottom: 1px solid #E5E5E5;
                display: flex;
                justify-content: space-between;
                padding: 0 29px;
                .tbi {
                    line-height: 23px;
                    font-size: 16px;
                    font-weight: 500;
                    color: #B2B2B2;
                    padding-bottom: 21px;
                    border-bottom: 2px solid transparent;
                    cursor: pointer;
                    
                    &:hover {
                        opacity: 0.8;
                    }
                    &.active {
                        border-bottom-color: #4780F7;
                        color: #4780F7;
                        opacity: 1;
                    }
                }
            }
        }
    }
}
</style>
