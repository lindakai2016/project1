<template>
    <div class="orderDetail orderDt">
        <h3 class="head">订单详情</h3>
        <i class="iconfont icon-icon_close_n link closeIcon" @click="exit"></i>
        <div class="statusPrg" v-if="hasOdFlow">
            <div class="spBg" :style="{width: odFlowBgW}">
                <div class="spDone" :style="{width: odFlowW}"></div>
            </div>
            <div class="spi" v-for="(e, i) in odItem.orderFlow" :key="i">
                <i class="iconfont icon-icon_submitsuccessfully stIc" :class="odFlowSt(e)"></i>
                <p class="splb" :class="odFlowSt(e)">{{e.statusDesc || "--"}}</p>
            </div>
        </div>
        <!--司机信息-->
        <div class="infoSec info_sj" v-if="odItem.driverName">
            <h3 class="h3">司机信息</h3>
            <div class="l1">
                <i class="iconfont icon-home_icon_numberofpeople"></i>
                <span class="name">{{odItem.driverName || "--"}}</span>
                <span class="phone">{{odItem.driverPhone || "--"}}</span>
            </div>
            <div class="l2">
                <i class="iconfont icon-icon_citycar_n"></i>
                <span class="carName">{{odItem.carName || "--"}}</span>
                <span class="carNum">{{odItem.carNumber || "--"}}</span>
                <i class="dot"></i>
                <span class="carColor">{{odItem.carColor || "--"}}</span>
                <i class="dot"></i>
                <span class="carSeat">{{odItem.seatNum || "--"}}座</span>
            </div>
        </div>
        <!--行程信息-->
        <div class="infoSec info_xc">
            <h3 class="h3">行程信息</h3>
            <div class="line" v-if="odItem.serviceType == 1">
                <label class="lb">航班号</label>
                <span class="val">{{odItem.flyNo || "--"}}</span>
            </div>
            <div class="line">
                <label class="lb">用车时间</label>
                <span class="val">{{odItem.serviceTimeDesc || "--"}}</span>
            </div>
            <div class="line">
                <label class="lb">出发地</label>
                <span class="val">{{odItem.startPosition || "--"}}</span>
            </div>
            <div class="line" v-if="!odItem.isCt">
                <label class="lb">目的地</label>
                <span class="val">{{odItem.endPosition || "--"}}</span>
            </div>
            <div class="line">
                <label class="lb">乘车人数</label>
                <span class="val">{{odItem.rideNum}}人</span>
            </div>
            <div class="line">
                <label class="lb">联系人</label>
                <span class="val">{{odItem.userName || "--"}}</span>
                <span class="phone">{{odItem.userPhone || "--"}}</span>
            </div>
            <div class="line">
                <label class="lb">用车要求</label>
                <span class="val">{{odItem.remark || "--"}}</span>
            </div>
        </div>
        <!--订单信息-->
        <div class="infoSec info_ck">
            <h3 class="h3">订单信息</h3>
            <div class="valgr">
                <label class="lb">订单号</label>
                <span class="val">{{odItem.viewOrderId || "--"}}</span>
            </div>
            <div class="valgr">
                <label class="lb">下单时间</label>
                <span class="val">{{odItem.createTimeStr || "--"}}</span>
            </div>
            <div class="valgr">
                <label class="lb">下单人</label>
                <span class="val">{{odItem.creatorName || "--"}}</span>
            </div>
            <div class="valgr">
                <label class="lb">结算方式</label>
                <span class="val">{{odItem.setterTypeEx || "--"}}</span>
            </div>
            <div class="valgr">
                <label class="lb">结算状态</label>
                <span class="val">{{odItem.settleStatusEx || "--"}}</span>
                <span class="price" v-if="odItem.settleStatus == 1">{{odItem.settlePrice || "--"}}元</span>
            </div>
        </div>
        <button class="carBtn blue okBtn" @click="exit">我知道了</button>
    </div>
</template>

<script>
import moment from "moment";

export default {
    props: ["data"],
    computed: {
        odItem() {
            let odItem =  this.data || {};
            odItem.isCt = (odItem.type == 3);
            odItem.createTimeStr = odItem.createTime && moment(odItem.createTime).format("YYYY-MM-DD HH:mm:ss");
            odItem.setterTypeEx = {1: "线上结算", 2: "线下结算"}[odItem.settleType];
            odItem.settleStatusEx = {0: "未结算", 1: "已结算"}[odItem.settleStatus];
            !odItem.orderFlow && (odItem.orderFlow = []);
            odItem.orderFlow.map((e, i) => e.idx = i);
            return odItem;
        },
        hasOdFlow() {
            return this.odItem.orderFlow.length;
        },
        odFlowBgW() {
            let n = this.odItem.orderFlow.length || 1;
            return 100 * (n - 1) / n + "%";
        },
        odFlowW() {
            let n = this.odItem.orderFlow.length;
            n < 2 && (n = 2);
            let i = (this.odItem.orderFlow.filter(e => e.current)[0] || {}).idx;
            return i * 100 / (n - 1) + "%";
        },
    },
    methods: {
        odFlowSt({viewType, current}) {
            return {
                cancel: viewType == 2,
                cur:    current && viewType != 2,
                done:   !current && viewType == 1,
                undone: !current && viewType == 3,
            }
        },
        exit() {
            this.$emit("exit");
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../scss/orderDetail.scss";
.orderDetail {
    max-height: calc(100vh - 30px);
    overflow: auto;
}
</style>
