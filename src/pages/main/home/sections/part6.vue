<template>
    <div class="orderPieCharts">
        <div class="pieRow">
            <div class="pieCard">
                <h3 class="title">订单类型分布</h3>
                <div id="p6Chart1" style="height: 220px"></div>
            </div>
            <div class="pieCard">
                <h3 class="title">订单费用分布</h3>
                <div id="p6Chart2" style="height: 220px"></div>
            </div>
            <div class="pieCard" v-show="chart3B">
                <h3 class="title">结算情况</h3>
                <div id="p6Chart3" style="height: 220px"></div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from "lodash";

let options = {
    series: [{
        type: 'pie',
        center: ['40%', '50%'],
        radius: [65, 90],
        hoverOffset: 5,
        avoidLabelOverlap: false,
        label: { 
            normal: {
                formatter: "",
                position: "center",
                rich: {
                    a: {
                        fontSize: 20,
                        color: "#000",
                        lineHeight: 30,
                    },
                    b: {
                        fontSize: 14,
                        color: "#888",
                    }
                },
            }
        },
        itemStyle: {
            borderWidth: 3,
            borderColor: '#fff',
        },
    }],
    color: ["#F4D458", "#E16C7D", "#72C87C", "#67C8CA", "#589EF8", "#5253C8"],
    legend: {
        icon: "roundRect",
        orient: "vertical",
        right: 0,
        y: "center",
        data: [],
        padding: 0,
    },
    tooltip: {
        padding: 0,
    }
};

export default {
    name: "homepart6",
    props: ["data"],
    data() {
        return {
            chart1: null,
            chart2: null,
            chart3: null,
            chartResize: () => {
                this.chart1.resize();
                this.chart2.resize();
                this.chart3.resize();
            },
            tooltipFm1: params => {
                return `<div class="tooltip">
                            <div class="tlRow r1">
                                <label class="lb">${params.name}</label>
                                <span class="val">${~~params.value}单</span>
                            </div> 
                            <div class="tlRow r2">
                                <label class="lb">占比</label>
                                <span class="val">${params.percent}%</span>
                            </div>
                        </div>`;
            },
            tooltipFm2: params => {
                return `<div class="tooltip">
                            <div class="tlRow r1">
                                <label class="lb">${params.name}</label>
                                <span class="val">${~~params.value}元</span>
                            </div> 
                            <div class="tlRow r2">
                                <label class="lb">占比</label>
                                <span class="val">${params.percent}%</span>
                            </div>
                        </div>`;
            },
        }
    },
    watch: {
        data: {
            immediate: true,
            handler(val) {
                val = _.cloneDeep(val) || {};
                let chart1 = val.orderTypeOverview || {};
                let chart2 = val.orderPriceOverview || {};
                let chart3 = val.settleOverview || {};

                let fmt1 = [`{a|${chart1.total || 0}}`, '{b|总订单}'].join('\n');
                let fmt2 = [`{a|${chart2.total || 0}}`, '{b|总金额}'].join('\n');
                let fmt3 = [`{a|${chart3.total || 0}}`, '{b|总订单}'].join('\n');

                let chart1Data = chart1.list || [];
                let chart2Data = chart2.list || [];
                let chart3Data = chart3.list || [];

                let legend1 = chart1Data.map(e => e.name);
                let legend2 = chart2Data.map(e => e.name);
                let legend3 = chart3Data.map(e => e.name);
               
                this.chart1 && this.chart1.setOption({
                    series: [{
                        label: {normal: {formatter: fmt1}},
                        data: chart1Data,
                    }],
                    legend: {
                        data: legend1
                    }
                });
                
                this.chart2 && this.chart2.setOption({
                    series: [{
                        label: {normal: {formatter: fmt2}},
                        data: chart2Data,
                    }],
                    legend: {
                        data: legend2
                    }
                });
                this.chart3 && this.chart3.setOption({
                    series: [{
                        label: {normal: {formatter: fmt3}},
                        data: chart3Data,
                    }],
                    legend: {
                        data: legend3
                    }
                });   

                this.$nextTick(() => {
                    this.chart1 && this.chart1.resize();
                    this.chart2 && this.chart2.resize();
                    this.chart3 && this.chart3.resize();
                })
            }
        },
    },
    computed: {
        chart3B() {
            return this.data && this.data.settleView;
        }
    },
    mounted() {
        this.chart1 = echarts.init(document.querySelector("#p6Chart1"));
        this.chart1.setOption(options);
        this.chart1.setOption({
            tooltip: {formatter: this.tooltipFm1}
        });
        
        this.chart2 = echarts.init(document.querySelector("#p6Chart2"));
        this.chart2.setOption(options);
        this.chart2.setOption({
            tooltip: {formatter: this.tooltipFm2}
        });
       
        this.chart3 = echarts.init(document.querySelector("#p6Chart3"));
        this.chart3.setOption(options);
        this.chart3.setOption({
            tooltip: {formatter: this.tooltipFm1}
        });
       
        window.addEventListener("resize", this.chartResize);
    },
    beforeDestroy() {
        this.chart1.dispose();
        this.chart1 = null;

        this.chart2.dispose();
        this.chart2 = null;

        this.chart3.dispose();
        this.chart3 = null;

        window.removeEventListener("resize", this.chartResize);
    }
}
</script>

<style lang="scss">
.orderPieCharts {
    .tooltip {
        background: #fff;
        background:rgba(255,255,255,1);
        box-shadow: 0px 2px 8px 0px rgba(215,215,215,1);
        border-radius: 3px;
        padding: 12px;
        overflow: hidden;
        .tlRow {
            color: #4a4a4a;
            font-size: 12px;
            &.r1 {
                &::before {
                    background: #4780F7;
                }
            }
            &.r2 {
                &::before {
                    background: #EDAC4A;
                }
                margin-top: 4px;
            }
            .lb {
                display: inline-block;
                width: 55px;
            }
        }
    }
}
</style>

<style lang="scss" scoped>
.orderPieCharts {
    .pieRow {
        display: flex;
        .pieCard {
            background: #fff;
            width: 30%;
            padding: 20px 24px;
            margin-right: 15px;
            flex-grow: 1;
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
