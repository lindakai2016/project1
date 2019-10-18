<template>
    <div class="uctSel">
        <selectGr class="selectGr" :class="{err: err}" placeholder="请选择用车时间" :value="valueEx" @change="change">
            <optionLi class="li" :label="`航班到达后${e}分钟`" :value="e" v-for="(e, i) in opLis" :key="i"></optionLi>
        </selectGr>
    </div>
</template>

<script>
import selectGr from "./Select";
import optionLi from "@/commonComponents/baseOption";

export default {
    props: ["err", "value"],
    components: {
        selectGr,
        optionLi
    },
    model: {
        prop: "value",
        event: "setVal",
    },
    data() {
        return {
            opLis: [15, 30, 45, 60, 120],
        }
    },
    computed: {
        valueEx() {
            let val = this.value;
            if(val <= 15) {
                return 15;
            }
            if(val <= 30) {
                return 30;
            }
            if(val <= 45) {
                return 45;
            }
            if(val <= 60) {
                return 60;
            }
            if(val <= 120) {
                return 120;
            }
            return val;
        }
    },
    methods: {
        change(val) {
            this.$emit("setVal", val);
        }
    }
}
</script>

<style lang="scss" scoped>
.uctSel{
    .selectGr {
        display: inline-block;
        user-select: none;
        text-align: left;
        border: 1px solid rgba(53,65,79,0.25);
        border-radius: 3px;
        width: 207px;
        color: #000;
        font-size: 14px;
        &.err {
            border-color: #F85C5C;
        }
        .li {
            width: 207px;
            text-align: left;
            padding: 0 12px;
        }
    }
}
</style>
