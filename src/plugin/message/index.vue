<template>
    <div class="message" :class="{fadeIn: fadeInC, fadeOut: fadeOutC, show: show}">
        <i class="iconfont icon-setpassword_icon_correct success" v-if="isSuccess"></i>
        <i class="iconfont icon-icon_cancelorder failed" v-if="isFailed"></i>
        <i class="iconfont icon-Popup_icon_tips warning" v-if="isWarning"></i>
        <div class="msgText">{{msg}}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            fadeInC: false,
            fadeOutC: false,
            fadeInTimer: null,
            fadeOutTimer: null,
            
            type: 1,        //1-成功，2-失败，3-警告
            msg: "提示文本",
        }
    },
    computed: {
        isSuccess() {
            return this.type == 1;
        },
        isFailed() {
            return this.type == 2;
        },
        isWarning() {
            return this.type == 3;
        },
    },
    methods: {
        fadeIn(type, msg) {
            if(this.fadeInTimer || this.fadeOutTimer) {
                return;
            }
            this.type = type;
            this.msg = msg;

            this.show = true;
            this.fadeInC = true;
            this.fadeOutC = false;
            this.fadeInTimer = setTimeout(() => {
                this.fadeInTimer = 0;
                this.fadeOut();
            }, 2000);
        },
        fadeOut() {
            this.fadeInC = false;
            this.fadeOutC = true;
            this.fadeOutTimer = setTimeout(() => {
                this.show = false;
                this.fadeOutC = false;
                this.fadeOutTimer = 0;
            }, 300);
        },
        success(msg) {
            this.fadeIn(1, msg);
        },
        failed(msg) {
            this.fadeIn(2, msg);
        },
        warning(msg) {
            this.fadeIn(3, msg);
        }
    }
}
</script>

<style lang="scss" scoped>
.message {
    background: #fff;
    width: 220px;
    min-height: 45px;
    padding: 8px 14px;
    box-shadow: 0px 2px 61px 0px rgba(129,129,129,0.25);
    border-radius: 3px;
    display: flex;
    align-items: center;
    position: fixed;
    left: 1000%;
    margin-left: -110px;
    top: calc(99px - 20px);
    opacity: 0;
    transition: top 0.3s, opacity 0.3s;
    z-index: 1000;
    &.fadeIn {
        top: 99px;
        opacity: 1;
    }
    &.fadeOut {
        top: calc(99px - 20px);
        opacity: 0;
    }
    &.show {
        left: 50%;
    }
    .iconfont {
        font-size: 16px;
        margin-right: 12px;
        &.success {
            color: #6FC643;
        }
        &.failed {
            color: #F85C5C;
        }
        &.warning {
            color: #6FC643;
        }
    }
    .msgText {
        font-size: 14px;
        font-weight: 400;
        color: #000;
    }
}
</style>
