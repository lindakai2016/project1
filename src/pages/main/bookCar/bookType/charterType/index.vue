<template>
    <!--接站-->
    <div class="cityCarType bookForm">
        <div class="errInfo" :class="{show: formErr}">
            <i class="iconfont icon-login_icon_error1"></i>{{formErr}}
        </div>
        <p class="fi">
            <label class="lb needed">出发地</label>
            <poiInput class="rval v_sPos" :err="poiItemErr" :cityCode="sCtCode" :item="poiItem" @change="poiChange" @blur="poiItemBlur"></poiInput>
        </p>
        <p class="fi">
            <label class="lb needed">用车时间</label>
            <DatePicker 
                class="rval v_useDate ivu-datepick-h35" 
                :class="{err: jcDateErr}"
                :options="datePickerOption"
                type="date"
                placeholder="选择日期"
                :editable="false"
                v-model="jcDate"
            ></DatePicker>
            <TimePicker 
                format="HH:mm"
                class="rval v_useTime ivu-datepick-h35"
                :class="{err: jcTimeErr}"
                type="time"
                placeholder="选择日期"
                :editable="false"
                :steps="[1,10]"
                v-model="jcTime"
                confirm
                :disabled-hours="disabledHours"
                :disabled-minutes="disabledMinutes"
                @on-change="onTimerPickerChange"
                hide-disabled-options
            ></TimePicker>
        </p>
        <p class="fi">
            <label class="lb needed">包车天数</label>
            <ctTimeInput class="rval v_bcts" :err="pgDayErr" v-model="pgDay" @blur="pgDayBlur"></ctTimeInput>
        </p>
        <p class="fi">
            <label class="lb needed">乘车人数</label>
            <inputGr class="rval v_personNum" :err="rideNumErr" v-model="rideNum" type="number" placeholder="请输入乘车人数"></inputGr>
        </p>

        <p class="fi">
            <label class="lb">行程说明</label>
            <ctDescInput class="rval v_xcsm" v-model="ctDesc"></ctDescInput>
        </p>

         <p class="fi">
            <label class="lb needed">联系人手机号</label>
            <userSelect class="rval v_userPhone" :err="userPhoneErr" v-model="userPhone" @chooseUser="chooseUser" @blur="checkUserPhone(1)"></userSelect>
        </p>
         <p class="fi">
            <label class="lb">联系人姓名</label>
            <inputGr class="rval v_userName" v-model="userName" placeholder="请输入联系人姓名"></inputGr>
        </p>
        <p class="fi">
            <label class="lb">用车要求</label>
            <descInput class="rval v_odDesc" v-model="remark"></descInput>
        </p>
        <button class="carBtn blue submitBtn" :class="{gray: !canSubmit}" @click="createOrderX" v-if="!edit">确认订单</button>
        <button class="carBtn blue submitBtn" :class="{gray: !canSubmit}" @click="updateOrderX" v-if="edit">修改订单</button>
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
    name: "chartType",
    props: ["odItem"],
    components: {
        inputGr,
        poiInput,
        descInput,
        userSelect,
        ctTimeInput,
        ctDescInput,
    },
    inject: ["createOrder", "updateOrder", "cityQuery"],
    data () {
        return {
            jcDate: "",
            jcTime: "",
             datePickerOption: {
                disabledDate (date) {
                    return date && date.valueOf() < new Date().setHours(0, 0, 0, 0);
                }
            },
            disabledHours: [],
            disabledMinutes: [],

            poiItem: {},

            pgDay: "",
            ctDesc: "",
            rideNum: "1",
            userPhone: "",
            userName: "",
            remark: "",

            poiItemErr: "",
            jcDateErr: "",
            jcTimeErr: "",
            rideNumErr: "",
            userPhoneErr: "",
            pgDayErr: "",

            edit: 0,
            sCtCode: "",    
        }
    },
    computed: {
        formErr() {
            return this.poiItemErr || this.jcDateErr || this.jcTimeErr || this.pgDayErr || this.rideNumErr || this.userPhoneErr || "";
        },
        canSubmit() {
            let bol = this.rideNum && this.rideNum.validRideNum() && this.userPhone && this.userPhone.validPhone() && this.jcDate && this.jcTime;
            bol = bol && this.poiItem && this.poiItem.name && this.pgDay;
            return bol;
        }
    },
    watch: {
        odItem: {
            immediate: true,
            handler(order) {
                if(order) {
                    this.rideNum = order.rideNum + "";
                    this.userPhone = order.userPhone;
                    this.userName = order.userName;
                    this.remark = order.remark;
                    this.jcDate = order.serviceTime && new Date(order.serviceTime);
                    this.jcTime = this.jcDate && moment(this.jcDate).format("HH:mm");

                    this.pgDay = order.serviceDay;
                    this.ctDesc = order.routeDesc;

                    let sPos = order.startPosition;
                    let sLng = order.startLongitude;
                    let sLat = order.startLatitude;
                  
                    this.poiItem = {
                        name:   sPos,
                        location: {lng: sLng, lat: sLat}
                    };
                    this.cityQuery(sLng, sLat).then(res => {
                        this.sCtCode = res.citycode;
                    });
                    this.edit = 1;
                }
            }  
        },
        pgDay() {
            this.checkPgDay();
        },
        jcDate() {
            this.checkJcDate();
            this.disableJcTimeOnJcDate();
        },
        jcTime() {
            this.checkJcTime();
        },
        rideNum() {
            this.checkRideNum();
        },
        userPhone() {
            this.checkUserPhone();
            this.userPhone && this.userPhone.length >= 11 && this.checkUserPhone(1);
        }
    },
    mounted() {
        
    },
    methods: {
         disableJcTimeOnJcDate() {
            let today = moment().format("YYYYMMDD");
            let jcDate = this.jcDate && moment(this.jcDate).format("YYYYMMDD") || "";
            if(jcDate == today) {
                // 当前时间往后推10分钟
                let t = moment().add(5, "m");
                t = t.add(10 - t.minutes() % 10, "m").format("HH:mm");

                let tH = Number(t.slice(0, 2));
                let tM = Number(t.slice(3));
                this.disabledHours = Array.range(0, tH - 1);

                if(!this.jcTime || this.jcTime < t) {
                    this.jcTime = t;
                }
                let h = Number(this.jcTime.slice(0, 2));
                if(h == tH) {
                    this.disabledMinutes = Array.range(0, tM - 1);
                }else {
                    this.disabledMinutes = [];
                }
            }else {
                this.disabledHours = [];
                this.disabledMinutes = [];
                !this.jcTime && (this.jcTime = "08:00");
            }
        },
        onTimerPickerChange(val) {
            let today = moment().format("YYYYMMDD");
            let jcDate = this.jcDate && moment(this.jcDate).format("YYYYMMDD") || "";
            if(jcDate == today) {
                // 当前时间往后推10分钟
                let t = moment().add(5, "m");
                t = t.add(10 - t.minutes() % 10, "m").format("HH:mm");

                let tH = Number(t.slice(0, 2));
                let tM = Number(t.slice(3));
                this.disabledHours = Array.range(0, tH - 1);

                if(!val) {
                    this.disabledMinutes = [];
                    return;
                }
                if(val < t) {
                    val = t;
                    this.jcTime = t;
                }
                let h = Number(val.slice(0, 2));
                if(h == tH) {
                    this.disabledMinutes = Array.range(0, tM - 1);
                }else {
                    this.disabledMinutes = [];
                }
            }else {
                this.disabledHours = [];
                this.disabledMinutes = [];
            }
        },
        
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
        // --参数校验--
        poiItemBlur() {
            if(!this.poiItem || !this.poiItem.name) {
                this.poiItemErr = "出发地不能为空";
                return;
            }
            this.poiItemErr = "";
            return;
        },
        checkJcDate() {
            if(!this.jcDate) {
                this.jcDateErr = "用车日期不能为空";
                return;
            }
            this.jcDateErr = "";
        },
        checkPgDay() {
            if(!this.pgDay) {
                this.pgDayErr = "包车天数不能为空";
                return;
            }
            this.pgDayErr = "";
        },
        checkJcTime() {
            if(!this.jcTime) {
                this.jcTimeErr = "用车时间不能为空";
                return;
            }
            this.jcTimeErr = "";
        },
        checkRideNum() {
            if(!this.rideNum){
                this.rideNumErr = "乘车人数不为空";
                return;
            } 
            if(!this.rideNum.validRideNum()) {
                this.rideNumErr = "乘车人数限制1-10";
                return;
            }
            this.rideNumErr = "";
        },
        checkUserPhone(b) {
            if(!this.userPhone) {
                return;
            }
            if(!this.userPhone.validPhone()) {
                b && (this.userPhoneErr = "手机号码不正确");
                return;
            }
            this.userPhoneErr = "";
        },
        // --下单--
        createOrderX: _.debounce(async function() {
            let {userPhone, userName, rideNum, remark, ctDesc, pgDay} = this;
            let cityId = this.poiItem.cityId;
            let svTime = this.jcDate && moment(this.jcDate).format("YYYY-MM-DD");
            svTime += this.jcTime && (" " + this.jcTime + ":00");
            let sPos = this.poiItem.name;
            
            let sLng = this.poiItem.location && this.poiItem.location.lng;
            let sLat = this.poiItem.location && this.poiItem.location.lat;

            let res = await this.cityQuery(sLng, sLat);
            let sAddr = `${res.province}${res.city}${res.district}${res.street}${res.streetNumber}`;

            this.createOrder({
                city_id:            cityId,
                user_phone:         userPhone,
                user_name:          userName,
                ride_num:           rideNum,
                service_time:       svTime,
                service_type:       0,
                start_position:     sPos,
                start_address:      sAddr,
                type:               3,
                remark:             remark,
                service_day:        pgDay,
                route_desc:         ctDesc,

                start_longitude:    sLng,
                start_latitude:     sLat,
            });
        }, 300),
        // 修改订单
        updateOrderX: _.debounce(async function() {
            let {userPhone, userName, rideNum, remark, ctDesc, pgDay} = this;
            let cityId = this.poiItem.cityId;
            let svTime = this.jcDate && moment(this.jcDate).format("YYYY-MM-DD");
            svTime += this.jcTime && (" " + this.jcTime + ":00");
            let sPos = this.poiItem.name;
            
            let sLng = this.poiItem.location && this.poiItem.location.lng;
            let sLat = this.poiItem.location && this.poiItem.location.lat;

            let orderId = this.odItem.orderId;
            let res = await this.cityQuery(sLng, sLat);
            let sAddr = `${res.province}${res.city}${res.district}${res.street}${res.streetNumber}`;

            this.updateOrder({
                order_id:           orderId,
                city_id:            cityId,
                user_phone:         userPhone,
                user_name:          userName,
                ride_num:           rideNum,
                service_time:       svTime,
                service_type:       0,
                start_position:     sPos,
                start_address:      sAddr,
                type:               3,
                remark:             remark,
                service_day:        pgDay,
                route_desc:         ctDesc,

                start_longitude:    sLng,
                start_latitude:     sLat,
            });
        }, 300),
    }
}
</script>

<style lang="scss" scoped>
@import "../../scss/bookForm.scss";
.cityCarType {
    
}
</style>