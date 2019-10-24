<template>
    <div class="bookCar">
        <div class="editHead" v-if="edit">
            <button class="carBtn blue backBtn" @click="editBack">
                <i class="iconfont icon-icon_back backIc"></i>
            </button>
            <div class="h3">编辑订单</div>
        </div>
        <ul class="tab" v-if="!edit">
            <li class="tbi" :class="{active: bookType == 0}" @click="selectBookType(0)">
                <i class="iconfont icon-icon_airplane_n tbIc"></i>接送机
            </li>
            <li class="tbi" :class="{active: bookType == 1}" @click="selectBookType(1)">
                <i class="iconfont icon-icon_pickupstation_n tbIc"></i>接送站
            </li>
            <li class="tbi" :class="{active: bookType == 2}" @click="selectBookType(2)">
                <i class="iconfont icon-icon_citycar_n tbIc"></i>市内用车
            </li>
            <li class="tbi" :class="{active: bookType == 3}" @click="selectBookType(3)">
                <i class="iconfont icon-icon_charteredcar_n tbIc"></i>包车
            </li>
        </ul>
        <div class="bookType">
            <component v-bind:is="bookCmp" :odItem="odItem" class="bookCmp"></component>
            <div class="posMap" v-show="showMap" id="mapDiv"></div>
        </div>
        <!--下单成功-->
        <basePopup v-model="showSuccDlg">
            <bookSuccess @exit="exitSuccDlg"></bookSuccess>
        </basePopup>
    </div>
</template>

<script>
import airplane from "./bookType/airplane";
import train from "./bookType/train";
import cityCar from "./bookType/cityCar";
import charter from "./bookType/charter";
import basePopup from "@/commonComponents/basePopup";
import bookSuccess from "./components/bookSuccess";

export default {
    components: {
        airplane,
        train,
        cityCar,
        charter,
        basePopup,
        bookSuccess,
    },
    provide () {
        return {
            createOrder: this.createOrder,
            updateOrder: this.updateOrder,
            cityQuery:  this.cityQuery,
            drawMapLine: this.drawMapLine,
            clearMap: this.clearMap,
            setMapCity: this.setMapCity,
        }
    },
    data() {
        return {
            bookType: 0,
            amap: null,
            
            showSuccDlg: false,

            odItem: null,
            edit: 0,
        }
    },
    computed: {
        showMap() {
            return this.bookType != 3;
        },
        bookCmp() {
            return {0: "airplane", 1: "train", 2: "cityCar", 3: "charter"}[this.bookType];
        }
    },
    beforeRouteEnter (to, from, next) {
        if(to.name == "editOrder") {
            let oid = to.params && to.params.order && to.params.order.orderId;
            if(!oid) {
                next("/order");
                return;
            }
        }
        next();
    },
    activated() {
        let { order } = this.$route.params;
        if(order && order.orderId) {
            let st = order.serviceType;
            let ty = order.type;
            if(ty == 3) {
                this.bookType = 3;
            }else {
                (st == 1 || st == 2) && (this.bookType = 0);
                (st == 3 || st == 4) && (this.bookType = 1);
                (st == 5) && (this.bookType = 2);
            }
            this.odItem = order;
            this.edit = 1;
        }
    },
    mounted() {
        this.$store.dispatch("main/getCityList");
        this.$store.dispatch("main/getUserList");
        this.$store.dispatch("main/getPoiList");

        this.amap = new window.AMap.Map("mapDiv");
        let ct = localStorage.getItemObj("companyInfo").cityName || "北京";
        this.setMapCity(ct);
    },
    beforeDestroy() {
        this.amap.clearMap();
        this.amap.destroy();
        this.amap = null;
    },
    methods: {
        editBack() {
            this.$router.push("/order");
        },
        selectBookType(n) {
            this.bookType = n;
            this.clearMap();
        },
        exitSuccDlg() {
            this.showSuccDlg = false;
        },
        createOrder(params) {
            this.$api["createOrder"]({
                ...params
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.showSuccDlg = true;
            }).catch(err => err);
        },
        updateOrder(params) {
            this.$api["updateOrder"]({
                ...params
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.$message.success("修改成功");
                this.$router.push("/order");
            }).catch(err => err);
        },
        // 经纬度查城市
        cityQuery(lng, lat) {
            return new Promise(resolve => {
                let AMap = window.AMap;
                AMap.plugin("AMap.Geocoder", function() {
                    let geocoder = new AMap.Geocoder();
                    geocoder.getAddress([lng, lat], function(status, result) {
                        if (status === 'complete' && result.regeocode) {
                            let addrInfo = result.regeocode.addressComponent && result.regeocode.addressComponent || {};
                            resolve(addrInfo);
                        }
                    });
                });
            });
        },
        // 路线规划
        drawMapLine(lon1, lat1, lon2, lat2) {
            this.$nextTick(() => {
                let map = this.amap;
                map.clearMap();
                let AMap = window.AMap;
                AMap.plugin("AMap.Driving", function() {
                    let driving = new AMap.Driving({map});
                    driving.search(new AMap.LngLat(lon1, lat1), new AMap.LngLat(lon2, lat2));
                });
            });
        },
        // 清除地图
        clearMap() {
            this.$nextTick(() => {
                this.amap.clearMap();
            });
        },
        setMapCity(city) {
            this.$nextTick(() => {
                this.amap.setCity(city);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.bookCar {
    padding: 25px 0 80px 0;
    .editHead {
        display: flex;
        align-items: center;
        margin-bottom: 26px;
        .backBtn {
            width: 30px;
            height: 25px;
            line-height: 23px;
            .backIc {
                font-size: 12px;
            }
        }
        .h3 {
            font-size: 16px;
            color: #4a4a4a;
            margin-left: 12px;
            font-weight: 600;
        }
    }
    .tab {
        display: flex;
        align-items: center;
        user-select: none;
        margin-bottom: 25px;
        .tbi {
            width: 120px;
            height: 40px;
            line-height: 40px;
            border-radius: 20px;
            text-align: center;
            background: #fff;
            color: #989EB6;
            font-size: 16px;
            cursor: pointer;
            margin-right: 20px;
            .tbIc {
                font-size: 16px;
                margin-right: 8px;
            }
            &:hover {
                opacity: 0.8;
            }
            &.active {
                background: #4780F7;
                color: #fff;
                opacity: 1;
                pointer-events: none;
            }
        }
    }
    .bookType {
        padding: 25px;
        background: #fff;
        border-radius: 3px;
        box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.04);
        display: flex;
        justify-content: space-between;
        .bookCmp {
            flex-shrink: 0;
        }
        .posMap {
            width: 650px;
            height: 650px;
            border: 1px solid #e5e5e5;
        }
    }
}
</style>
