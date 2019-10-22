<template>
    <div class="basePopup" :class="{fade: fade, show: show}">
        <div class="mask" @click="close"></div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visible: {type: Boolean, default: false},
        closeOnClickout: {type: Boolean, default: true}
    },
    model: {
        prop: "visible",
        event: "setVisible",
    },
    data() {
        return {
            fade: false,
            show: false,
            fadeOutTimer: null,
        }
    },
    watch: {
        visible: {
            immediate: true,
            handler(val) {
                val ? this.fadeIn() : this.fadeOut();
            }
        }
    },
    destoryed() {
        clearTimeout(this.fadeOutTimer);
        this.fadeOutTimer = null;
    },
    methods: {
        fadeIn() {
            this.fade = true;
            this.show = true;
            clearTimeout(this.fadeOutTimer);
            this.disableBodyScroll(true);
        },
        fadeOut() {
            this.fade = false;
            clearTimeout(this.fadeOutTimer);
            this.fadeOutTimer = setTimeout(() => {
                this.show = false;
            }, 300);
            this.disableBodyScroll(false);
        },
        close() {
            this.closeOnClickout && this.$emit("setVisible", false);
        },
        disableBodyScroll(bool) {
            if(bool) {
                document.body.style.setProperty("overflow", "hidden");
                return;
            }
            document.body.style.removeProperty("overflow");
        }
    }
}
</script>

<style lang="scss" scoped>
.basePopup {
    position: fixed;
    left: 1000%;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s;
    text-align: center;
    &:after {
        display: inline-block;
        content: "";
        height: 100%;
        vertical-align: middle;
    }
    &.fade {
        opacity: 1;
        .content {
            margin-top: 0;
            opacity: 1;
        }
    }
    &.show {
        left: 0;
    }
    .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
    }
    .content{
        position: relative;
        display: inline-block;
        vertical-align: middle;
        text-align: left;
        margin-top: -50px;
        opacity: 0;
        transition: all 0.2s;
    }
}
</style>
