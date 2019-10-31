<template>
    <div class="homePage">
        <banner class="sec1" :data="banData"></banner>
        <part2 class="sec2"></part2>
        <div class="filter">
            <DatePicker class="datePicker" :options="datePickerOption" type="daterange" placeholder="选择时间" placement="bottom-end" :clearable="false" v-model="date"></DatePicker>
        </div>
        <part3 class="sec3" :data="part3Data"></part3>
        <part4 class="sec4" :data="part4Data"></part4>
        <part5 class="sec5" :data="part5Data"></part5>
        <part6 class="sec6" :data="part6Data"></part6>
    </div>
</template>

<script>
import banner from "./sections/banner";
import part2 from "./sections/part2";
import part3 from "./sections/part3";
import part4 from "./sections/part4";
import part5 from "./sections/part5";
import part6 from "./sections/part6";
import _ from "lodash";
import moment from "moment";

export default {
    name: "home",
    components: {
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

            date: Date.curMonth(),
            datePickerOption: {
				shortcuts: [
					{
						text: '本周',
						value () {
							return Date.curWeek();
						}
					},
					{
						text: '本月',
						value () {
							return Date.curMonth();
						}
					},
					{
						text: '本季度',
						value () {
							return Date.curQuarter();
						}
					},
					{
						text: '本年',
						value () {
							return Date.curYear();
						}
					},
				]
			},

            part3Data: {},
            part4Data: [],
            part5Data: [],
            part6Data: {},
        }
    },
    watch: {
        date() {
            this.getAccountOverview();
        }
    },
    mounted() {
        this.getAccountOverview();
    },
    methods: {
        //账户统计信息
        getAccountOverview: _.debounce(function() {
            let [s, d] = this.date || [];
            let sD = s && moment(s).format('YYYY-MM-DD') + " 00:00:00" || "";
            let eD = d && moment(d).format('YYYY-MM-DD') + " 23:59:59" || "";

            this.$api["accountOverview"]({
                start_time:     sD,
                end_time:       eD,
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                let {accountOverview, orderOverview, userOverview, ...rest} = res.data || {};
               
                this.part3Data = accountOverview || {};
                this.part4Data = orderOverview || [];
                this.part5Data = userOverview || [];
                this.part6Data = rest || {};
            }).catch(err => err);
        }, 300),
    }
}
</script>

<style lang="scss" scoped>
.homePage {
    padding-bottom: 20px;
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
