<template>
    <baseDrop class="dropMenu">
        <template #head="{active}">
            <i class="iconfont icon-icon_moreoperations moreIc"></i>
        </template>
        <template #drop>
            <slot></slot>
        </template>
    </baseDrop>
</template>

<script>
import baseDrop from "@/commonComponents/baseDrop";

export default {
    components: {
        baseDrop,
    }
}
</script>

<style lang="scss" scoped>
.dropMenu {
    display: inline-block;
    user-select: none;
    text-align: left;
    .moreIc {
        font-size: 14px;
        color: #4780F7;
    }
}
</style>
