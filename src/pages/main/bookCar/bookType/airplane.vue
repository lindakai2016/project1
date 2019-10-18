<template>
    <div class="airplane">
        <ul class="tab" v-if="edit">
            <li class="tbi active">{{odTypeStr}}</li>
        </ul>
        <ul class="tab" v-if="!edit">
            <li class="tbi" :class="{active: airType == 0}" @click="setAirType(0)">接机</li>
            <li class="tbi" :class="{active: airType == 1}" @click="setAirType(1)">送机</li>
        </ul>
        <keep-alive>
            <component :is="cmp" :odItem="odItem"></component>
        </keep-alive>
    </div>
</template>

<script>
import airFrom from "./airType/from";
import airTo from "./airType/to";

export default {
    props: ["odItem"],
    components: {
        airFrom,
        airTo,
    },
    inject: ["clearMap"],
    data () {
        return {
            airType: 0,     // 0-接机，1-送机
            edit: 0,
        }
    },
    computed: {
        cmp() {
            return {0: "airFrom", 1: "airTo"}[this.airType];
        },
        odTypeStr() {
            return {0: "接机", 1: "送机"}[this.airType];
        }
    },
    watch: {
        odItem: {
            immediate: true,
            handler(order) {
                if(order) {
                    let st = order.serviceType;
                    (st == 1) && (this.airType = 0);
                    (st == 2) && (this.airType = 1);
                    this.edit = 1;
                }
            }
        }
    },
    methods: {
        setAirType(n) {
            this.airType = n;
            this.clearMap();
        },
    }
}
</script>

<style lang="scss" scoped>
.airplane {
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
