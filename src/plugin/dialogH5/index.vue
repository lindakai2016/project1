<template>
    <basePopup v-model="visible" :closeOnClickout="false" @touchmove.prevent.native>
        <div class="dialogH5">
            <div class="body">
                <span class="msg">{{msg}}</span>
            </div>
            <div class="bottom">
                <div class="dlgBtn cancelBtn" @click="onCancel">{{cancelText}}</div>
                <div class="dlgBtn okBtn" @click="onOk">{{okText}}</div>
            </div>
        </div>
    </basePopup>
</template>

<script>
import basePopup from "@/commonComponents/basePopup";

export default {
    name: "plugin-dialog",
    components: {
        basePopup,
    },
    data() {
        return {
            visible: false,
            
            okText: "确定",
            cancelText: "取消",
            msg: "提示文本",

            $_resolve: "",
            $_reject: "",
        }
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
        open({okText, cancelText, msg}) {
            return new Promise((resolve, reject)=>{
                this.okText = okText || "确定";
                this.cancelText = cancelText || "取消";
                this.msg = msg || "提示文本";

                this.$_resolve = resolve;
                this.$_reject = reject;
                this.visible = true;
            });
        },
        alert(msg, okText, cancelText) {
            return this.open({msg, okText, cancelText});
        },
    }
}
</script>

<style lang="scss" scoped>
.dialogH5 {
    background: #fff;
    width: 260px;
    border-radius: 2px;
    position: relative;
    .body {
        font-size: 14px;
        color: #333;
        padding: 25px 0;
        line-height: 20px;
        position: relative;
        text-align: center;
    }
    .bottom {
        display: flex;
        .dlgBtn {
            border-top: 1px solid #ddd;
            width: 50%;
            height: 48px;
            line-height: 48px;
            text-align: center;
            font-size: 16px;
            &.okBtn {
                color: #4780F7;
                border-left: 1px solid #ddd;
            }
            &.cancelBtn {
                color: #999;
            }
        }
    }
}
</style>
