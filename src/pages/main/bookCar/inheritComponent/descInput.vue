<template>
    <div class="textAreaGr" :class="{focus: inFocus, err: err}" v-clickout="blur">
        <textarea class="input" placeholder="请输入用车要求" :value="value" @input="input" @click="focus"></textarea>
        <p class="letterNum">{{curLetterNum}}/300</p>
    </div>
</template>

<script>

export default {
    name: "descInput",
    props: ["value", "err"],
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
        curLetterNum() {
            return this.value && this.value.length || 0;
        }
    },
    methods: {
        blur() {
            this.inFocus = false;
        },
        input() {
            let value = event.target.value;
            let reg = /^[\s\S]{0,300}/;
            value = value && (value.match(reg) || [])[0];
            event.target.value = value;
            this.$emit("inputValue", value);
        },
        focus() {
            this.inFocus = true;
        }, 
    }
}
</script>

<style lang="scss" scoped>
.textAreaGr {
    border-radius: 5px;
    border: 1px solid rgba(53,65,79,0.25);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    &.err {
        border-color: #F85C5C;
    }
    &.focus {
        border-color: #4780F7;
        .input::placeholder {
            color: transparent;
        }
    }
    .input {
        display: block;
        padding: 8px 17px;
        font-size: 13px;
        width: 100%;
        height: 100%;
        resize: none;
        &::placeholder {
            color: #E5E5E5;
        }
    }
    .letterNum {
        text-align: right;
        font-size: 12px;
        color: #888;
        font-weight: 400;
        line-height: 20px;
        padding: 0 12px 8px 12px;
    }
}
</style>
