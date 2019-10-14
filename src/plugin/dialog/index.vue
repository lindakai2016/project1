<template>
    <basePopup v-model="visible" :closeOnClickout="false">
        <div class="dialog">
            <div class="title">{{titleExt}}</div>
            <i class="iconfont icon-icon_close_n link closeIc" @click="onCancel"></i>
            <div class="body">
                <i class="iconfont icon-icon_tips_audit bdIc"></i>
                {{msg}}
            </div>
            <div class="bottom">
                <button class="carBtn white dlgBtn" @click="onCancel">{{cancelText}}</button>
                <button class="carBtn blue dlgBtn" @click="onOk">{{okText}}</button>
            </div>
        </div>
    </basePopup>
</template>

<script>
import basePopup from "@/commonComponents/basePopup";

export default {
    components: {
        basePopup,
    },
    data() {
        return {
            visible: false,
            
            type: 1,
            title: "",
            okText: "确定",
            cancelText: "取消",
            msg: "提示文本",

            $_resolve: "",
            $_reject: "",
        }
    },
    computed: {
        titleExt() {
            return this.title || { 1: "提示", 2: "删除"}[this.type] || "提示";
        },
    },
    methods: {
        onOk() {
            this.visible = false;
            this.$_resolve("ok");
        },
        onCancel(){
            this.visible = false;
            this.$_resolve("cancel");
        },
        open({type, title, okText, cancelText, msg}) {
            return new Promise((resolve, reject)=>{
                this.type = type || 1;
                this.title = title;
                this.okText = okText || "确定";
                this.cancelText = cancelText || "取消";
                this.msg = msg || "提示文本";

                this.$_resolve = resolve;
                this.$_reject = reject;
                this.visible = true;
            });
        },
        alert(msg) {
            return this.open({type: 1, msg});
        },
        delete(msg) {
            return this.open({type: 2, msg});
        },
    }
}
</script>

<style lang="scss" scoped>
.dialog {
    background: #fff;
    width: 355px;
    padding: 13px;
    border-radius: 3px;
    position: relative;
    .title {
        height: 20px;
        line-height: 20px;
        font-size: 16px;
        color: #000;
        font-weight: 600;
    }
    .closeIc {
        position: absolute;
        top: 13px;
        right: 13px;
        color: #B2B2B2;
        font-size: 12px;
    }
    .body {
        min-height: 50px;
        font-size: 14px;
        color: #4A4A4A;
        padding: 10px 0 13px 0;
        line-height: 16px;
        .bdIc {
            font-size: 16px;
            color: #EDAC4A;
            margin-right: 4px;
        }
    }
    .bottom {
        text-align: right;
        .dlgBtn {
            margin-left: 10px;
            height: 25px;
            line-height: 23px;
            width: 50px;
            border-radius: 4px;
            font-size: 12px;
        }
    }
}
</style>
