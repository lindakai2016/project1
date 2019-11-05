<template>
    <div class="inputSrch">
        <input class="input" type="text" :placeholder="placeholder" :value="value" 
            @input="input($event)" 
            @compositionstart="compositionStart" 
            @compositionend="compositionEnd($event)"
        >
        <i class="iconfont icon-login_icon_del link delIc" @click="clear" v-show="showClear"></i>
        <i class="iconfont icon-icon_search link srchIc" @click="clickSearch"></i>
    </div>
</template>

<script>

export default {
    name: "srchInput",
    props: ["placeholder", "value"],
    model: {
        prop: "value",
        event: "inputValue",
    },
    data() {
        return {
            isInputZhName: false,
        }
    },
    computed: {
        showClear() {
            return !!this.value;
        }
    },
    methods: {
        clickSearch() {
            this.$emit("search");
        },
        compositionStart() {
            this.isInputZhName = true;
        },
        compositionEnd(event) {
            this.isInputZhName = false;
            this.$emit("inputValue", event.target.value);
        },
        input(event) {
            if(this.isInputZhName) {
                return;
            }
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
    .delIc {
        color: #888;
        margin-right: 8px;
        font-size: 14px;
    }
    .srchIc {
        margin-right: 11px;
        font-size: 17px;
        color: #4780F7;
    }
}
</style>
