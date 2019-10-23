<template>
    <div class="charter">
        <ul class="tab" v-if="edit">
            <li class="tbi active">包车</li>
        </ul>
        <charterForm :odItem="odItem"></charterForm>
    </div>
</template>

<script>
import charterForm from "./charterType";

export default {
    name: "charter",
    props: ["odItem"],
    components: {
        charterForm,
    },
    data () {
        return {
            edit: 0,
        }
    },
    watch: {
        odItem: {
            immediate: true,
            handler(order) {
                order && (this.edit = 1);
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.charter {
   .tab {
        user-select: none;
        margin-bottom: 8px;
        .tbi {
            display: inline-block;
            vertical-align: top;
            border-bottom: 3px solid transparent;
            padding: 0 2px 8px 2px;
            margin-right: 80px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            &.active {
                border-bottom-color: #4780F7;
                color: #4780F7;
                pointer-events: none;
                opacity: 1;
            }
            &:hover {
                opacity: 0.8;
            }
        }
    }
}
</style>
