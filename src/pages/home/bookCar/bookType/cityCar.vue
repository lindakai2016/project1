<template>
    <div class="cityCar">
        <div class="bookContent">
            <cityCarForm :amap="amapMng"></cityCarForm>
        </div>
        <div class="posMap">
            <el-amap :amap-manager="amapMng"></el-amap>
        </div>
    </div>
</template>

<script>
import cityCarForm from "./cityCarType";
import { AMapManager } from 'vue-amap';

export default {
    components: {
        cityCarForm,
    },
    data () {
        return {
            amapMng: new AMapManager(), 
        }
    },
    computed: {
        
    },
    methods: {
       
    }
}
</script>

<style lang="scss" scoped>
.cityCar {
    padding: 25px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.04);
    display: flex;
    justify-content: space-between;
    .bookContent {
        flex-shrink: 0;
    }
    .posMap {
        width: 650px;
        height: 650px;
        border: 1px solid #e5e5e5;
    }
}
</style>
