<template>
    <div class="cityCar">
        <ul class="tab" v-if="edit">
            <li class="tbi active">市内用车</li>
        </ul>
        <cityCarForm :odItem="odItem"></cityCarForm>
    </div>
</template>

<script>
import cityCarForm from "./cityCarType";

export default {
    name: "cityCar",
    props: ["odItem"],
    components: {
        cityCarForm,
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
.cityCar {
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
