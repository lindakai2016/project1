<template>
    <!--设置密码-->
    <div class="loginXXX modifyPass">
        <h3 class="head">{{pwdTypeStr}}</h3>
        <i class="iconfont icon-icon_close_n link closeIcon" @click="exit"></i>
        <div class="errInfo" :class="{show: formErr}">
            <i class="iconfont icon-login_icon_error1"></i>{{formErr}}
        </div>
        <div class="phoneInput">
            <inputGr class="phone" :class="{err: phoneErr}" type="text" placeholder="请输入手机号码" v-model="phone" clear="1" @blur="phoneBlur"></inputGr>
        </div>
        <div class="codeInput">
            <inputGr class="inputGr" type="text" placeholder="请输入验证码" v-model="code"></inputGr>
            <button class="carBtn white codeBtn" :class="{gray: !canSendCode}" @click="sendCode">{{codeCountStr}}</button>
        </div>
        <div class="passInput">
            <inputGr class="pass" :class="{err: passErr}" type="password" placeholder="请设置您的新密码" v-model="password" @blur="passBlur"></inputGr>
        </div>
        <div class="passInput">
            <inputGr class="pass" :class="{err: passRErr}" type="password" placeholder="请确认您的新密码" v-model="passwordR" @blur="passRBlur"></inputGr>
        </div>
        <button class="carBtn blue loginBtn" :class="{gray: !canSubmit}" @click="resetPass">重置密码</button>
    </div>
</template>

<script>
import inputGr from "../inheritComponent/Input";
import _ from "lodash";

export default {
    props: ["pwdType"],     //0-设置密码，1-重置密码
    components: {
        inputGr
    },
    data () {
        return {
            phone: "",
            phoneErr: "",

            password: "",
            passErr: "",

            passwordR: "",
            passRErr: "",

            code: "",
            codeCount: 0,
            codeCountTimer: null,
        }
    },
    computed: {
        pwdTypeStr() {
            return {0: "设置密码", 1: "重置密码"}[this.pwdType] || "重置密码";
        },
        formErr() {
            return this.phoneErr || this.passErr || this.passRErr || "";
        },
        canSendCode() {
            return this.codeCount <= 0 && this.phone && this.phone.validPhone();
        },
        codeCountStr() {
            return this.codeCount > 0 ? `重新获取${this.codeCount}秒`: `获取验证码`;
        },
        canSubmit() {
            return this.phone && this.phone.validPhone() && this.password && this.password.validPass() && this.passwordR === this.password && this.code;
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
            this.passRBlur();
        },
        passRBlur() {
            if(!this.passwordR) {
                return;
            }
            if(this.password !== this.passwordR) {
                this.passRErr = "密码输入不一致";
                return;
            }
            this.passRErr = "";
        },
        // 发送验证码
        sendCode: _.debounce(function() {
            if(!this.canSendCode) {
                return;
            }
            let {phone} = this;
            this.$api["phoneCode"]({
                phone,
                type: 2
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.startCodeCount(5 * 60);
            }).catch(err => err);
        }, 300),
        // 重置密码
        resetPass: _.debounce(function() {
            if(!this.canSubmit) {
                return;
            }
            let {phone, code, password} = this;
            this.$api["phoneLogin"]({
                phone,
                password:   btoa(password),
                code,
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.$message.success("修改成功");
                this.exit();
            }).catch(err => err);
        }, 300),
        exit() {
            this.$emit("exit");
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../scss/loginXXX.scss";
.modifyPass {
    background: #fff;
    width: 400px;
    padding: 33px 33px 40px 33px;
    background: #fff;
    box-shadow: 0px 3px 33px -10px #005ED3;
    border-radius: 5px;
    position: relative;
    .head {
        text-align: center;
        font-size: 17px;
        font-weight: 500px;
        line-height: 23px;
        color: #000;
    }
    .closeIcon {
        position: absolute;
        top: 19px;
        right: 19px;
        color: #B2B2B2;
        font-size: 14px;
    }
    .errInfo {
        margin-top: 18px;
    }
    .phoneInput {
        margin-top: 12px;
    }
    .codeInput {
        margin-top: 20px;
    }
    .passInput {
        margin-top: 20px;
    }
    .loginBtn {
        margin-top: 49px;
    }
}
</style>
