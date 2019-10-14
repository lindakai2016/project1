<template>
    <div class="inputSrch">
        <input class="input" type="text" :placeholder="placeholder" :value="value" @input="input">
        <i class="iconfont icon-icon_search link" @click="clickSearch"></i>
    </div>
</template>

<script>

export default {
    props: ["placeholder", "value"],
    model: {
        prop: "value",
        event: "inputValue",
    },
    methods: {
        clickSearch() {
            this.$emit("search");
        },
        input() {
            this.$emit("inputValue", event.target.value);
        },
        clear() {
            this.$emit("inputValue", "");
        }
    }
}
</script>

<style lang="scss" scoped>
.inputSrch {
    background: #fff;
    height: 38px;
    line-height: 38px;
    border-radius: 0 2px 2px 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    .input {
        padding: 0 17px;
        font-size: 13px;
        width: 100%;
        height: 100%;
        &::placeholder {
            color: #E5E5E5;
        }
    }
    .iconfont {
        color: #e5e5e5;
        margin-right: 11px;
        font-size: 17px;
        color: #4780F7;
    }
}
</style>
