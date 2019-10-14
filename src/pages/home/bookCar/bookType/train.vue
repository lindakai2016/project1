<template>
    <div class="train">
        <div class="bookContent">
            <ul class="tab">
                <li class="tbi" :class="{active: fromAir}" @click="setTrainType(0)">接站</li>
                <li class="tbi" :class="{active: toAir}" @click="setTrainType(1)">送站</li>
            </ul>
            <keep-alive>
                <component :is="trainTypeComponent" :amap="amapMng"></component>
            </keep-alive>
        </div>
        <div class="posMap">
            <el-amap :amap-manager="amapMng"></el-amap>
        </div>
    </div>
</template>

<script>
import fromTrain from "./trainType/from";
import toTrain from "./trainType/to";
import { AMapManager } from 'vue-amap';

export default {
    components: {
        fromTrain,
        toTrain,
    },
    data () {
        return {
            trainType: 0,     // 0-接机，1-送机
            amapMng: new AMapManager(), 
        }
    },
    computed: {
        trainTypeComponent() {
            return {0: "fromTrain", 1: "toTrain"}[this.trainType];
        },
        fromAir() {
            return this.trainType == 0;
        },
        toAir() {
            return this.trainType == 1;
        }
    },
    mounted() {
        
    },
    methods: {
        setTrainType(n) {
            this.trainType = n;
        }
    }
}
</script>

<style lang="scss" scoped>
.train {
    padding: 25px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.04);
    display: flex;
    justify-content: space-between;
    .bookContent {
        flex-shrink: 0;
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
    .posMap {
        width: 650px;
        height: 650px;
        border: 1px solid #e5e5e5;
    }
}
</style>
