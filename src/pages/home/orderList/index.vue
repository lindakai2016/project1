<template>
    <div class="orderList">
        <h3 class="title">近期订单</h3>
        <div v-if="pgInit">
            <div class="filter">
                <DatePicker class="datePicker" type="daterange" placeholder="订单时间" clearable v-model="date"></DatePicker>
                <srchInput class="odSearch" placeholder="订单号/用车城市/下单人/乘客姓名/电话" @search="filterChange" v-model="srchTxt"></srchInput>
                <odSelect class="odSel" @change="odSelChange"></odSelect>
            </div>
            <odList :data="orderList" @update="filterChange"></odList>
            <pageNavi :total="total" :page="page" @pageChange="pageChange" @sizeChange="pageSizeChange" v-if="total > 0"></pageNavi>
        </div>
    </div>
</template>

<script>
import odSelect from "./inheritComponent/odSelect";
import srchInput from "./inheritComponent/srchInput";
import odList from "./sections/orders";
import pageNavi from "@/commonComponents/pageNavi";
import moment from "moment";
import _ from "lodash";
// import testOrderList from "./testData/orderList";

export default {
    components: {
        odSelect,
        srchInput,
        odList,
        pageNavi
    },
    data () {
        return {
            date: [],
            srchTxt: "",

            status: "",
            type: "",
            sett: "",

            orderList: [],

            total: 0,
            page: 1,
            pageSize: 10,

            pgInit: 0,
        }
    },
    computed: {
        
    },
    watch: {
        date() {
            this.filterChange();
        },
        srchTxt() {
            this.filterChange();
        },
    },
    mounted() {
        this.pgInit = 0;
        this.getOrderList();
    },
    methods: {
        odSelChange(status, type, sett) {
            this.status = status;
            this.type = type;
            this.sett = sett;
            this.filterChange();
        },
        filterChange() {
            this.page = 1;
            this.getOrderList();
        },
        pageChange(n) {
            this.page = n;
            this.getOrderList();
        },
        pageSizeChange(n) {
            this.page = 1;
            this.pageSize = n;
            this.getOrderList();
        },
        getOrderList: _.debounce(function() {
            let {page, pageSize, status, type, sett, srchTxt} = this;
            let [s, d] = this.date || [];
            let sD = s && moment(s).format('YYYY-MM-DD') + " 00:00:00" || "";
            let eD = d && moment(d).format('YYYY-MM-DD') + " 23:59:59" || "";

            this.$api["orderList"]({
                order_status:   status,
                service_type:   type,
                settle_status:  sett,
                user_keyword:   srchTxt,
                start_time:     sD,
                end_time:       eD,
                page_index:     page,
                page_size:      pageSize,
            }).then(res => {
                this.pgInit = 1;
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                let {count, orderList} = res.data || [];
                this.orderList = orderList || [];
                this.total = count;
            }).catch(err => {
                console.log(err);
                this.pgInit = 1;
            });
        }, 300),
    }
}
</script>

<style lang="scss" scoped>
.orderList {
    padding: 27px 0 80px 0;
    .title {
        font-weight: 600;
        font-size: 16px;
        line-height: 23px;
        color: #000;
    }
    .filter {
        margin-top: -23px;
        display: flex;
        justify-content: flex-end;
        .datePicker {
            margin-right: 12px;
            box-shadow:0px 2px 3px 0px rgba(0,0,0,0.04);
        }
        .odSearch {
            width: 314px;
            margin-right: 12px;
            box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.04);
        }
    }
}
</style>
