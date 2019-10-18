<template>
    <!--短信登录-->
    <div class="loginXXX bySms">
        <div class="errInfo" :class="{show: phoneErr}">
            <i class="iconfont icon-login_icon_error1"></i>
            {{phoneErr}}
        </div>
        <div class="phoneInput">
            <inputGr class="phone" :class="{err: phoneErr}" placeholder="请输入手机号码" v-model="phone" @blur="checkPhone(1)" clear="1"></inputGr>
        </div>
        <div class="codeInput">
            <inputGr class="inputGr" placeholder="请输入验证码" v-model="code"></inputGr>
            <a class="carBtn white codeBtn" :class="{gray: !canSendCode}" @click="sendCode">{{codeCountStr}}</a>
        </div>
        <button class="carBtn blue loginBtn" :class="{gray: !canLogin}" @click="smsLogin">登录</button>
    </div>
</template>

<script>
import inputGr from "../inheritComponent/Input";
import _ from "lodash";

export default {
    components: {
        inputGr
    },
    data () {
        return {
            phone: "",
            phoneErr: "",

            code: "",
            codeCount: 0,
            codeCountTimer: null,
        }
    },
    computed: {
        canSendCode() {
            return this.codeCount <= 0 && this.phone && this.phone.validPhone();
        },
        codeCountStr() {
            return this.codeCount > 0 ? `重新获取${this.codeCount}秒`: `获取验证码`;
        },
        canLogin() {
            return this.phone && this.phone.validPhone() && this.code;
        }
    },
    watch: {
        phone() {
            this.checkPhone();
            this.phone && this.phone.length >= 11 && this.checkPhone(1);
        }
    },
    methods: {
        startCodeCount(n) {
            if(n < 0) {
                return;
            }
            this.codeCount = n;
            clearTimeout(this.codeCountTimer);
            this.codeCountTimer = setTimeout(() => {
                this.startCodeCount(n - 1);
            }, 1000);
        },
        checkPhone(b) {
            if(!this.phone) {
                return;
            }
            if(!this.phone.validPhone()) {
                b && (this.phoneErr = "手机号码不正确");
                return;
            }
            this.phoneErr = "";
        },
        // 发送验证码
        sendCode: _.debounce(function() {
            if(!this.canSendCode) {
                return;
            }
            let {phone} = this;
            this.$api["phoneCode"]({
                phone,
                type: 1
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.startCodeCount(60);
            }).catch(err => err);
        }, 300),
        // 手机号登录
        smsLogin: _.debounce(function() {
            if(!this.canLogin) {
                return;
            }
            let {phone, code} = this;
            this.$api["phoneLogin"]({
                phone,
                code,
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                let loginInfo = res.data || {};
                loginInfo.loginDate = new Date();
                localStorage.setItemObj("loginInfo", loginInfo);

                this.$router.push("/home");
            }).catch(err => err);
        }, 300),
    }
}
</script>

<style lang="scss" scoped>
@import "../scss/loginXXX.scss";
.bySms {
    .errInfo {
        margin-top: 21px;
    }
    .phoneInput {
        margin-top: 12px;
    }
    .codeInput {
        margin-top: 24px;
    }
    .loginBtn {
        margin-top: 50px;
    }
}
</style>
