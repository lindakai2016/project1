<template>
    <!--航班号输入框-->
    <div class="inputGr" :class="{focus: inFocus, err: err}" v-clickout="clickout">
        <input class="input" type="text" placeholder="搜索航班号" v-model="flyKey" @input="input" @click="focus" ref="input" v-show="showInput" @dragstart.prevent>
        <div class="aipInfo" v-show="showApInfo" @click="clickAipInfo">
            <div class="big">{{flyItem.depTerm}}</div>
            <div class="small">{{flyItem.depCityName || "--"}}-{{flyItem.arrCityName || "--"}} {{flyItem.flyNo || "--"}} {{flyItem.sDateEx || "--"}}起飞</div>
        </div>
        <div class="apul" v-if="showApUl">
            <div class="apli" v-for="(item, i) in flyList" :key="i" @click="chooseFly(item)">
                <div class="l1">
                    <span class="date">{{item.sDate || "--"}}</span>
                    <span class="num">{{item.flyNo || "--"}}</span>
                </div>
                <div class="l2">
                    <span class="spos">{{item.depCityName || "--"}}</span>
                    <i class="iconfont icon-img_arrow_right toIc"></i>
                    <span class="epos">{{item.arrCityName || "--"}}</span>
                </div>
                <div class="l3">
                    <span class="stime">{{item.sTime || "--"}}</span>
                    <span class="etime">{{item.eTime || "--"}}</span>
                </div>
            </div>
            <div class="empty" v-if="flyList.length <= 0">无匹配结果</div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
// import testQueryFly from "../testData/queryFly";

export default {
    props: ["date", "err"],
    data() {
        return {
            inFocus: 0,

            flyKey: "",
            flyList: null,
            flyItem: {},
        }
    },
    computed: {
        showInput() {
            return this.inFocus || !this.flyItem || !this.flyItem.flyNo;
        },
        showApInfo() {
            return !this.inFocus && this.flyItem && this.flyItem.flyNo;
        },
        showApUl() {
            return this.inFocus && this.flyList;
        }, 
        dateEx() {
            return this.date && moment(this.date).format("YYYY-MM-DD");
        }
    },
    watch: {
        date() {
            this.reset();
        },
        inFocus(val) {
            !val && (this.flyKey = this.flyItem.flyNo);
        }
    },
    methods: {
        clickout() {
            this.inFocus = false;
            this.flyKey = this.flyItem.flyNo;
        },
        focus() {
            this.inFocus = true;
        }, 
        input() {
            this.queryFly();
            this.inFocus = true;
        },
        clickAipInfo() {
            this.inFocus = true;
            this.$nextTick(function() {
                this.$refs.input.focus();
            });
        },
        chooseFly(item) {
            this.flyItem = item;
            this.inFocus = false;
            // 获取机场经纬度
            this.$api["lnglatFromFly"]({
                depot_code: item.arrCode,
            }).then(res => {
                if(res.code != 100200) {
                    return;
                }
                let {longitude, latitude} = res.data || {};
                item.longitude = longitude;
                item.latitude = latitude;
                this.$emit("lnglat", item);
            }).catch(err => err);
            this.$emit("change", item);
        },
        // 查询航班号
        queryFly: _.debounce(function() {
            let key = this.flyKey;
            let date = this.date && moment(this.date).format('YYYY-MM-DD')|| "";
            this.$api["flyQuery"]({
                fly_date:   date,
                fly_no:     key,
            }).then(res => {
                if(res.code != 100200) {
                    return;
                }
                let list = res.data || [];
                list.map(e => {
                    let sDate = e.depPlanTime && moment(e.depPlanTime).format("YYYY-MM-DD");
                    let eDate = e.arrPlanTime && moment(e.arrPlanTime).format("YYYY-MM-DD");

                    e.sDate = sDate;
                    e.sDateEx = e.depPlanTime && moment(e.depPlanTime).format("MM月DD日 HH:mm");
                    e.sTime = e.depPlanTime && moment(e.depPlanTime).format("HH:mm");
                    e.eTime = e.arrPlanTime && moment(e.arrPlanTime).format("DD日 HH:mm");

                    if(sDate && eDate) {
                        let n = new Date(eDate) - new Date(sDate);
                        if(n <= 0) {
                            e.eTime = e.eTime && e.eTime.slice(4);
                        }else if(n <= 24 * 60 * 60 * 1000){
                            e.eTime = e.eTime && ("次日 " + e.eTime.slice(4));
                        }
                    }
                });
                this.flyList = list;
            }).catch(err => err);
        }, 300),
        reset() {
            this.flyKey = "";
            this.flyList = null,
            this.flyItem = {};
        }
    }
}
</script>

<style lang="scss" scoped>
.inputGr {
    min-height: 35px;
    line-height: 33px;
    border-radius: 3px;
    border: 1px solid rgba(53,65,79,0.25);
    display: flex;
    align-items: center;
    position: relative;
    &.err {
        border-color: #F85C5C;
    }
    &.focus {
        border-color: #4780F7;
        .input::placeholder {
            color: transparent;
        }
    }
    .input {
        border-radius: 3px;
        padding: 0 17px;
        font-size: 13px;
        width: 100%;
        height: 100%;
        &::placeholder {
            color: #E5E5E5;
        }
    }
    .aipInfo {
        width: 100%;
        padding: 8px 16px;
        cursor: text;
        .big {
            font-size: 14px;
            color: #000;
            font-weight: 600;
            line-height: 20px;
        }
        .small {
            font-size: 12px;
            color: #888;
            line-height: 17px;
            margin-top: 4px;
        }
    }
    .apul {
        position: absolute;
        top: calc(100% + 3px);
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        background: #fff;
        width: calc(100% + 2px);
        border: 1px solid rgba(53,65,79,0.25);
        border-radius: 3px;
        box-shadow: 0px 2px 8px 0px rgba(215,215,215,1);
        max-height: 331px;
        overflow: hidden auto;
        &::-webkit-scrollbar {
            width: 5px;
        }
        &::-webkit-scrollbar-thumb {
            background: #D8D8D8;
        }
        .apli {
            margin: 5px 0;
            padding: 5px 24px;
            cursor: pointer;
            &:hover {
                background: #F9F9FC;
            }
            .l1 {
                font-size: 13px;
                line-height: 17px;
                color: #4A4A4A;
                .num {
                    float: right;
                }
            }
            .l2 {
                line-height: 24px;
                font-size: 18px;
                color: #000;
                margin: 4px 0;
                position: relative;
                .spos {
                    font-weight: 600;
                }
                .epos {
                    font-weight: 600;
                    float: right;
                }
                .toIc {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 14px;
                }
            }
            .l3 {
                font-size: 13px;
                line-height: 17px;
                color: #4A4A4A;
                .etime {
                    float: right;
                }
            }
        }
        .empty {
            font-size: 12px;
            color: #888;
            padding: 5px 16px;
            .sm {
                font-size: 12px;
            }
        }
    }
    
}
</style>
