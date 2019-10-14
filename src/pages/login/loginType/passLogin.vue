<template>
    <!--密码登录-->
    <div class="loginXXX byPass">
        <div class="errInfo" :class="{show: formErr}">
            <i class="iconfont icon-login_icon_error1"></i>{{formErr}}
        </div>
        <div class="phoneInput">
            <inputGr class="phone" :class="{err: phoneErr}" type="text" placeholder="请输入手机号码" v-model="phone" clear="1" @blur="phoneBlur"></inputGr>
        </div>
        <div class="passInput">
            <inputGr class="pass" :class="{err: passErr}" type="password" placeholder="请输入密码" v-model="password" @blur="passBlur"></inputGr>
        </div>
        <p class="toForget">
            <span class="link" @click="openFgDlg">忘记密码</span>
        </p>
        <button class="carBtn blue loginBtn" :class="{gray: !canLogin}" @click="passLogin">登录</button>
        <!--忘记密码-->
        <basePopup v-model="showFgDlg">
            <forgetPass @exit="closeFgDlg"></forgetPass>
        </basePopup>
    </div>
</template>

<script>
import forgetPass from "../components/modifyPass";
import basePopup from "@/commonComponents/basePopup";
import inputGr from "../inheritComponent/Input";
import _ from "lodash";

export default {
    components: {
        basePopup,
        forgetPass,
        inputGr,
    },
    data () {
        return {
            phone: "",
            phoneErr: "",

            password: "",
            passErr: "",

            showFgDlg: false,
        }
    },
    computed: {
        formErr() {
            return this.phoneErr || this.passErr || "";
        },
        canLogin() {
            return this.phone && this.phone.validPhone() && this.password && this.password.validPass();
        }
    },
    methods: {
        phoneBlur() {
            if(!this.phone) {
                return;
            }
            if(!this.phone.validPhone()) {
                this.phoneErr = "手机号码不正确";
                return;
            }
            this.phoneErr = "";
        },
        passBlur() {
            if(!this.password) {
                return;
            }
            if(!this.password.validPass()) {
                this.passErr = "密码由数字、英文和下划线组成，长度6-20";
                return;
            }
            this.passErr = "";
        },
        // 密码登录
        passLogin: _.debounce(function() {
            if(!this.canLogin) {
                return;
            }
            let {phone, password} = this;
            this.$api["passLogin"]({
                account:    phone,
                password:   btoa(password),
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
        openFgDlg () {
            this.showFgDlg = true;
        },
        closeFgDlg() {
            this.showFgDlg = false;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../scss/loginXXX.scss";
.byPass {
    .errInfo {
        margin-top: 21px;
    }
    .phoneInput {
        margin-top: 12px;
    }
    .passInput {
        margin-top: 24px;
    }
    .toForget {
        color: #888;
        font-size: 13px;
        line-height: 18px;
        margin-top: 14px;
        text-align: right;
        .link {
            cursor: pointer;
            &:hover {
                opacity: 0.8;
            }
        }
    }
    .loginBtn {
        margin-top: 18px;
    }
}
</style>
