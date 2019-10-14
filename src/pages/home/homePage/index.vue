<template>
    <div class="homePage">
        <banner class="sec1" :data="banData"></banner>
        <part2 class="sec2"></part2>
        <div class="filter">
            <DatePicker class="datePicker" type="daterange" placeholder="选择时间" clearable placement="bottom-end" v-model="date"></DatePicker>
            <selectGr class="dateSelect" v-model="dateSelect">
                <optionLi label="本周" :value="1" selected="1"></optionLi>
                <optionLi label="本月" :value="2"></optionLi>
                <optionLi label="本季" :value="3"></optionLi>
                <optionLi label="本年" :value="4"></optionLi>
            </selectGr>
            <button class="carBtn blue queryBtn" @click="query">查询</button>
        </div>
        <part3 class="sec3" :data="part3Data"></part3>
        <part4 class="sec4" v-if="part4B" :data="part4Data"></part4>
        <part5 class="sec5" v-if="part5B" :data="part5Data"></part5>
        <part6 class="sec6" :data="part6Data"></part6>
    </div>
</template>

<script>
import selectGr from "@/commonComponents/baseSelect";
import optionLi from "@/commonComponents/baseOption";
import banner from "./sections/banner";
import part2 from "./sections/part2";
import part3 from "./sections/part3";
import part4 from "./sections/part4";
import part5 from "./sections/part5";
import part6 from "./sections/part6";
import _ from "lodash";
// import testAccountOverview from "./testData/accountOverview";

export default {
    components: {
        selectGr,
        optionLi,
        banner,
        part2,
        part3,
        part4,
        part5,
        part6,
    },
    data() {
        return {
            banData: {},

            part2Data: {},

            date: [],
            dateSelect: 1,

            part3B: false,
            part3Data: {},

            part4B: false,
            part4Data: {},

            part5B: false,
            part5Data: {},

            part6Data: {},
        }
    },
    watch: {
        dateSelect: {
            immediate: true,
            handler: function(v) {
                if(v == 1) {
                    this.date = Date.curWeek();
                }
                if(v == 2) {
                    this.date = Date.curMonth();
                }
                if(v == 3) {
                    this.date = Date.curQuarter();
                }
                if(v == 4) {
                    this.date = Date.curYear();
                }
            }
        },
        date() {
            this.getAccountOverview();
        }
    },
    mounted() {
        this.getAccountOverview();
    },
    methods: {
        query() {
            this.getAccountOverview();
        },
        //账户统计信息
        getAccountOverview: _.debounce(function() {
            // let [s, d] = this.data || [];
            this.$api["accountOverview"]({

            }).then(res => {
                //let res = testAccountOverview;
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                let {accountView, accountOverview, orderView, orderOverview, userView, userOverview, ...rest} = res.data || {};
                this.part3B = accountView;
                this.part3Data = accountOverview;
                this.part4B = orderView;
                this.part4Data = orderOverview;
                this.part5B = userView;
                this.part5Data = userOverview;
                this.part6Data = rest;
            }).catch(err => err);
        }, 300),
    }
}
</script>

<style lang="scss" scoped>
.homePage {
    padding-bottom: 80px;
    .sec1 {
        margin-top: 25px;
    }
    .sec2 {
        margin-top: 23px;
    }
    .filter {
        margin-top: calc(27px + 48px - 40px);
        margin-bottom: calc(-27px + -48px);
        text-align: right;
        position: relative;
        z-index: 100;
        .datePicker {
            margin-right: 13px;
        }
        .dateSelect {
            width: 73px;
            margin-right: 8px;
        }
        .queryBtn {
            height: 38px;
            line-height: 38px;
            width: 73px;
            font-size: 12px;
        }
    }
    .sec3 {
        margin-top: 27px;
    }
    .sec4 {
        margin-top: 18px;
    }
    .sec5 {
        margin-top: 17px;
    }
    .sec6 {
        margin-top: 17px;
    }
}
</style>
