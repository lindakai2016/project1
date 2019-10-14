<template>
    <div class="airplane">
        
        <div class="bookContent">
            <ul class="tab">
                <li class="tbi" :class="{active: fromAir}" @click="setAirType(0)">接机</li>
                <li class="tbi" :class="{active: toAir}" @click="setAirType(1)">送机</li>
            </ul>
            <keep-alive>
                <component :is="airTypeComponent" :amap="amapMng"></component>
            </keep-alive>
        </div>
        <div class="posMap">
            <el-amap :amap-manager="amapMng"></el-amap>
        </div>
    </div>
</template>

<script>
import fromAirport from "./airType/from";
import toAirport from "./airType/to";
import { AMapManager } from 'vue-amap';

export default {
    components: {
        fromAirport,
        toAirport,
    },
    data () {
        return {
            airType: 0,     // 0-接机，1-送机

            orderBy: 1,     // 0-按机场，1-按航班
            amapMng: new AMapManager(),
        }
    },
    computed: {
        airTypeComponent() {
            return {0: "fromAirport", 1: "toAirport"}[this.airType];
        },
        fromAir() {
            return this.airType == 0;
        },
        toAir() {
            return this.airType == 1;
        }
    },
    mounted() {
        
    },
    methods: {
        setAirType(n) {
            this.airType = n;
        }
    }
}
</script>

<style lang="scss" scoped>
.airplane {
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
    .posMap {
        width: 650px;
        height: 650px;
        border: 1px solid #e5e5e5;
    }
}
</style>
