<template>
    <div class="recentOrders" v-if="hasRecentOd">
        <h3 class="title">近期订单</h3>
        <div class="oI" v-for="(item, i) in orderList" :key="i" @click="toOrderList">
            <div class="row l1">
                <p class="time vmid">{{item.serviceTimeStr || "--"}}</p>
                <i class="type vmid">{{item.serviceTypeEx || "--"}}</i>
                <i class="status" :class="stColor(item)">{{item.orderStatusDesc || "--"}}</i>
            </div>
            <div class="l2">
                <div class="row addr">
                    <i class="iconfont icon-home_icon_address addrIcon vmid"></i>
                    <span class="pos vmid" :title="item.startPosition">{{item.startPosition || "--"}}</span>
                    <i class="iconfont icon-img_arrow_right toIcon vmid" v-if="!item.isCt"></i>
                    <span class="pos vmid" :title="item.endPosition" v-if="!item.isCt">{{item.endPosition || "--"}}</span>
                </div>
                <div class="row passenger">
                    <i class="iconfont icon-home_icon_singularquantity nameIcon vmid"></i>
                    <span class="name vmid">{{item.userName || "--"}}</span>
                    <span class="phone vmid">{{item.userPhone || "--"}}</span>
                    <span class="num vmid">{{item.rideNum || "--"}}人</span>
                </div>
                <i class="iconfont icon-home_icon_more_right_n moreIcon"></i>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";

export default {
    name: "homepart2",
    data () {
        return {
            orderList: [],
        }
    },
    computed: {
        hasRecentOd() {
            return this.orderList.length;
        }
    },
    mounted() {
        this.getOrderList();
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
        getOrderList() {
            this.$api["orderList"]({
                page_index: 1,
                page_size:  10,
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                let orderList = res.data && res.data.orderList || [];
                orderList = orderList.slice(0, 4);
                orderList.map(e => {
                    e.isCt = (e.type == 3);   //是否包车
                    e.serviceTimeStr = e.serviceTime && moment(e.serviceTime).format("MM-DD HH:mm") || "--";
                    e.pgDayEx = e.serviceDay == 0.5 ? "半" : e.serviceDay;
                    e.serviceTypeEx = e.isCt ? `包车${e.pgDayEx || "--"}天` : e.serviceTypeDesc;
                });
                this.orderList = orderList;
            }).catch(err => err);
        },
        toOrderList() {
            this.$router.push("/order");
        }
    }
}
</script>

<style lang="scss" scoped>
.recentOrders {
    &::after {
        content: "";
        display: block;
        clear: both;
    }
    .title {
        font-size: 16px;
        line-height: 23px;
        font-weight: 600;
        color: #000;
        margin-bottom: -5px;
    }
    .oI {
        width: calc(50% - 10px);
        float: left;
        background: #fff;
        box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.04);
        border-radius: 3px;
        margin-top: 18px;
        padding: 20px 24px;
        cursor: pointer;
        &:hover {
            opacity: 0.8;
        }
        &:nth-child(2n+1) {
            float: right;
        }
        .l1 {
            .time {
                font-size: 16px;
                line-height: 23px;
                color: #000;
            }
            .type {
                width: 80px;
                height: 24px;
                background: rgba(71,128,247,0.1);
                border-radius: 16px;
                color: #4780F7;
                font-size: 12px;
                line-height: 24px;
                text-align: center;
                margin-left: 5px;
                transform: scale(0.8);
            }
            .status {
                font-size: 12px;
                font-weight: 500;
                float: right;
                margin-top: 2px;
                &::before {
                    content: "";
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 100%;
                    background: #ccc;
                    margin-right: 4px;
                }
                &.blue {
                    color: #4780F7;
                    &::before {
                        ackground: #4780F7;
                    }
                }
                &.green {
                    color: #6FC643;
                    &::before {
                        background: #6FC643;
                    }
                }
                &.red {
                    color: #F85C5C;
                    &::before {
                        background: #F85C5C;
                    }
                }
                &.gray {
                    color: #B2B2B2;
                    &::before {
                        background: #B2B2B2;
                    }
                }
            }
        }
        .l2 {
            position: relative;
            .addr {
                margin-top: 12px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                .pos {
                    font-size: 14px;
                    line-height: 21px;
                    color: #4A4A4A;
                }
                .addrIcon {
                    color: #4780F7;
                    font-size: 14px;
                    margin-right: 4px;
                }
                .toIcon {
                    color: #4A4A4A;
                    font-size: 12px;
                    margin: 0 -8px;
                }
            }
            .passenger {
                margin-top: 10px;
                font-size: 14px;
                color: #888888;
                font-weight: 400;
                line-height: 21px;
                .nameIcon {
                    color: #C9C9C9;
                    font-size: 14px;
                    margin-right: 4px;
                }
                .name {
                    margin-right: 5px;
                }
                .phone {
                    margin-right: 20px;
                }
            }
            .moreIcon {
                position: absolute;
                top: 50%;
                margin-top: -7px;
                right: 0;
                color: #989EB6;
                font-size: 12px;
            }
        }
    }
}
</style>
