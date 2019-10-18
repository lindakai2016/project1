<template>
    <baseDrop class="selectGr" notri="1">
        <template #head="{active}">
            <div class="input">
                <span class="sdv" :class="{place: !showPlace}">{{curLabel || placeholder || "请选择"}}</span>
                <i class="iconfont icon-home_icon_s sdi" :class="{down: active}"></i>
            </div>
        </template>
        <template #drop>
            <slot></slot>
        </template>
    </baseDrop>
</template>

<script>
import baseDrop from "@/commonComponents/baseDrop";

export default {
    props: ["placeholder", "value"],
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
        },
        showPlace() {
            return !!this.curLabel;
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                this.options.map(e => {
                    e.value == val ? e.active = 1 : e.active = 0;
                });
            }
        }
    },
    methods: {
        clickOption(option){
            this.options.map(e => e.active = 0);
            option.active = 1;
            this.$emit("change", option.value);
        }
    }
}
</script>

<style lang="scss" scoped>
.selectGr {
    display: inline-block;
    user-select: none;
    text-align: left;
    .input {
        background: #fff;
        width: 100%;
        height: 35px;
        line-height: 35px;
        padding: 0 0 0 12px;
        border-radius: 2px;
        color: #2C3642;
        cursor: pointer;
        .sdv {
            font-size: 14px;
            &.place {
                color: rgba(44,54,66,0.4);
            }
        }
        .iconfont {
            float: right;
            font-size: 12px;
        }
        .sdi {
            display: inline-block;
            width: 30px;
            text-align: center;
            transform: rotate(180deg);
            &.down {
                transform: none;
            }
        }
    }
}
</style>
