<template>
    <div class="inputGr" :class="{focus: inFocus, err: err}">
        <input class="input" type="text" :placeholder="placeholder" :value="value" @input="input($event)" @focus="focus" @blur="blur">
        <i class="iconfont icon-login_icon_del link" @click="clickClear" v-show="showClear"></i>
    </div>
</template>

<script>

export default {
    name: "bookCar-input",
    props: ["type", "placeholder", "value", "clear", "err"],
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
        input(event) {
            let value = event.target.value;
            if(this.type == "number") {
                let reg = /^\d*/;
                value = value && (value.match(reg) || [])[0];
                event.target.value = value;
            }
            this.$emit("inputValue", value);
        },
        focus() {
            this.inFocus = true;
        }, 
    }
}
</script>

<style lang="scss" scoped>
.inputGr {
    height: 35px;
    line-height: 33px;
    border-radius: 5px;
    border: 1px solid rgba(53,65,79,0.25);
    overflow: hidden;
    display: flex;
    align-items: center;
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
        font-size: 14px;
    }
    
}
</style>
