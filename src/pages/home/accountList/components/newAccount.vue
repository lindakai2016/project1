<template>
    <div class="newAccount">
        <h3 class="head">{{hTitle}}</h3>
        <i class="iconfont icon-icon_close_n link closeIcon" @click="exit"></i>
        <div class="form">
            <div class="errInfo" :class="{show: formErr}">
                <i class="iconfont icon-login_icon_error1"></i>{{formErr}}
            </div>
            <div class="li">
                <label class="lb">*员工姓名</label>
                <inputGr class="input" :class="{err: errParam == 'name'}" placeholder="请输入员工姓名" v-model="name" @blur="nameBlur"></inputGr>
            </div>
            <div class="li">
                <label class="lb">*员工手机号</label>
                <inputGr class="input" :class="{err: errParam == 'phone'}" placeholder="请输入员工手机号" v-model="phone" @blur="phoneBlur"></inputGr>
                <span class="suffix">手机号将作为登录账号使用</span>
            </div>
            <div class="li">
                <label class="lb">备注</label>
                <inputGr class="input" placeholder="请输入备注信息" v-model="remark"></inputGr>
            </div>
            <div class="li">
                <label class="lb">账号状态</label>
                <iSwitch class="switch" v-model="status"></iSwitch>
                <span class="lb_st">正常</span>
            </div>
        </div>
        <button class="carBtn blue okBtn" :class="{gray: !canSubmit}" @click="clickOk">确定</button>
    </div>
</template>

<script>
import inputGr from "../inheritComponent/Input";
import _ from "lodash";

export default {
    props: ["acItem", "type"],
    components: {
        inputGr,
    },
    data () {
        return {
            name: "",
            phone: "",
            remark: "",
            status: true,

            formErr: "",
            errParam: "",
        }
    },
    computed: {
        hTitle() {
            return {0: "新建账号", 1: "编辑账号"}[this.type] || "新建账号";
        },
        canSubmit() {
            return this.checkParam();
        }
    },
    watch: {
        acItem: {
            immediate: true,
            handler: function(val) {
                if(val) {
                    let {name, phone, remark, status} = val;
                    this.name = name;
                    this.phone = phone;
                    this.remark = remark;
                    this.status = !!status;
                }
            }
        }
    },
    methods: {
        exit() {
            this.$emit("exit");
        },
        resetData() {
            this.name = "";
            this.phone = "";
            this.remark = "";
            this.status = true;
        },
        nameBlur() {
            if(!this.name) {
                return;
            }
            if(!this.name.validName()) {
                this.nameErr = "姓名为中文字符，长度2-4";
                return;
            }
            this.nameErr = "";
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
        checkParam() {
            if(!this.name) {
                this.formErr = "姓名不能为空";
                this.errParam = "name";
                return false;
            }
            if(!this.name.validName()) {
                this.formErr = "姓名为中文字符，长度2-4";
                this.errParam = "name";
                return false;
            }
            if(!this.phone) {
                this.formErr = "手机号码不能为空";
                this.errParam = "phone";
                return false;
            }
            if(!this.phone.validPhone()) {
                this.formErr = "手机号码不正确";
                this.errParam = "phone";
                return false;
            }
            this.formErr = "";
            this.errParam = "";
            return true;
        },
        clickOk() {
            if(!this.canSubmit) {
                return;
            }
            this.type == 0 && this.newAc();
            this.type == 1 && this.updateAc();
        },
        newAc: _.debounce(function() {
            let {name, phone, remark, status} = this;
            status = +status;
            this.$api["accountAdd"]({
                name,
                phone,
                remark,
                status,
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.$message.success("添加成功");
                this.$emit("submitOk");
                this.resetData();
            }).catch(err => err);
        }, 300),
        updateAc: _.debounce(function() {
            let {name, phone, remark, status} = this;
            let userId = this.acItem && this.acItem.userId;
            status = +status;
            this.$api["accountEdit"]({
                user_id:    userId,
                name,
                phone,
                remark,
                status,
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.$message.success("修改成功");
                this.$emit("submitOk");
            }).catch(err => err);
        }, 300),
    }
}
</script>

<style lang="scss" scoped>
.newAccount {
    max-height: calc(100vh - 30px);
    overflow: auto;
    width: 670px;
    border-radius: 5px;
    padding: 25px 25px 40px 25px;
    position: relative;
    background: #fff url(../../../../static/images/img_bg_new_account.png) no-repeat;
    background-size: 100% 100%;
    .head {
        text-align: center;
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        color: #2C3642;
        margin-bottom: 32px;
    }
    .closeIcon {
        position: absolute;
        top: 19px;
        right: 19px;
        color: #B2B2B2;
        font-size: 14px;
    }
    .form {
        .errInfo {
            color: #F85C5C;
            font-size: 12px;
            line-height: 14px;
            display: flex;
            align-items: center;
            visibility: hidden;
            padding-left: 170px;
            margin: -16px 0 -10px 0;
            height: 16px;
            &.show {
                visibility: visible;
            }
            .iconfont {
                margin-right: 7px;
                font-size: 14px;
            }
        }
        .li {
            display: flex;
            align-items: center;
            height: 35px;
            margin-top: 19px;
            color: #888;
            font-size: 13px;
            font-weight: 400;
            padding-left: 70px;
            .lb {
                width: 100px;
                display: inline-block;
            }
            .input {
                height: 35px;
                line-height: 33px;
                width: 250px;
                &.err {
                    border-color: #F85C5C;
                }
            }
            .suffix {
                margin-left: 8px;
            }
            .switch {
                
            }
            .lb_st {
                margin-left: 8px;
            }
        }
    }
    .okBtn {
        width: 333px;
        height: 40px;
        line-height: 38px;
        display: block;
        margin: 30px auto 0 auto;
        font-size: 14px;
        clear: both;
    }
}
</style>
