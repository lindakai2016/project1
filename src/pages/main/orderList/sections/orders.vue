<template>
    <div class="orders">
        <div class="odHead">
            <div class="td col_dd">订单信息</div>
            <div class="td col_ck">乘客信息</div>
            <div class="td col_sj">司机信息</div>
            <div class="td col_zt">状态</div>
            <div class="td col_cz">操作</div>
        </div>
        <div class="odItem" v-for="(item, i) in orderList" :key="i">
            <div class="td col_dd">
                <div class="l1">
                    <i class="iconfont icon-charteredtime"></i>
                    <span class="time">{{item.serviceTimeStr || "--"}}</span>
                    <i class="type">{{item.serviceTypeEx || "--"}}</i>
                </div>
                <div class="l2 row rowAddr">
                    <i class="posIc">始</i>
                    <span class="pos" :title="item.startPosition">{{item.startPosition || "--"}}</span>
                </div>
                <div class="l2 dash" v-if="!item.isCt">
                    <i class="posIc">终</i>
                    <span class="pos" :title="item.endPosition">{{item.endPosition || "--"}}</span>
                </div>
            </div>
            <div class="td col_ck">
                <div class="l1">
                    <i class="iconfont icon-home_icon_singularquantity"></i>
                    <span class="name">{{item.userName || "--"}}</span>
                    <span class="phone">{{item.userPhone || "--"}}</span>
                </div>
                <div class="l2">
                    <i class="iconfont icon-icon_people"></i>
                    <span class="name">{{item.rideNum || "--"}}人</span>
                </div>
            </div>
            <div class="td col_sj">
                <div class="l1" v-if="item.driverName">
                    <i class="iconfont icon-home_icon_numberofpeople"></i>
                    <span class="name">{{item.driverName || "--"}}</span>
                    <span class="phone">{{item.driverPhone || "--"}}</span>
                </div>
                <div class="l2" v-if="item.driverName">
                    <i class="iconfont icon-icon_citycar_n"></i>
                    <span class="carName">{{item.carName || "--"}}</span>
                    <span class="carNum">{{item.carNumber || "--"}}</span>
                    <i class="dot"></i>
                    <span class="carColor">{{item.carColor|| "--"}}</span>
                     <i class="dot"></i>
                    <span class="carSeat">{{item.seatNum || "--"}}座</span>
                </div>
                <div class="emptySj" v-if="!item.driverName"></div>
            </div>
            <div class="td col_zt">
                <div class="status" :class="stColor(item)">{{item.orderStatusDesc || "--"}}</div>
                
            </div>
            <div class="td col_cz">
                <moreDrop class="moreDrop">
                    <dropOption @click="detail(item)">详情</dropOption>
                    <dropOption v-if="canEdit(item)" @click="edit(item)">编辑</dropOption>
                    <dropOption class="gray" v-if="canCancel(item) && item.cancelApply">等待取消</dropOption>
                    <dropOption v-if="canCancel(item) && !item.cancelApply" @click="cancel(item)">取消</dropOption>
                    <dropOption v-if="canDel(item)" @click="del(item)">删除</dropOption>
                </moreDrop>
            </div>
        </div>
        <!--空数据-->
        <div class="emptyOdItem" v-if="!hasOrder">
            <img src="@/static/images/home_img_empty.svg">
            <p class="emTxt">暂无订单</p>
        </div>
        <!--订单详情-->
        <basePopup v-model="showDt">
            <orderDetail :data="odDt" @exit="exitDt"></orderDetail>
        </basePopup>
    </div>
</template>

<script>
import basePopup from "@/commonComponents/basePopup";
import dropOption from "@/commonComponents/baseDropOption";
import moreDrop from "../inheritComponent/moreDrop";
import orderDetail from "../components/orderDetail";
import moment from "moment";
// import testOrderDetail from "../testData/orderDetail";

export default {
    props: ["data"],
    components: {
        moreDrop,
        dropOption,
        basePopup,
        orderDetail,
    },
    data () {
        return {
            showDt: false,
            odDt: {},
        }
    },
    computed: {
        orderList() {
            let list =  this.data || [];
            list.map(e => {
                e.isCt = (e.type == 3);
                e.serviceTimeStr = e.serviceTime && moment(e.serviceTime).format("YYYY-MM-DD HH:mm") || "--";
                e.pgDayEx = e.serviceDay == 0.5 ? "半" : e.serviceDay;
                e.serviceTypeEx = e.isCt ? `包车${e.pgDayEx || "--"}天` : e.serviceTypeDesc;
            });
            return list;
        },
        hasOrder() {
            return this.orderList.length;
        }
    },
    methods: {
        stColor({ orderStatus }) {
            return {
                green:  orderStatus == 0,
                red:    orderStatus == 10 || orderStatus == 40,
                blue:   orderStatus == 20,
                gray:   orderStatus == 30,
            }
        },
        canEdit({orderStatus}) {
            return [0].includes(orderStatus);
        },
        canCancel({orderStatus}) {
            return [0, 10, 20].includes(orderStatus);
        },
        canDel({orderStatus}) {
            return [30, 40].includes(orderStatus);
        },
        // 详情
        detail({ orderId }) {
            this.$api["orderDetail"]({
                order_id:   orderId
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.odDt = res.data || {};
                this.showDt = true;
            }).catch(err => err);
        },
        exitDt() {
            this.showDt = false;
        },
        // 编辑
        edit({ orderId }) {
            this.$api["orderDetail"]({
                order_id:   orderId
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                let order = res.data || {};
                this.$router.push({name: "editOrder", params: {order}});
            }).catch(err => err);
        },
        // 取消
        async cancel({orderId, orderStatus}) {
            let op = await this.$dialog.alert("确定取消订单？");
            if(op != "ok") {
                return;
            }
            this.$api["orderCancel"]({
                order_id:   orderId
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.$message.success(orderStatus == 0 ? "订单取消成功" : "订单取消申请成功");
                this.$emit("update");
            }).catch(err => err);
        },
        // 删除
        async del({orderId}) {
            let op = await this.$dialog.delete("确定删除订单？");
            if(op != "ok") {
                return;
            }
            this.$api["orderDel"]({
                order_id:   orderId
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.$message.success("删除订单成功");
                this.$emit("update");
            }).catch(err => err);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../scss/orders.scss";
.orders {
    margin-top: 20px;
    .emptyOdItem {
        text-align: center;
        padding: 100px 0;
        background: #fff;
        margin-top: 20px;
        .emTxt {
            color: #888;
            font-size: 14px;
        }
    }
}
</style>
