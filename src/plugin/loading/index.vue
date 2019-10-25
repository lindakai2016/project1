<template>
    <div class="loading" :class="{visible: visible}" @dragstart.prevent>
        <img class="loadingImg" src="@/static/images/loading.gif"/>
    </div>
</template>

<script>
export default {
    name: "plugin-loading",
    data() {
        return {
            count: 0,
        }
    },
    computed: {
        visible() {
            return this.count > 0;
        }
    },
    methods: {
        open() {
            this.count ++;
            console.log("open")
        },
        close() {
            console.log("close");
            this.count --;
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
    background: rgba(255, 255, 255, 0);
    display: none;
    z-index: 1000;
    &.visible {
        display: block;
    }
    .loadingImg {
        
    }
}
</style>
