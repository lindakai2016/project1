<template>
    <div class="progressGr">
        <div class="percent" :style="{width: width, background: color}"></div>
    </div>
</template>

<script>

export default {
    name: "baseProgress",
    props: ["step", "color"],
    computed: {
        width() {
            return `${this.step * 100}%`;
        }
    }
}
</script>

<style lang="scss" scoped>
.progressGr {
    width: 180px;
    height: 5px;
    border-radius: 3px;
    background: #F9F9FC;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    .percent {
        background: #4780F7;
        height: 100%;
        width: 50%;
        border-radius: 3px;
    }
}
</style>
