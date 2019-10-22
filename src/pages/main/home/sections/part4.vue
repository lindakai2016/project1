<template>
    <div class="orderCharts">
        <h3 class="title">订单量及消费金额</h3>
        <ve-line :colors="colors" :legend="legend" :xAxis="xAxis" :yAxis="yAxis" :grid="grid" :tooltip="tooltip" :series="series"></ve-line>
    </div>
</template>

<script>
export default {
    props: ["data"],
    data() {
        return {
            grid: {
                left: 60,
                right: 80,
                bottom: 20,
                top: 80,
            },
            colors: ['#4780F7', '#EDAC4A'],
            xAxis: {
                splitLine: {
                    show: false,
                },
                type: "category",
                data: [],
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
            },
            yAxis: [
                {
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
                    name: "订车金额",
                    nameGap: 30,
                    nameTextStyle: {
                        fontSize: 14,
                        color: "#4A4A4A",
                        fontWeight: 600,
                    },
                    offset: 40,
                },
            ],
            legend: {
                icon: "roundRect",
            },
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
            series: [],
        }
    },
    watch: {
        data(val) {
            let data = val || [];
            let xData = data.map(e => e.date);
            let arr0 = data.map(e => e.orderNum);
            let arr1 = data.map(e => e.orderPrice);
            xData.length <= 0 && (xData = [0]);
            arr0.length <= 0 && (arr0 = [0]);
            arr1.length <= 0 && (arr1 = [0]);
            this.xAxis.data = xData;
            this.series = [
                {
                    name: "订单量",
                    type: "line",
                    yAxisIndex: 0,
                    data: arr0,
                },
                {
                    name: "订单金额",
                    type: "line",
                    yAxisIndex: 1,
                    data: arr1,
                },
            ]
        }
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
