<template>
    <div class="orderCharts">
        <h3 class="title">订单量及消费金额</h3>
        <!-- <ve-line :colors="colors" :legend="legend" :xAxis="xAxis" :yAxis="yAxis" :grid="grid" :tooltip="tooltip" :series="series"></ve-line> -->
        <div id="p4Chart" style="height: 400px;"></div>
    </div>
</template>

<script>
import _ from "lodash";

let options = {
    tooltip: {
        trigger: "axis",
        padding: 0,
        formatter: params => {
            return `<div class="tooltip">
                        <div class="tlRow r1 ${!params[0] && "hide"}">
                            <label class="lb">${params[0] && params[0].seriesName}</label>
                            <span class="val">${params[0] && params[0].data}</span>
                        </div> 
                        <div class="tlRow r2 ${!params[1] && "hide"}">
                            <label class="lb">${params[1] && params[1].seriesName}</label>
                            <span class="val">${params[1] && params[1].data}</span>
                        </div>
                    </div>`;
        },
    },
    legend: {
        icon: "roundRect",
        data: [{name: "订单量"}, {name: "订单金额"}],
    },
    color: ['#4780F7', '#EDAC4A'],
    grid: {
        left: 60,
        right: 80,
        bottom: 20,
        top: 80,
    },
    xAxis: {
        splitLine: {
            show: false,
        },
        type: "category",
        axisLine: {
            show: true,
            lineStyle: {
                width: 1,
                color: "#4780F7",
            }
        },
        axisLabel: {
            color: "#888",
            margin: 20,
        },
        axisTick: {
            show: true,
            alignWithLabel: true,
            lineStyle: {
                width: 2,
            }
        },
        data: [],
    },
    yAxis: [
        {
            axisLine: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: "#888",
                margin: 0,
            },
            name: "订单量",
            nameGap: 30,
            nameTextStyle: {
                fontSize: 14,
                color: "#4A4A4A",
                fontWeight: 600,
            },
            offset: 40,
        },
        {
            axisLine: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: "#888",
                margin: 0,
            },
            name: "订单金额",
            nameGap: 30,
            nameTextStyle: {
                fontSize: 14,
                color: "#4A4A4A",
                fontWeight: 600,
            },
            offset: 40,
        },
    ],
    series: [
        {
            name: "订单量",
            type: "line",
            yAxisIndex: 0,
            smooth: true,
            data: [],
        },
        {
            name: "订单金额",
            type: "line",
            yAxisIndex: 1,
            smooth: true,
            data: [],
        },
    ],
};

export default {
    name: "homepart4",
    props: ["data"],
    data() {
        return {
            chart: null,
            chartResize: () => this.chart.resize(),
        }
    },
    watch: {
        data: {
            immediate: true,
            handler(val) {
                let data = _.cloneDeep(val) || [];
                let xData = data.map(e => e.date);
                let arr0 = data.map(e => e.orderNum);
                let arr1 = data.map(e => e.orderPrice);
                this.chart && this.chart.setOption({
                    xAxis: {data: xData},
                    series: [{data: arr0}, {data: arr1}]
                });
            }
        }
    },
    mounted() {
        this.chart = window.echarts.init(document.querySelector("#p4Chart"));
        this.chart.setOption(options);
        window.addEventListener("resize", this.chartResize);
    },
    beforeDestroy() {
        this.chart.dispose();
        this.chart = null;
        window.removeEventListener("resize", this.chartResize);
    },
}
</script>

<style lang="scss">
.orderCharts {
    .tooltip {
        background: #fff;
        background:rgba(255,255,255,1);
        box-shadow: 0px 2px 8px 0px rgba(215,215,215,1);
        border-radius: 3px;
        padding: 12px;
        overflow: hidden;
        .tlRow {
            &.hide {
                display: none;
            }
            &::before {
                content: "";
                display: inline-block;
                width: 7px;
                height: 7px;
                border-radius: 100%;
                margin-right: 3px;
            }
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
                width: 70px;
            }
        }
    }
}
</style>

<style lang="scss" scoped>
.orderCharts {
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
