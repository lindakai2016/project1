<template>
    <div class="orderPieCharts">
        <div class="pieRow">
            <div class="pieCard" v-if="chart1B">
                <h3 class="title">订单类型分布</h3>
                <ve-ring :data="chart1Data"></ve-ring>
            </div>
            <div class="pieCard" v-if="chart2B">
                <h3 class="title">订单费用分布</h3>
                <ve-ring :data="chart2Data"></ve-ring>
            </div>
            <div class="pieCard" v-if="chart3B">
                <h3 class="title">结算情况</h3>
                <ve-ring :data="chart3Data"></ve-ring>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["data"],
    computed: {
        chart1B() {
            return this.data && this.data.orderTypeView;
        },
        chart2B() {
            return this.data && this.data.orderPriceView;
        },
        chart3B() {
            return this.data && this.data.settleView;
        },
        chart1Data() {
            let columns = ["name", "rate"];
            let rows = this.data && this.data.orderTypeOverview && this.data.orderTypeOverview.list || [];
            return {columns, rows};
        },
        chart2Data() {
            let columns = ["name", "rate"];
            let rows = this.data && this.data.orderPriceOverview && this.data.orderPriceOverview.list || [];
            return {columns, rows};
        },
        chart3Data() {
            let columns = ["name", "rate"];
            let rows = this.data && this.data.settleOverview && this.data.settleOverview.list || [];
            return {columns, rows};
        }
    }
}
</script>

<style lang="scss" scoped>
.orderPieCharts {
    .pieRow {
        display: flex;
        .pieCard {
            background: #fff;
            width: calc(33.3% - 10px);
            padding: 20px 24px;
            margin-right: 15px;
            flex-shrink: 1;
            &:last-of-type {
                margin-right: 0;
            }
            .title {
                font-size: 16px;
                color: #000;
                font-weight: 600;
                line-height: 23px;
                margin-bottom: 20px;
            }
        }
    }
}
</style>
