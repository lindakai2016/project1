<template>
    <baseDrop class="selectGr">
        <template #head="{active}">
            <div class="input">
                <span class="sdv">{{curLabel}}</span>
                <i class="iconfont icon-home_icon_s sdi" :class="{down: active}"></i>
            </div>
        </template>
        <template #drop>
            <slot></slot>
        </template>
    </baseDrop>
</template>

<script>
import baseDrop from "./baseDrop";

export default {
    name: "baseSelect",
    props: ["value"],
    model: {
        prop: "value",
        event: "selectValue",
    },
    components: {
        baseDrop,
    },
    provide() {
        return {
            "selectGr": this
        }
    },
    data() {
        return {
            options: [],
        }
    },
    computed: {
        curLabel() {
            let activeOption = this.options && this.options.filter(e => e.active)[0];
            return activeOption && activeOption.label;
        }
    },
    value: {
        immediate: true,
        handler(val) {
            this.options.map(e => {
                e.value == val && (e.active = 1);
            });
        }
    },
    methods: {
        clickOption(option){
            this.options.map(e => e.active = 0);
            option.active = 1;
            this.$emit("selectValue", option.value);
        }
    }
}
</script>

<style lang="scss" scoped>
.selectGr {
    display: inline-block;
    user-select: none;
    .input {
        background: #fff;
        height: 38px;
        line-height: 38px;
        text-align: center;
        border-radius: 3px;
        color: #2C3642;
        cursor: pointer;
        .sdv {
            font-size: 12px;
        }
        .sdi {
            display: inline-block;
            font-size: 12px;
            transform: rotate(180deg);
            &.down {
                transform: none;
            }
        }
    }
}
</style>
