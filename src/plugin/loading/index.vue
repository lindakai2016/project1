<template>
    <div class="loading" :class="{visible: visible}" @dragstart.prevent>
        <img class="loadingImg" src="@/static/images/loading.gif"/>
    </div>
</template>

<script>
export default {
    data() {
        return {
            visible: 0,
            timer: null,
        }
    },
    methods: {
        open() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.visible = true;
            }, 500);
        },
        close() {
            clearTimeout(this.timer);
            this.visible = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.loading {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    line-height: 100vh;
    text-align: center;
    background: rgba(255, 255, 255, 0.45);
    display: none;
    z-index: 1000;
    &.visible {
        display: block;
    }
    .loadingImg {
        
    }
}
</style>
