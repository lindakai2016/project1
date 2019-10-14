<template>
    <div class="newAccount">
        <h3 class="head">账号详情</h3>
        <i class="iconfont icon-icon_close_n link closeIcon" @click="exit"></i>
        <div class="form">
            <div class="li">
                <label class="lb">员工姓名</label>
                <span class="val">{{item.name || "--"}}</span>
            </div>
            <div class="li">
                <label class="lb">员工手机号</label>
                <span class="val">{{item.phone || "--"}}</span>
            </div>
            <div class="li">
                <label class="lb">备注</label>
                <span class="val">{{item.remark || "无"}}</span>
            </div>
            <div class="li">
                <label class="lb">账号状态</label>
                <span>{{item.statusStr}}</span>
            </div>
        </div>
        <button class="carBtn blue okBtn" @click="exit">我知道了</button>
        
    </div>
</template>

<script>
export default {
    props: ["acItem"],
    computed: {
        item() {
            let item = this.acItem || {};
            item.statusStr = {0: "停用", 1: "正常"}[item.status] || "--"
            return item;
        }
    },
    methods: {
        exit() {
            this.$emit("exit");
        },
       
    }
}
</script>

<style lang="scss" scoped>
.newAccount {
    max-height: calc(100vh - 30px);
    overflow: auto;
    width: 670px;
    border-radius: 5px;
    padding: 25px 25px 33px 25px;
    position: relative;
    background: #fff url(../../../../static/images/img_bg_account_details.png) no-repeat;
    background-size: 100% 100%;
    .head {
        text-align: center;
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        color: #2C3642;
        margin-bottom: 22px;
    }
    .closeIcon {
        position: absolute;
        top: 19px;
        right: 19px;
        color: #B2B2B2;
        font-size: 14px;
    }
    .form {
        &::after {
            content: "";
            display: block;
            clear: both;
            height: 0;
        }
        .li {
            padding-left: 60px;
            width: calc(50% - 10px);
            float: left;
            font-size: 13px;
            font-weight: 400;
            line-height: 17px;
            margin-top: 23px;
            .lb {
                color: rgba(74,74,74,0.5);
                display: inline-block;
                width: 100px;
            }
            .val {
                color: #2C3642;
            }
        }
    }
    .okBtn {
        margin: 60px auto 0 auto;
        display: block;
        width: 333px;
        height: 40px;
        line-height: 38px;
        font-size: 14px;
    }

}
</style>
