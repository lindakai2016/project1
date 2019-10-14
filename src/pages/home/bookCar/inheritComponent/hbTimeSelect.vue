<template>
    <div class="uctSel">
        <selectGr class="selectGr" :class="{err: err}" v-model="hbTimeSel">
            <optionLi class="li" label="航班到达后15分钟" :value="15"></optionLi>
            <optionLi class="li" label="航班到达后30分钟" :value="30" selected="1"></optionLi>
            <optionLi class="li" label="航班到达后45分钟" :value="45"></optionLi>
            <optionLi class="li" label="航班到达后60分钟" :value="60"></optionLi>
            <optionLi class="li" label="航班到达后120分钟" :value="120"></optionLi>
        </selectGr>
    </div>
</template>

<script>
import selectGr from "./Select";
import optionLi from "@/commonComponents/baseOption";

export default {
    props: ["err"],
    components: {
        selectGr,
        optionLi
    },
    data() {
        return {
            hbTimeSel: 30,
        }
    },
    watch: {
        hbTimeSel: {
            immediate: true,
            handler(val) {
                this.$emit("change", val);
            }
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
