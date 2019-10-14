<template>
    <!--接机-->
    <div class="fromAirport bookForm">
        <p class="odBy" v-if="byHb">
            不清楚航班号？按<i class="link" @click="setOrderBy(0)">机场预定</i>
            <i class="iconfont icon-home_icon_more_right_n"></i>
        </p>
        <p class="odBy" v-if="byJc">
            航班延误免费等，<i class="link" @click="setOrderBy(1)">航班号预定</i>
            <i class="iconfont icon-home_icon_more_right_n"></i>
        </p>
        <div class="errInfo" :class="{show: formErr}">
            <i class="iconfont icon-login_icon_error1"></i>{{formErr}}
        </div>
        <p class="fi" v-if="byHb">
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
        <p class="fi" v-if="byHb">
            <label class="lb needed">航班号</label>
            <flyInput class="rval v_airport" :class="{err: errParam == 'fly'}" :date="qfDate" @change="flyChange" @lnglat="flyLnglat"></flyInput>
        </p>
        <p class="fi" v-if="byJc">
            <label class="lb needed">航站楼</label>
            <depInput class="rval v_teminal" :type="0" @change="depChange" @changeCity="depCityChange"></depInput>
        </p>
        <p class="fi">
            <label class="lb needed">目的地</label>
            <poiInput class="rval v_ePos" @change="poiChange" :cityId="cityId"></poiInput>
        </p>
        <p class="fi" v-if="byHb">
            <label class="lb needed">用车时间</label>
            <hbTimeSelect class="rval v_useTimeSel" :class="{err: errParam == 'useCarTime'}" @change="hbTimeChange"></hbTimeSelect>
        </p>
        <p class="fi" v-if="byJc">
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
            <inputGr class="rval v_personNum" :class="{err: errParam == 'rideNum'}" v-model="rideNum" type="number" placeholder="请输入乘车人数"></inputGr>
        </p>
        <p class="fi">
            <label class="lb needed">联系人手机号</label>
            <userSelect class="rval v_userPhone" :class="{err: errParam == 'userPhone'}" v-model="userPhone" @chooseUser="chooseUser"></userSelect>
        </p>
        <p class="fi">
            <label class="lb">联系人姓名</label>
            <inputGr class="rval v_userName" :class="{err: errParam == 'userName'}" v-model="userName" placeholder="请输入联系人姓名"></inputGr>
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
import flyInput from "../../inheritComponent/flyInput";
import depInput from "../../inheritComponent/depInput";
import poiInput from "../../inheritComponent/poiInput";
import hbTimeSelect from "../../inheritComponent/hbTimeSelect";
import descInput from "../../inheritComponent/descInput";
import userSelect from "../../inheritComponent/userSelect";
import _ from "lodash";
import moment from 'moment';

export default {
    props: ["amap"],
    components: {
        inputGr,
        poiInput,
        flyInput,
        depInput,
        hbTimeSelect,
        descInput,
        userSelect,
    },
    data () {
        return {
            orderBy: 1,     // 0-按机场，1-按航班

            qfDate: new Date(),

            flyItem: {},        //byHb，按航班
            depItem: {},        //byJc，按机场
            poiItem: {}, 
            cityId: "",

            useCarTime: "",     // byHb
            jcDate: "",         // byJc

            rideNum: "",
            userPhone: "",
            userName: "",
            remark: "",

            formErr: "",
            errParam: "",
        }
    },
    computed: {
        byJc() {
            return this.orderBy == 0;
        },
        byHb() {
            return this.orderBy == 1;
        },
        canSubmit() {
            return this.checkParam();
        }
    },
    mounted() {
        
    },
    methods: {
        setOrderBy(n) {
            this.orderBy = n;
        },
        flyChange(flyItem) {
            this.flyItem = flyItem;
            this.cityId = flyItem.arrCityId;
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
        },
        poiChange(item) {
            this.poiItem = item;
            this.updateMap();
        },
        hbTimeChange(val) {
            this.useCarTime = val;
        },
        // 更新地图
        updateMap() {
            if(this.byJc && this.flyItem.flyNo && this.poiItem.name) {
                let {longitude, latitude} = this.flyItem;
                let {lng, lat} = this.poiItem.location || {};
                this.drawMapLine(longitude, latitude, lng, lat);
            }
            if(this.byHb && this.depItem.depotName && this.poiItem.name) {
                let {longitude, latitude} = this.depItem;
                let {lng, lat} = this.poiItem.location || {};
                this.drawMapLine(longitude, latitude, lng, lat);
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
            if(this.byHb && !this.flyItem.flyNo) {
                this.formErr = "航班号不能为空";
                this.errParam = "fly"
                return false;
            }
            if(this.byJc && !this.depItem.depotName) {
                this.formErr = "航站楼不能为空";
                this.errParam = ""
                return false;
            }
            if(!this.poiItem.name) {
                this.formErr = "目的地不能为空";
                this.errParam = ""
                return false;
            }
            if(this.byHb && !this.useCarTime) {
                this.formErr = "用车时间不能为空";
                this.errParam = "useCarTime"
                return false;
            }
            if(this.byJc && !this.jcDate) {
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

            let cityId, svTime, sPos;
            if(this.byHb) {
                cityId = this.flyItem.arrCityId;
                svTime = moment(this.flyItem.arrPlanTime).add(this.useCarTime, "minutes").format("YYYY-MM-DD HH:mm:ss");
                sPos = this.flyItem.arrTerm;
            }else if(this.byJc) {
                cityId = this.depItem.cityId;
                svTime = this.jcDate && moment(this.jcDate).format("YYYY-MM-DD HH:mm:ss");
                sPos = this.depItem.depotName;
            }
            let ePos = this.poiItem.name;

            this.$api["createOrder"]({
                city_id:            cityId,
                user_phone:         userPhone,
                user_name:          userName,
                ride_num:           rideNum,
                service_time:       svTime,
                service_type:       1,
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