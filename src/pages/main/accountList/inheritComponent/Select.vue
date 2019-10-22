<template>
    <baseDrop class="selectGr" notri="1">
        <template #head="{active}">
            <div class="input">
                <span class="sdv" :class="{place: !showClear}">{{curLabel || placeholder || "请选择"}}</span>
                <i class="iconfont icon-home_icon_s sdi" :class="{down: active}" v-show="!showClear"></i>
                <i class="iconfont icon-login_icon_del1 cli" v-show="showClear" @click.stop="clear"></i>
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
    props: ["value", "placeholder"],
    model: {
        prop: "value",
        event: "selectValue",
    },
    components: {
        baseDrop,
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
        showClear() {
            return !!this.curLabel;
        }
    },
    provide() {
        return {
            "selectGr": this
        }
    },
    methods: {
        clickOption(option){
            this.options.map(e => e.active = 0);
            option.active = 1;
            this.$emit("selectValue", option.value);
        },
        clear() {
            this.options.map(e => e.active = 0);
            this.$emit("selectValue", "");
            document.body.click();
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
        line-height: 33px;
        padding: 0 12px;
        border-radius: 3px;
        color: #2C3642;
        cursor: pointer;
        border: 1px solid rgba(53,65,79,0.25);
        display: flex;
        .sdv {
            flex-grow: 1;
            font-size: 12px;
            &.place {
                color: rgba(44,54,66,0.4);
            }
        }
        .iconfont {
            font-size: 12px;
            color: #B8BCC1;
        }
        .sdi {
            transform: rotate(180deg);
            margin-right: -5px;
            &.down {
                transform: none;
            }
        }
        .cli {
            font-size: 14px;
        }
    }
}
</style>
