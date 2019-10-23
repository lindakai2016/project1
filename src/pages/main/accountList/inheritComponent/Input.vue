<template>
    <div class="inputGr" :class="{focus: inFocus}">
        <input class="input" :type="type" :placeholder="placeholder" :value="value" @input="input" @focus="focus" @blur="blur">
        <i class="iconfont icon-login_icon_del link" @click="clickClear" v-show="showClear"></i>
    </div>
</template>

<script>

export default {
    name: "account-input",
    props: ["type", "placeholder", "value", "clear"],
    model: {
        prop: "value",
        event: "inputValue",
    },
    data() {
        return {
            inFocus: 0,
        }
    },
    computed: {
        showClear() {
            return this.clear && !!this.value;
        }
    },
    methods: {
        blur() {
            this.inFocus = false;
            this.$emit("blur");
        },
        clickClear() {
            this.$emit("inputValue", "");
        },
        input() {
            this.$emit("inputValue", event.target.value);
        },
        focus() {
            this.inFocus = true;
        }, 
    }
}
</script>

<style lang="scss" scoped>
.inputGr {
    height: 40px;
    line-height: 38px;
    border-radius: 5px;
    border: 1px solid #E5E5E5;
    overflow: hidden;
    display: flex;
    align-items: center;
    &.focus {
        border-color: #4780F7;
    }
    .input {
        padding: 0 17px;
        font-size: 13px;
        width: 100%;
        height: 100%;
        &::placeholder {
            color: #E5E5E5;
        }
        &:focus::placeholder {
            color: transparent;
        }
    }
    .iconfont {
        color: #B8BCC1;
        margin-right: 11px;
        font-size: 14px;
    }
    
}
</style>
