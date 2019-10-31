<template>
    <div class="pubOrderDetail">
        <div class="orderDt" v-if="odItem">
            <!-- <div class="head">
                <i class="iconfont icon-icon_close_n leftIc"></i>
                订单详情
                <i class="iconfont icon-icon_moreoperations rightIc"></i>
            </div> -->
            <div class="status">{{odItem.orderStatusDesc || "--"}}</div>
            <div class="infoSec info_sj" v-if="odItem.driverName">
                <h3 class="h3">司机信息</h3>
                <div class="l1">
                    <i class="iconfont icon-home_icon_numberofpeople"></i>
                    <span class="name">{{odItem.driverName || "-"}}</span>
                    <a class="phone" :href="`tel:${odItem.driverPhone}`">{{odItem.driverPhone || "-"}} <i class="iconfont icon-icon_callup telIc"></i></a>
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
            <div class="infoSec info_xc">
                <div class="l1">
                    <span class="city">{{odItem.cityName || "--"}}</span>
                    <span class="odType">{{odItem.serviceTypeEx || "--"}}</span>
                    <span class="code" v-if="odItem.flyNo">{{odItem.flyNo || "--"}}</span>
                </div>
                <div class="line time">
                    <i class="iconfont icon-charteredtime"></i>{{odItem.serviceTimeDesc || "--"}}
                </div>
                <div class="line posIc">{{odItem.startPosition || "--"}}</div>
                <div class="line posIc dash" v-if="!odItem.isCt">{{odItem.endPosition || "--"}}</div>
                <div class="line contact">
                    <i class="iconfont icon-icon_contacts"></i>
                    <span class="rideNum">{{odItem.rideNum}}人</span>
                    <span class="userName">{{odItem.userName || "--"}}</span>
                    <a class="userPhone" :href="`tel:${odItem.userPhone}`">{{odItem.userPhone || "--"}} <i class="iconfont icon-icon_callup telIc"></i></a>
                </div>
                <div class="remark">{{odItem.remark || "--"}}</div>
            </div>
            <div class="infoSec info_ck">
                <div class="ckTitle">订单信息</div>
                <div class="line">
                    <label class="lb">订单号</label>
                    <span class="val">{{odItem.viewOrderId || "--"}}</span>
                    <i class="iconfont icon-icon_copy" v-clipboard:copy="odItem.viewOrderId" v-clipboard:success="onCopy" v-clipboard:error="onCopyError"></i>
                </div>
                <div class="line">
                    <label class="lb">下单时间</label>
                    <span class="val">{{odItem.createTimeStr || "--"}}</span>
                    <i class="iconfont"></i>
                </div>
                <div class="line">
                    <label class="lb">下单人</label>
                    <span class="val">
                        {{odItem.creatorName || "-"}}<a :href="`tel:${odItem.creatorPhone}`"><i class="phone">{{odItem.creatorPhone || "-"}}</i></a>
                    </span>
                    <i class="iconfont icon-icon_callup"></i>
                </div>
                <div class="line">
                    <label class="lb">订单金额</label>
                    <span class="val">¥{{odItem.settlePrice || "--"}}</span>
                    <i class="iconfont"></i>
                </div>
            </div>
            <div class="op" v-if="canCancel">
                <button class="carBtn blue okBtn" @click="orderCancel">取消订单</button>
            </div> 
        </div>
        
    </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";

export default {
    name: "pubOrderDetail",
    data() {
        return {
            odItem: null,
            code: "",
        }
    },
    computed: {
        canCancel() {
            let {orderStatus, cancelApply} = this.odItem || {};
            return orderStatus < 7 && cancelApply;
        },
    },
    beforeRouteEnter (to, from, next) {
        let cW = document.body.clientWidth;
        if(cW > 800) {
            next({path: "/pubOrder", query: {...to.query}});
            return;
        }
        document.title = "订单详情";
        next();
    },
    mounted() {
        let code = this.$route.query.code;
        if(!code) {
            return;
        }
        this.code = code;
        this.getOrderDetail();
    },
    methods: {
        onCopy() {
            this.$message.success("复制成功");
        },
        onCopyError() {
            this.$message.failed("复制失败");
        },
        getOrderDetail() {
            let code = this.code;
            this.$api["pubOrderDetail"]({
                code
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                let odItem =  res.data || {};

                odItem.isCt = (odItem.type == 3);
                odItem.createTimeStr = odItem.createTime && moment(odItem.createTime).format("YYYY-MM-DD HH:mm:ss");
                odItem.setterTypeEx = {1: "线下结算", 2: "线上结算"}[odItem.settleType];
                odItem.settleStatusEx = {0: "未结算", 1: "已结算"}[odItem.settleStatus];

                odItem.pgDayEx = odItem.serviceDay == 0.5 ? "半" : odItem.serviceDay;
                odItem.serviceTypeEx = odItem.isCt ? `包车${odItem.pgDayEx || "--"}天` : odItem.serviceTypeDesc;

                !odItem.orderFlow && (odItem.orderFlow = []);
                odItem.orderFlow.map((e, i) => e.idx = i);

                this.odItem =odItem;
            });
        },
        orderCancel: _.debounce(async function () {console.log(this)
            let op = await this.$dialogH5.alert("确定取消该订单吗？", "确定", "不取消了");
            if(op != "ok") {
                return;
            }
            let code = this.code;
            this.$api["pubOrderCancel"]({
                code
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.$message.success("订单取消成功");
                this.getOrderDetail();
            });
        }, 300)
    }
}
</script>

<style lang="scss" scoped>
@import "../scss/pubOrderDetailH5.scss";
.pubOrderDetail {
    
}
</style>
