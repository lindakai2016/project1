<template>
    <div class="inputGr" :class="{focus: inFocus}">
        <input class="input" :placeholder="placeholder" type="password" :value="value" @input="input" @focus="focus" @blur="blur" autocomplete="new-password">
    </div>
</template>

<script>
export default {
    props: ["placeholder", "value"],
    model: {
        prop: "value",
        event: "inputValue",
    },
    data() {
        return {
            inFocus: 0,
        }
    },
    methods: {
        focus() {
            this.inFocus = true;
        }, 
        blur() {
            this.inFocus = false;
            this.$emit("blur");
        },
        input() {
            this.$emit("inputValue", event.target.value);
        }
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
        &:-webkit-autofill {
            box-shadow: 0 0 0px 1000px white inset;
            -webkit-box-shadow: 0 0 0px 1000px white inset;
        }
    }
    .iconfont {
        color: #888;
        margin-right: 11px;
        font-size: 14px;
    }
    
}
</style>
