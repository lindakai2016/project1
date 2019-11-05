<template>
    <div class="home">
        <div class="navBarWrap">
            <div class="navbar normalW">
                <div class="company">{{loginInfo.customerName || "--"}}</div>
                <div class="navMenu">
                    <router-link to="/home" tag="span" class="navMi" active-class="active">首页</router-link>
                    <router-link to="/order" tag="span" class="navMi" active-class="active">订单</router-link>
                    <router-link to="/book" tag="span" class="navMi" active-class="active">订车</router-link>
                    <router-link to="/account" tag="span" class="navMi" active-class="active" v-if="isRoot">账号管理</router-link>
                    <router-link to="/quote" tag="span" class="navMi" :class="{dot: offerMsg}" active-class="active">报价</router-link>
                </div>
                <div class="user" v-if="isLogin">
                    <div class="uh">
                        <p class="name">{{loginInfo.name || "--"}}</p>
                        <i class="iconfont icon-home_icon_s"></i>
                    </div>
                    <ul class="uMenu">
                        <li class="umi" @click="openMfDlg">{{mfItemStr}}</li>
                        <li class="umi" @click="logout">退出</li>
                    </ul>
                </div>
                <router-link to="/login" tag="div" class="loginLink" v-if="!isLogin">登录</router-link>
            </div>
        </div>
        <div class="page normalW">
            <router-view></router-view>
        </div>
        <!--设置密码-->
        <basePopup v-model="showMfDlg">
            <modifyPass @exit="closeMfDlg" :pwdType="loginInfo.pwdType" :key="+showMfDlg"></modifyPass>
        </basePopup>
        <!--footer-->
        <huoliHomeFooter></huoliHomeFooter>
    </div>
</template>

<script>
import basePopup from "@/commonComponents/basePopup";
import modifyPass from "@/pages/login/components/modifyPass";
import huoliHomeFooter from "@/pages/huoli/homeFooter";
import _ from "lodash";

export default {
    name: "orderList",
    components: {
        basePopup,
        modifyPass,
        huoliHomeFooter,
    },
    provide () {
        return {
            passLogin: () => {},
        }
    },
    data () {
        return {
            showMfDlg: false,

            loginInfo: {},
            companyInfo: {},

            pollingTimer: null,
            offerMsg: 0,
        }
    },
    computed: {
        mfItemStr() {
            return {0: "设置密码", 1: "重置密码"}[this.loginInfo.pwdType] || "设置密码";
        },
        isRoot() {
            return this.loginInfo.mgrType == 1;
        },
        isLogin() {
            return this.loginInfo.token;
        }
    },
    mounted() {
        this.loginInfo = localStorage.getItemObj("loginInfo");
        this.companyInfo = localStorage.getItemObj("companyInfo");
        this.getMsg();
        this.startPollingMsg();
    },
    beforeDestroy() {
        this.endPollingMsg();
    },
    methods: {
        openMfDlg() {
            this.showMfDlg = true;
        },
        closeMfDlg() {
            this.showMfDlg = false;
        },
        // 退出登录
        logout: _.debounce(function() {
            this.$api["logout"]({}).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                localStorage.removeItem("loginInfo");
                this.$router.push("/login");
            }).catch(err => err);
        }, 300),
        // 消息轮询
        startPollingMsg() {
            clearInterval(this.pollingTimer);
            this.pollingTimer = setInterval(() => {
                this.getMsg();
            }, 1000 * 60);
        },
        endPollingMsg() {
            clearInterval(this.pollingTimer);
            this.pollingTimer = null;
        },
        getMsg() {
            this.$api["msg"]({}).then(res => {
                if(res.code != 100200) {
                    return;
                }
                this.offerMsg = res.data && res.data.offerMsg;
            }).catch(err => err);
        }
    }
}
</script>

<style lang="scss" scoped>
.home {
    min-height: 100vh;
    background: #F9F9FC;
    min-width: 1000px;
    padding-bottom: 80px;
    .normalW {
        width: 80%;
        margin: 0 auto;
        max-width: 1600px;
        min-width: 1000px;
    }
    .navBarWrap {
        height: 58px;
        background: #fff;
        .navbar {
            height: 100%;
            display: flex;
            align-items: center;
            user-select: none;
            .company {
                font-size: 20px;
                font-weight: 600;
            }
            .navMenu {
                flex-grow: 1;
                text-align: right;
                white-space: nowrap;
                .navMi {
                    display: inline-block;
                    text-align: center;
                    margin-left: 50px;
                    width: 64px;
                    line-height: 55px;
                    font-size: 16px;
                    color: #888;
                    border-bottom: 3px solid transparent;
                    cursor: pointer;
                    transition: color 0.3s;
                    &:first-of-type {
                        margin-left: 0;
                    }
                    &.active {
                        border-bottom-color: #4780F7;
                        color: #000;
                        &::after {
                            display: none;
                        }
                    }
                    &:hover {
                        color: #000;
                    }
                    &.dot{
                        position: relative;
                        &::after {
                            content: "";
                            position: absolute;
                            right: 8px;
                            top: 15px;
                            width: 6px;
                            height: 6px;
                            background: #F85C5C;
                            border-radius: 100%;
                        }
                    }
                }
            }
            .loginLink {
                margin-left: 100px;
                text-align: center;
                cursor: pointer;
                color: #4780F7;
                font-size: 16px;
            }
            .user {
                margin-left: 100px;
                position: relative;
                width: 100px;
                line-height: 58px;
                text-align: center;
                cursor: pointer;
                &:hover {
                    .iconfont {
                        transform: none;
                    }
                    .uMenu {
                        display: block;
                    }
                }
                .name {
                    display: inline-block;
                    font-size: 14px;
                    color: #000;
                }
                .iconfont {
                    font-size: 12px;
                    color: #d8d8d8;
                    display: inline-block;
                    transform: rotate(180deg);
                }
                .uMenu {
                    display: none;
                    background: #fff;
                    box-shadow: 0px 2px 8px 0px #d7d7d7;
                    border-radius: 3px;
                    width: 100%;
                    position: absolute;
                    top: 100%;
                    z-index: 1000;
                    .umi {
                        line-height: 30px;
                        font-size: 14px;
                        color: #888;
                        margin: 6px 0;
                        transition: all 0.3s;
                        &:hover {
                            color: #4780F7;
                            background: #F9F9FC;
                        }
                    }
                }
            }
        }
    }
}
</style>
