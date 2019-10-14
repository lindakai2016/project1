<template>
    <!--接站-->
    <div class="toTrain bookForm">
        <div class="errInfo" :class="{show: formErr}">
            <i class="iconfont icon-login_icon_error1"></i>{{formErr}}
        </div>
        <p class="fi">
            <label class="lb needed">出发地</label>
            <poiInput class="rval v_ePos" :err="errParam=='poiItem'" @change="poiChange" @changeCity="poiCityChange"></poiInput>
        </p>
        <p class="fi">
            <label class="lb needed">火车站</label>
            <depInput class="rval v_train" :err="errParam=='depItem'" :type="1" @change="depChange" :cityId="cityId"></depInput>
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
            <label class="lb needed">乘车人数</label>
            <inputGr class="rval v_personNum" :err="errParam=='rideNum'" v-model="rideNum" type="number" placeholder="请输入乘车人数"></inputGr>
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
        <div id="panel" style="display: none"></div>
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
    props: ["amap"],
    components: {
        inputGr,
        poiInput,
        depInput,
        descInput,
        userSelect,
    },
    data () {
        return {
            jcDate: new Date(),

            depItem: {},
            poiItem: {},
            cityId: "",

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
    methods: {
        depChange(depItem) {
            this.depItem = depItem;
            this.updateMap();
        },
        poiChange(poiItem) {
            this.poiItem = poiItem;
            this.updateMap();
        },
        poiCityChange(cityItem) {
            this.cityId = cityItem.cityId;
        },
        // 更新地图
        updateMap() {
            if(this.depItem.depotName && this.poiItem.name) {
                let {longitude, latitude} = this.depItem;
                let {lng, lat} = this.poiItem.location || {};
                this.drawMapLine(lng, lat, longitude, latitude);
            }
        },
        drawMapLine(lon1, lat1, lon2, lat2) {
            let map = this.amap.getMap();
            map.clearMap();
            let AMap = window.AMap;
            AMap.service(["AMap.Driving"], function() {
                let driving = new AMap.Driving({
                    map:    map,
                    panel: "panel"
                });
                driving.search(new AMap.LngLat(lon1, lat1), new AMap.LngLat(lon2, lat2), function(status, result) {
                    console.log(status, result)
                });
            });
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
            if(!this.depItem.depotName) {
                this.formErr = "火车站不能为空";
                this.errParam = "depItem"
                return false;
            }
            if(!this.jcDate) {
                this.formErr = "用车时间不能为空";
                this.errParam = "jcDate"
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
            let {userPhone, userName, rideNum, remark} = this;
            let cityId = this.poiItem.cityId;
            let svTime = this.jcDate && moment(this.jcDate).format("YYYY-MM-DD HH:mm:ss");
            let sPos = this.poiItem.name;
            let ePos = this.depItem.depotName;
            this.$api["createOrder"]({
                city_id:            cityId,
                user_phone:         userPhone,
                user_name:          userName,
                ride_num:           rideNum,
                service_time:       svTime,
                service_type:       4,
                start_position:     sPos,
                end_position:       ePos,
                type:               2,
                remark:             remark,
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
.toTrain {
    
}
</style>