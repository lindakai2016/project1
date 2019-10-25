<template>
    <!--接站-->
    <div class="fromTrain bookForm">
        <div class="errInfo" :class="{show: formErr}">
            <i class="iconfont icon-login_icon_error1"></i>{{formErr}}
        </div>
        <p class="fi">
            <label class="lb needed">火车站</label>
            <depInput class="rval v_train" :err="depItemErr" :cityCode="sCtCode" :item="depItem" :type="1" @change="depChange" @changeCity="depCityChange" @blur="depItemBlur"></depInput>
        </p>
        <p class="fi">
            <label class="lb needed">目的地</label>
            <poiInput class="rval v_ePos" :err="poiItemErr" :cityCode="eCtCode" :item="poiItem" @change="poiChange" :cityId="cityId" @blur="poiItemBlur"></poiInput>
        </p>
        <p class="fi">
            <label class="lb needed">用车时间</label>
            <DatePicker 
                class="rval v_useDate ivu-datepick-h35" 
                :class="{err: jcDateErr}"
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
        <button class="carBtn blue submitBtn" :class="{gray: !canSubmit}" @click="createOrderX" v-if="!edit">确认订单</button>
        <button class="carBtn blue submitBtn" :class="{gray: !canSubmit}" @click="updateOrderX" v-if="edit">修改订单</button>
        <div class="smTip">请填写所有*必填信息</div>
    </div>
</template>

<script>
import inputGr from "../../inheritComponent/Input";
import depInput from "../../inheritComponent/depInput";
import poiInput from "../../inheritComponent/poiInput";
import descInput from "../../inheritComponent/descInput";
import userSelect from "../../inheritComponent/userSelect";
import moment from 'moment';
import _ from "lodash";

export default {
    name: "trainFrom",
    props: ["odItem"],
    components: {
        inputGr,
        poiInput,
        depInput,
        descInput,
        userSelect,
    },
    inject: ["createOrder", "updateOrder", "cityQuery", "drawMapLine", "setMapCity"],
    data () {
        return {
            jcDate: "",
            jcTime: "",

            depItem: {},
            poiItem: {},
            cityId: "",

            rideNum: "1",
            userPhone: "",
            userName: "",
            remark: "",

            depItemErr: "",
            poiItemErr: "",
            jcDateErr: "",
            jcTimeErr: "",
            rideNumErr: "",
            userPhoneErr: "",

            edit: 0,
            sCtCode: "",    
            eCtCode: "",
        }
    },
    computed: {
        formErr() {
            return this.depItemErr || this.poiItemErr || this.jcDateErr || this.jcTimeErr || this.rideNumErr || this.userPhoneErr || "";
        },
        canSubmit() {
            let bol = this.rideNum && this.rideNum.validRideNum() && this.userPhone && this.userPhone.validPhone() && this.jcDate && this.jcTime;
            bol = bol && this.depItem && this.depItem.depotName && this.poiItem && this.poiItem.name;
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
                    this.jcTime = this.jcDate;

                    let sPos = order.startPosition;
                    let ePos = order.endPosition;
                    let sLng = order.startLongitude;
                    let sLat = order.startLatitude;
                    let eLng = order.endLongitude;
                    let eLat = order.endLatitude;

                    this.depItem = {
                        depotName:  sPos,
                        longitude:  sLng,
                        latitude:   sLat,
                    };
                    this.poiItem = {
                        name:   ePos,
                        location: {lng: eLng, lat: eLat}
                    }
                    this.cityQuery(sLng, sLat).then(res => {
                        this.sCtCode = res.citycode;
                    });
                    this.cityQuery(eLng, eLat).then(res => {
                        this.eCtCode = res.citycode;
                    });
                    this.edit = 1;
                    this.updateMap();
                }
            }  
        },
        jcDate() {
            this.checkJcDate();
            !this.jcTime && (this.jcTime = "08:00");
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
        depChange(depItem) {
            this.depItem = depItem;
            this.updateMap();
        },
        depCityChange(cityItem) {
            this.cityId = cityItem.cityId;
            this.setMapCity(cityItem.cityName);
        },
        poiChange(poiItem) {
            this.poiItem = poiItem;
            this.updateMap();
        },
        // 更新地图
        updateMap() {
            if(this.depItem.depotName && this.poiItem.name) {
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
        depItemBlur() {
            if(!this.depItem || !this.depItem.depotName) {
                this.depItemErr = "火车站不能为空";
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
            let cityId = this.depItem.cityId;
            let svTime = this.jcDate && moment(this.jcDate).format("YYYY-MM-DD");
            svTime += this.jcTime && (" " + this.jcTime + ":00");
            let sPos = this.depItem.depotName;
            let sTerm = this.depItem.depotTermCode;
            let ePos = this.poiItem.name;
            
            let sLng = this.depItem.longitude;
            let sLat = this.depItem.latitude;
            let eLng = this.poiItem.location && this.poiItem.location.lng;
            let eLat = this.poiItem.location && this.poiItem.location.lat;
            let eCityId = this.poiItem.cityId;

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
                service_type:       3,
                start_position:     sPos,
                start_address:      sAddr,
                arr_teml_code:      sTerm,
                end_position:       ePos,
                end_address:        eAddr,
                end_city_id:        eCityId,
                type:               2,
                remark:             remark,

                start_longitude:    sLng,
                start_latitude:     sLat,
                end_longitude:      eLng,
                end_latitude:       eLat,
            });
        }, 300),
        updateOrderX: _.debounce(async function() {
            let {userPhone, userName, rideNum, remark} = this;
            let cityId = this.depItem.cityId;
            let svTime = this.jcDate && moment(this.jcDate).format("YYYY-MM-DD");
            svTime += this.jcTime && (" " + this.jcTime + ":00");
            let sPos = this.depItem.depotName;
            let sTerm = this.depItem.depotTermCode;
            let ePos = this.poiItem.name;

            let sLng = this.depItem.longitude;
            let sLat = this.depItem.latitude;
            let eLng = this.poiItem.location && this.poiItem.location.lng;
            let eLat = this.poiItem.location && this.poiItem.location.lat;
            let eCityId = this.poiItem.cityId;

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
                service_type:       3,
                start_position:     sPos,
                start_address:      sAddr,
                arr_teml_code:      sTerm,
                end_position:       ePos,
                end_address:        eAddr,
                end_city_id:        eCityId,
                type:               2,
                remark:             remark,

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
.fromTrain {
    
}
</style>