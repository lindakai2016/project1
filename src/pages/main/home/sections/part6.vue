<template>
    <div class="orderPieCharts">
        <div class="pieRow">
            <div class="pieCard">
                <h3 class="title">订单类型分布</h3>
                <ve-ring :data="chart1Data"  :settings="settings1" :tooltip="tooltip1" :extend="extend" height="220px" :judge-width="true"></ve-ring>
            </div>
            <div class="pieCard">
                <h3 class="title">订单费用分布</h3>
                <ve-ring :data="chart2Data"  :settings="settings2" :tooltip="tooltip2" :extend="extend" height="220px" :judge-width="true"></ve-ring>
            </div>
            <div class="pieCard" v-show="chart3B">
                <h3 class="title">结算情况</h3>
                <ve-ring :data="chart3Data"  :settings="settings3" :tooltip="tooltip1" :extend="extend" height="220px" :judge-width="true"></ve-ring>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["data"],
    data() {
        return {
            extend: {
                series: {
                    center: ['40%', '50%'],
                },
                color: ["#F4D458", "#E16C7D", "#72C87C", "#67C8CA", "#589EF8", "#5253C8"],
                legend: {
                    icon: "roundRect",
                    orient: "vertical",
                    right: 0,
                    y: "center",
                },
            },
            settings1: {
                radius: [65, 90],
                label: {
                    formatter: ['{a|0}', '{b|总订单}'].join('\n'),
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
                    }
                },
                itemStyle: {
                    borderWidth: 3,
                    borderColor: '#fff'
                },
            },
            settings2: {
                radius: [65, 90],
                label: {
                    formatter: ['{a|0}', '{b|总金额}'].join('\n'),
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
                    }
                },
                itemStyle: {
                    borderWidth: 3,
                    borderColor: '#fff'
                }
            },
            settings3: {
                radius: [65, 90],
                label: {
                    formatter: ['{a|0}', '{b|总订单}'].join('\n'),
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
                    }
                },
                itemStyle: {
                    borderWidth: 3,
                    borderColor: '#fff'
                }
            },
            tooltip1: {
                padding: 0,
                formatter: params => {
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
            }, 
            tooltip2: {
                padding: 0,
                formatter: params => {
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
            },
        }
    },
    watch: {
        data(val) {
            let chart1 = val && val.orderTypeOverview || {};
            let chart2 = val && val.orderPriceOverview || {};
            let chart3 = val && val.settleOverview || {};
            let fmt1 = [`{a|${chart1.total || 0}}`, '{b|总订单}'].join('\n');
            let fmt2 = [`{a|${chart2.total || 0}}`, '{b|总金额}'].join('\n');
            let fmt3 = [`{a|${chart3.total || 0}}`, '{b|总订单}'].join('\n');
            this.$set(this.settings1.label, "formatter", fmt1);
            this.$set(this.settings2.label, "formatter", fmt2);
            this.$set(this.settings3.label, "formatter", fmt3);
        },
    },
    computed: {
        chart3B() {
            return this.data && this.data.settleView;
        },
        chart1Data() {
            let columns = ["name", "value"];
            let rows = this.data && this.data.orderTypeOverview && this.data.orderTypeOverview.list || [];
            return {columns, rows};
        },
        chart2Data() {
            let columns = ["name", "value"];
            let rows = this.data && this.data.orderPriceOverview && this.data.orderPriceOverview.list || [];
            return {columns, rows};
        },
        chart3Data() {
            let columns = ["name", "value"];
            let rows = this.data && this.data.settleOverview && this.data.settleOverview.list || [];
            return {columns, rows};
        }
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
