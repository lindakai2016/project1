<template>
    <div class="orderChanrts">
        <h3 class="title">订单量及消费金额</h3>
        <ve-line :data="chartData"></ve-line>
    </div>
</template>

<script>
export default {
    props: ["data"],
    computed: {
        chartData() {
            let columns = ['日期', '订单量', '订单金额'];
            let rows = [];
            (this.data || []).map(e => {
                rows.push({
                    "日期":     e.date,
                    "订单量":   e.orderNum,
                    "订单金额": e.orderPrice
                });
            });
            return {columns, rows};
        }
    }
}
</script>

<style lang="scss" scoped>
.orderChanrts {
    padding: 20px 24px;
    background: #fff;
    .title {
        font-size: 16px;
        color: #000;
        font-weight: 600;
        line-height: 23px;
    }
    
}
</style>
