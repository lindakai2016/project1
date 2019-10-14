<template>
    <div class="mask" :class="{visible: visible}" @dragstart.prevent></div>
</template>

<script>
export default {
    data() {
        return {
            visible: 0,
        }
    },
    methods: {
        open() {
            this.visible = true;
        },
        close() {
            this.visible = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.mask {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    line-height: 100vh;
    text-align: center;
    background: transparent;
    display: none;
    z-index: 1000;
    &.visible {
        display: block;
    }
}
</style>
