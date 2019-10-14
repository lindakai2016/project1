<template>
    <!--接站-->
    <div class="cityCarType bookForm">
        <div class="errInfo" :class="{show: formErr}">
            <i class="iconfont icon-login_icon_error1"></i>{{formErr}}
        </div>
        <p class="fi">
            <label class="lb needed">出发地</label>
            <poiInput class="rval v_sPos" :err="errParam=='poiItem'" @change="poiChange"></poiInput>
        </p>
         <p class="fi">
            <label class="lb needed">用车时间</label>
            <DatePicker 
                class="rval v_useTime ivu-datepick-h35" 
                :class="{err: errParam == 'jcDate'}"
                type="datetime" 
                placeholder="选择日期" 
                :editable="false"
                v-model="jcDate"
            ></DatePicker>
        </p>
        <p class="fi">
            <label class="lb needed">包车天数</label>
            <ctTimeInput class="rval v_bcts" :err="errParam=='pgDay'" v-model="pgDay" @blur="pgDayBlur"></ctTimeInput>
        </p>
        <p class="fi">
            <label class="lb needed">乘车人数</label>
            <inputGr class="rval v_personNum" :err="errParam=='rideNum'" v-model="rideNum" type="number" placeholder="请输入乘车人数"></inputGr>
        </p>

        <p class="fi">
            <label class="lb needed">行程说明</label>
            <ctDescInput class="rval v_xcsm" :err="errParam=='ctDesc'" v-model="ctDesc"></ctDescInput>
        </p>

         <p class="fi">
            <label class="lb needed">联系人手机号</label>
            <userSelect class="rval v_userPhone" :err="errParam=='userPhone'" v-model="userPhone" @chooseUser="chooseUser"></userSelect>
        </p>
         <p class="fi">
            <label class="lb">联系人姓名</label>
            <inputGr class="rval v_userName" :err="errParam=='userName'" v-model="userName" placeholder="请输入联系人姓名"></inputGr>
        </p>
        <p class="fi">
            <label class="lb">用车要求</label>
            <descInput class="rval v_odDesc" v-model="remark"></descInput>
        </p>
        <button class="carBtn blue submitBtn" :class="{gray: !canSubmit}" @click="submitOrder">确认订单</button>
        <div class="smTip">请填写所有*必填信息</div>
    </div>
</template>

<script>
import inputGr from "../../inheritComponent/Input";
import poiInput from "../../inheritComponent/poiInput";
import descInput from "../../inheritComponent/descInput";
import userSelect from "../../inheritComponent/userSelect";
import ctTimeInput from "../../inheritComponent/ctTimeInput";
import ctDescInput from "../../inheritComponent/ctDescInput";
import moment from 'moment';
import _ from "lodash";

export default {
    components: {
        inputGr,
        poiInput,
        descInput,
        userSelect,
        ctTimeInput,
        ctDescInput,
    },
    data () {
        return {
            jcDate: new Date(),
            poiItem: {},

            pgDay: "",
            ctDesc: "",
            rideNum: "",
            userPhone: "",
            userName: "",
            remark: "",

            formErr: "",
            errParam: "",
        }
    },
    computed: {
        canSubmit() {
            return this.checkParam();
        }
    },
    mounted() {
        
    },
    methods: {
        poiChange(item) {
            this.poiItem = item;
        },
        pgDayBlur() {
            if(this.pgDay == "") {
                return;
            }
            if(this.pgDay < 1) {
                this.pgDay = 0.5;
                return;
            }
            this.pgDay = ~~this.pgDay;
        },
        chooseUser({contactName, contactPhone}) {
            this.userName = contactName;
            this.userPhone = contactPhone;
        },
        checkParam() {
            if(!this.poiItem.name) {
                this.formErr = "出发地点不能为空";
                this.errParam = "poiItem"
                return false;
            }
            if(!this.jcDate) {
                this.formErr = "用车时间不能为空";
                this.errParam = "jcDate"
                return false;
            }
            if(!this.pgDay) {
                this.formErr = "包车天数不能为空";
                this.errParam = "pgDay";
                return false;
            }
            if(!this.rideNum){
                this.formErr = "乘车人数不为空";
                this.errParam = "rideNum"
                return false;
            } 
            if(!this.rideNum.validRideNum()) {
                this.formErr = "乘车人数限制1-10";
                this.errParam = "rideNum"
                return false;
            }
            if(!this.ctDesc) {
                this.formErr = "包车行程说明不能为空";
                this.errParam = "ctDesc";
                return false;
            }
            if(!this.userPhone) {
                this.formErr = "联系人手机号不为空";
                this.errParam = "userPhone"
                return false;
            }
            if(!this.userPhone.validPhone()) {
                this.formErr = "手机号码不正确";
                this.errParam = "userPhone"
                return false;
            }
            if(this.userName && !this.userName.validName()) {
                this.formErr = "姓名为中文字符，长度2-4";
                this.errParam = "userName"
                return false;
            }
            this.formErr = "";
            this.errParam = "";
            return true;
        },
        submitOrder: _.debounce(function() {
            let {userPhone, userName, rideNum, remark, ctDesc, pgDay} = this;
            let cityId = this.poiItem.cityId;
            let svTime = this.jcDate && moment(this.jcDate).format("YYYY-MM-DD HH:mm:ss");
            let sPos = this.poiItem.name;
            let ePos = "";
            this.$api["createOrder"]({
                city_id:            cityId,
                user_phone:         userPhone,
                user_name:          userName,
                ride_num:           rideNum,
                service_time:       svTime,
                service_type:       0,
                start_position:     sPos,
                end_position:       ePos,
                type:               3,
                remark:             remark,
                service_day:        pgDay,
                route_desc:         ctDesc,
            }).then(res => {
                if(res.code != 100200) {
                    return;
                }
                this.$message.success("下单成功");
                this.$router.push("/order");
            }).catch(err => err);
        }, 300),
    }
}
</script>

<style lang="scss" scoped>
@import "../../scss/bookForm.scss";
.cityCarType {
    
}
</style>