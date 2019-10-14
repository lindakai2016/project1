<template>
    <div class="option" :class="{active: active}" @click="clickItem">{{label}}</div>
</template>

<script>

export default {
    props: ["label", "value", "selected"],
    inject: ["selectGr"],
    data() {
        return {
            active: this.selected,
        }
    },
    created() {
        this.selectGr.options.push(this);
    },
    methods: {
        clickItem() {
            this.selectGr.clickOption(this);
        }
    }
}
</script>

<style lang="scss" scoped>
.option {  
    width: 100px;
    text-align: center;
    line-height: 30px;
    font-size: 13px;
    color: #888;
    margin: 2px 0;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
        background: #F9F9FC;
    }
    &.active {
        color: #4780F7;
        background: #F9F9FC;
    }  
}
</style>
