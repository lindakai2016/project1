<template>
    <div class="train">
        <ul class="tab" v-if="edit">
            <li class="tbi active">{{odTypeStr}}</li>
        </ul>
        <ul class="tab" v-if="!edit">
            <li class="tbi" :class="{active: trainType == 0}" @click="setTrainType(0)">接站</li>
            <li class="tbi" :class="{active: trainType == 1}" @click="setTrainType(1)">送站</li>
        </ul>
        <keep-alive>
            <component :is="trainTypeComponent" :odItem="odItem"></component>
        </keep-alive>
    </div>
</template>

<script>
import trainFrom from "./trainType/from";
import trainTo from "./trainType/to";

export default {
    name: "train",
    props: ["odItem"],
    components: {
        trainFrom,
        trainTo,
    },
    inject: ["clearMap"],
    data () {
        return {
            trainType: 0,     // 0-接机，1-送机
            edit: 0,
        }
    },
    computed: {
        trainTypeComponent() {
            return {0: "trainFrom", 1: "trainTo"}[this.trainType];
        },
        odTypeStr() {
            return {0: "接站", 1: "送站"}[this.trainType];
        }
    },
    watch: {
        odItem: {
            immediate: true,
            handler(order) {
                if(order) {
                    let st = order.serviceType;
                    (st == 3) && (this.trainType = 0);
                    (st == 4) && (this.trainType = 1);
                    this.edit = 1;
                }
            }
        }
    },
    methods: {
        setTrainType(n) {
            this.trainType = n;
            this.clearMap();
        }
    }
}
</script>

<style lang="scss" scoped>
.train {
    .tab {
        user-select: none;
        margin-bottom: 20px;
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
