<template>
    <!--接机-->
    <div class="fromAirport bookForm">
        <p class="odBy" v-show="byFly">
            不清楚航班号？按<i class="link" @click="setBy(0)">机场预定</i>
            <i class="iconfont icon-home_icon_more_right_n"></i>
        </p>
        <p class="odBy" v-show="byDep">
            航班延误免费等，<i class="link" @click="setBy(1)">航班号预定</i>
            <i class="iconfont icon-home_icon_more_right_n"></i>
        </p>
        <div class="errInfo" :class="{show: formErr}">
            <i class="iconfont icon-login_icon_error1"></i>{{formErr}}
        </div>
        <p class="fi" v-show="byFly">
            <label class="lb needed">起飞日期</label>
            <DatePicker 
                class="rval v_takeOffDate ivu-datepick-h35"
                type="date" 
                placeholder="选择日期" 
                v-model="qfDate" 
                :clearable="false" 
                :editable="false"
            ></DatePicker>
        </p>
        <p class="fi" v-if="byFly">
            <label class="lb needed">航班号</label>
            <flyInput class="rval v_airport" :err="flyItemErr" :item="flyItem" :date="qfDate" @change="flyChange" @lnglat="flyLnglat" @blur="flyItemBlur"></flyInput>
        </p>
        <p class="fi" v-if="byDep">
            <label class="lb needed">航站楼</label>
            <depInput class="rval v_teminal" :err="depItemErr" :cityCode="sCtCode" :item="depItem" :type="0" @change="depChange" @changeCity="depCityChange" @blur="depItemBlur"></depInput>
        </p>
        <p class="fi">
            <label class="lb needed">目的地</label>
            <poiInput class="rval v_ePos" :err="poiItemErr" :cityCode="eCtCode" :item="poiItem" @change="poiChange" :cityId="cityId" @blur="poiItemBlur"></poiInput>
        </p>
        <p class="fi">
            <label class="lb needed">用车时间</label>
            <DatePicker 
                class="rval v_useDate ivu-datepick-h35 rvalDp" 
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
                placeholder="选择时间"
                :editable="false"
                :steps="[1, 10]"
                v-model="jcTime"
                confirm
                :disabled-hours="disabledHours"
                :disabled-minutes="disabledMinutes"
                @on-change="onTimerPickerChange"
                hide-disabled-options
            ></TimePicker>
        </p>
        <p class="fi">
            <label class="lb needed">乘车人数</label>
            <inputGr class="rval v_personNum" :err="rideNumErr" v-model="rideNum" type="number" placeholder="请输入乘车人数"></inputGr>
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
        <button class="carBtn blue submitBtn" :class="{gray: !canSubmit}" @click="createOrderX" v-show="!edit">确认订单</button>
        <button class="carBtn blue submitBtn" :class="{gray: !canSubmit}" @click="updateOrderX" v-show="edit">修改订单</button>
        <div class="smTip">请填写所有*必填信息</div>
    </div>
</template>

<script>
import inputGr from "../../inheritComponent/Input";
import flyInput from "../../inheritComponent/flyInput";
import depInput from "../../inheritComponent/depInput";
import poiInput from "../../inheritComponent/poiInput";
import descInput from "../../inheritComponent/descInput";
import userSelect from "../../inheritComponent/userSelect";
import _ from "lodash";
import moment from 'moment';

export default {
    name: "airFrom",
    props: ["odItem"],
    components: {
        inputGr,
        poiInput,
        flyInput,
        depInput,
        descInput,
        userSelect,
    },
    inject: ["createOrder", "updateOrder", "cityQuery", "drawMapLine", "setMapCity"],
    data () {
        return {
            by: 1,     // 0-按航站楼，1-按飞机

            qfDate: new Date(),

            flyItem: {},        //byFly，按航班
            depItem: {},        //byDep，按机场
            poiItem: {}, 
            cityId: "",

            jcDate: "",
            jcTime: "",
            datePickerOption: {
                disabledDate (date) {
                    return date && date.valueOf() < new Date().setHours(0, 0, 0, 0);
                }
            },
            disabledHours: [],
            disabledMinutes: [],

            rideNum: "1",
            userPhone: "",
            userName: "",
            remark: "",

            flyItemErr: "",
            depItemErr: "",
            poiItemErr: "",
            jcDateErr: "",
            jcTimeErr: "",
            rideNumErr: "",
            userPhoneErr: "",
            
            edit: 0,    //0-下单，1-编辑订单
            sCtCode: "",    
            eCtCode: "",
        }
    },
    computed: {
        formErr() {
            if(this.byFly) {
                return this.flyItemErr || this.poiItemErr || this.jcDateErr || this.jcTimeErr || this.rideNumErr || this.userPhoneErr || "";
            }
            if(this.byDep) {
                return this.depItemErr || this.poiItemErr || this.jcDateErr || this.jcTimeErr || this.rideNumErr || this.userPhoneErr || "";
            }
            return "";
        },
        byDep() {
            return this.by == 0;
        },
        byFly() {
            return this.by == 1;
        },
        canSubmit() {
            let bol = this.rideNum && this.rideNum.validRideNum() && this.userPhone && this.userPhone.validPhone() && this.jcDate && this.jcTime;
            if(this.byFly) {
                bol = bol && this.flyItem && this.flyItem.flightNo;
            }
            if(this.byDep) {
                bol = bol && this.depItem && this.depItem.depotName;
            }
            bol = bol && this.poiItem && this.poiItem.name;
            return bol;
        },
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

                    let sPos = order.startPosition;
                    let ePos = order.endPosition;
                    let sLng = order.startLongitude;
                    let sLat = order.startLatitude;
                    let eLng = order.endLongitude;
                    let eLat = order.endLatitude;
                   
                    if(order.flyInfo) {
                        let flyItem = JSON.parse(order.flyInfo) || {};
                        this.qfDate = flyItem.depPlanTime && new Date(flyItem.depPlanTime);
                        this.flyItem = flyItem;
                        this.by = 1;
                        this.addDpShortcut();
                    }else {
                        this.by = 0;
                        this.removeDpShortcut();
                    }

                    this.depItem = {
                        depotName:  sPos,
                        longitude:  sLng,
                        latitude:   sLat,
                    };
                    this.cityQuery(sLng, sLat).then(res => {
                        this.sCtCode = res.citycode;
                    });
                    this.cityQuery(eLng, eLat).then(res => {
                        this.eCtCode = res.citycode;
                    });
                    this.poiItem = {
                        name:   ePos,
                        location: {lng: eLng, lat: eLat}
                    }
                    this.edit = 1;
                    this.updateMap();
                }
            }  
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
    activated() {
        this.updateMap();
    },
    methods: {
        setBy(n) {
            this.by = n;
            if(this.byDep) {
                this.depItem = {};
            }
            if(this.byFly) {
                this.flyItem = {};
            }
            this.removeDpShortcut();
        },
        flyChange(flyItem) {
            this.flyItem = flyItem;
            this.cityId = flyItem.arrCityId;
            this.setMapCity(flyItem.arrCityName);
            //
            this.jcDate = flyItem.arrPlanTime && moment(flyItem.arrPlanTime).add(15, "m").toDate();
            this.jcTime = this.jcDate && moment(this.jcDate).format("HH:mm");
            this.addDpShortcut();
        },

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

        // --航班时间快捷方式--
        addDpShortcut() {
            let arrPlanTime = this.flyItem && this.flyItem.arrPlanTime || "";
            if(!arrPlanTime) {
                this.removeDpShortcut();
                return;
            }
            let _this = this;
            this.datePickerOption.shortcuts = [
                {
                    text: '航班到达后15分钟',
                    value () {
                        let d = moment(arrPlanTime).add(15, "m");
                        _this.jcDate = d.toDate();
                        _this.jcTime = d.format("HH:mm");
                    }
                },
                {
                    text: '航班到达后30分钟',
                    value () {
                        let d = moment(arrPlanTime).add(30, "m");
                        _this.jcDate = d.toDate();
                        _this.jcTime = d.format("HH:mm");
                    }
                },
                {
                    text: '航班到达后45分钟',
                    value () {
                        let d = moment(arrPlanTime).add(45, "m");
                        _this.jcDate = d.toDate();
                        _this.jcTime = d.format("HH:mm");
                    }
                },
                {
                    text: '航班到达后60分钟',
                    value () {
                        let d = moment(arrPlanTime).add(60, "m");
                        _this.jcDate = d.toDate();
                        _this.jcTime = d.format("HH:mm");
                    }
                },
                {
                    text: '航班到达后120分钟',
                    value () {
                        let d = moment(arrPlanTime).add(120, "m");
                        _this.jcDate = d.toDate();
                        _this.jcTime = d.format("HH:mm");
                    }
                },
            ];
        },
        removeDpShortcut() {
            this.datePickerOption.shortcuts = [];
        },

        flyLnglat() {
            this.updateMap();
        },
        depChange(depItem) {
            this.depItem = depItem;
            this.updateMap();
        },
        depCityChange(cityItem) {
            this.cityId = cityItem.cityId;
            this.setMapCity(cityItem.cityName);
        },
        poiChange(item) {
            this.poiItem = item;
            this.updateMap();
        },
        // 更新地图
        updateMap() {
            if(this.byFly && this.flyItem.flightNo && this.poiItem.name) {
                let {longitude, latitude} = this.flyItem;
                let {lng, lat} = this.poiItem.location || {};
                this.drawMapLine(longitude, latitude, lng, lat);
            }
            if(this.byDep && this.depItem.depotName && this.poiItem.name) {
                let {longitude, latitude} = this.depItem;
                let {lng, lat} = this.poiItem.location || {};
                this.drawMapLine(longitude, latitude, lng, lat);
            }
        },
        chooseUser({contactName, contactPhone}) {
            this.userName = contactName;
            this.userPhone = contactPhone;
        },
        // --参数校验--
        flyItemBlur() {
            if(!this.flyItem || !this.flyItem.flightNo) {
                this.flyItemErr = "航班号不能为空";
                return;
            }
            this.flyItemErr = "";
            return;
        },
        depItemBlur() {
            if(!this.depItem || !this.depItem.depotName) {
                this.depItemErr = "航站楼不能为空";
                return;
            }
            this.depItemErr = "";
            return;
        },
        poiItemBlur() {
            if(!this.poiItem || !this.poiItem.name) {
                this.poiItemErr = "目的地不能为空";
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
            let {userPhone, userName, rideNum, remark} = this;

            let cityId, sPos, sTerm, flyNo, flyInfo, flyDate, sDepCode, sLng, sLat;
            if(this.byFly) {
                cityId = this.flyItem.arrCityId;
                sPos = this.flyItem.arrName;
                sTerm = this.flyItem.arrTerm;
                sDepCode = this.flyItem.arrCode;

                flyNo = this.flyItem.flightNo;
                flyInfo = JSON.stringify(this.flyItem);
                flyDate = this.qfDate && moment(this.qfDate).format("YYYY-MM-DD HH:mm:ss");
                
                sLng = this.flyItem.longitude;
                sLat = this.flyItem.latitude;
            }else if(this.byDep) {
                cityId = this.depItem.cityId;
                sPos = this.depItem.depotName;
                sTerm = this.depItem.depotTermCode;
                sDepCode = this.depItem.depotCode;

                sLng = this.depItem.longitude;
                sLat = this.depItem.latitude;
            }
            let ePos = this.poiItem.name;
            let eLng = this.poiItem.location && this.poiItem.location.lng;
            let eLat = this.poiItem.location && this.poiItem.location.lat;
            let eCityId = this.poiItem.cityId;
            let svTime = this.jcDate && moment(this.jcDate).format("YYYY-MM-DD");
            svTime += this.jcTime && (" " + this.jcTime + ":00");

            let res = await this.cityQuery(sLng, sLat);
            let sAddr = `${res.province}${res.city}${res.district}${res.street}${res.streetNumber}`;
            let eRes = await this.cityQuery(eLng, eLat);
            let eAddr = `${eRes.province}${eRes.city}${eRes.district}${eRes.street}${eRes.streetNumber}`;
            
            this.createOrder({
                city_id:            cityId,
                user_phone:         userPhone,
                user_name:          userName,
                ride_num:           rideNum,
                service_time:       svTime,
                service_type:       1,
                start_position:     sPos,
                start_address:      sAddr,
                arr_teml_code:      sTerm,
                arr_code:           sDepCode,
                end_position:       ePos,
                end_address:        eAddr,
                end_city_id:        eCityId,
                type:               2,
                remark:             remark,

                fly_no:             flyNo,
                fly_info:           flyInfo,
                fly_date:           flyDate,

                start_longitude:    sLng,
                start_latitude:     sLat,
                end_longitude:      eLng,
                end_latitude:       eLat,
            });
        }, 300),
        //修改订单
        updateOrderX: _.debounce(async function() {
            let {userPhone, userName, rideNum, remark} = this;

            let cityId, sPos, sTerm, flyNo, flyInfo, flyDate, sDepCode, sLng, sLat;
            if(this.byFly) {
                cityId = this.flyItem.arrCityId;
                sPos = this.flyItem.arrName;
                sTerm = this.flyItem.arrTerm;
                sDepCode = this.flyItem.arrCode;

                flyNo = this.flyItem.flightNo;
                flyInfo = JSON.stringify(this.flyItem);
                flyDate = this.qfDate && moment(this.qfDate).format("YYYY-MM-DD HH:mm:ss");

                sLng = this.flyItem.longitude;
                sLat = this.flyItem.latitude;
            }else if(this.byDep) {
                cityId = this.depItem.cityId;
                sPos = this.depItem.depotName;
                sTerm = this.depItem.depotTermCode;
                sDepCode = this.depItem.depotCode;

                sLng = this.depItem.longitude;
                sLat = this.depItem.latitude;
            }
            let ePos = this.poiItem.name;
            let eLng = this.poiItem.location && this.poiItem.location.lng;
            let eLat = this.poiItem.location && this.poiItem.location.lat;
            let eCityId = this.poiItem.cityId;
            let svTime = this.jcDate && moment(this.jcDate).format("YYYY-MM-DD");
            svTime += this.jcTime && (" " + this.jcTime + ":00");

            let orderId = this.odItem.orderId;
            let res = await this.cityQuery(sLng, sLat);
            let sAddr = `${res.province}${res.city}${res.district}${res.street}${res.streetNumber}`;
            let eRes = await this.cityQuery(eLng, eLat);
            let eAddr = `${eRes.province}${eRes.city}${eRes.district}${eRes.street}${eRes.streetNumber}`;

            this.updateOrder({
                order_id:           orderId,
                city_id:            cityId,
                user_phone:         userPhone,
                user_name:          userName,
                ride_num:           rideNum,
                service_time:       svTime,
                service_type:       1,
                start_position:     sPos,
                start_address:      sAddr,
                arr_teml_code:      sTerm,
                arr_code:           sDepCode,
                end_position:       ePos,
                end_address:        eAddr,
                end_city_id:        eCityId,
                type:               2,
                remark:             remark,

                fly_no:             flyNo,
                fly_info:           flyInfo,
                fly_date:           flyDate,

                start_longitude:    sLng,
                start_latitude:     sLat,
                end_longitude:      eLng,
                end_latitude:       eLat,
            });
        }, 300),
    }
}
</script>

<style lang="scss" scoped>
@import "../../scss/bookForm.scss";
.fromAirport {
    .odBy {
        font-size: 12px;
        line-height: 17px;
        color: #989EB6;
        text-align: right;
        width: 420px;
        margin-left: 100px;
        user-select: none;
        .link {
            color: #4780F7;
            cursor: pointer;
            margin-left: 2px;
            &:hover {
                opacity: 0.8;
            }
        }
        .iconfont {
            font-size: 12px;
            display: inline-block;
            transform: scale(0.8);
        }
    }
}
</style>