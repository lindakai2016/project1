<template>
    <!--设置密码-->
    <div class="loginXXX modifyPass">
        <h3 class="head">{{pwdTypeStr}}</h3>
        <i class="iconfont icon-icon_close_n link closeIcon" @click="exit"></i>
        <div class="errInfo" :class="{show: formErr}">
            <i class="iconfont icon-login_icon_error1"></i>{{formErr}}
        </div>
        <div class="phoneInput">
            <inputGr class="phone" :class="{err: phoneErr}" placeholder="请输入手机号码" v-model="phone" clear="1" @blur="checkPhone(1)"></inputGr>
        </div>
        <div class="codeInput">
            <inputGr class="inputGr" placeholder="请输入验证码" v-model="code"></inputGr>
            <button class="carBtn white codeBtn" :class="{gray: !canSendCode}" @click="sendCode">{{codeCountStr}}</button>
        </div>
        <div class="passInput">
            <passInput class="pass" :class="{err: passErr}" placeholder="请设置您的新密码" v-model="password" @blur="checkPass(1)"></passInput>
        </div>
        <div class="passInput">
            <passInput class="pass" :class="{err: passRErr}" placeholder="请确认您的新密码" v-model="passwordR" @blur="checkPassR(1)"></passInput>
        </div>
        <button class="carBtn blue loginBtn" :class="{gray: !canSubmit}" @click="resetPass">确认</button>
    </div>
</template>

<script>
import inputGr from "../inheritComponent/Input";
import passInput from "../inheritComponent/passInput";
import _ from "lodash";

export default {
    name: "modifyPass",
    props: ["forget", "pwdType"],     //0-设置密码，1-重置密码
    components: {
        inputGr,
        passInput,
    },
    inject: ["passLogin"],
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
            if(this.forget) {
                return "重置密码";
            }
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
    watch: {
        phone() {
            this.checkPhone();
            this.phone && this.phone.length >= 11 && this.checkPhone(1);
        },
        password() {
            this.checkPass();
            this.password && this.password.length >= 6 && this.checkPass(1);
        },
        passwordR() {
            this.checkPassR();
        },
    },
    destoryed() {
        clearTimeout(this.codeCountTimer);
        this.codeCountTimer = null;
    },
    methods: {
        exit() {
            this.$emit("exit");
        },
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
        checkPass(b) {
            if(!this.password) {
                return;
            }
            if(!this.password.validPass()) {
                b && (this.passErr = "密码由数字、英文和下划线组成，长度6-20");
                return;
            }
            this.passErr = "";
            this.checkPassR(b);
        },
        checkPassR(b) {
            if(!this.passwordR) {
                return;
            }
            if(this.password !== this.passwordR) {
                b && (this.passRErr = "密码输入不一致");
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
                this.startCodeCount(60);
            }).catch(err => err);
        }, 300),
        // 忘记密码
        resetPass: _.debounce(function() {
            if(!this.canSubmit) {
                return;
            }
            let {phone, code, password} = this;
            this.$api["resetPass"]({
                phone,
                password:   btoa(password),
                code,
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.$message.success("密码设置成功");
                this.exit();

                if(this.forget) {
                    this.passLogin({account: phone, password: btoa(password)});
                    return;
                }
                let data = res.data || {};
                let loginInfo = localStorage.getItemObj("loginInfo");
                loginInfo = {...loginInfo, ...data};
                localStorage.setItemObj(loginInfo);
            }).catch(err => err);
        }, 300),
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
