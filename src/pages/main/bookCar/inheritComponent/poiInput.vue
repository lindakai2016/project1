<template>
    <div class="positionInput">
        <!--选择城市-->
        <div class="citySel selGr" v-clickout="clickoutCity">
            <div class="ctInput inputGr" :class="{focus: inFocus1}">
                <input class="input" @click="ctFocus" v-model="cityKey" placeholder="选择城市" @input="ctInput">
                <i class="iconfont icon-home_icon_s link sdi" @click="clickDropIcon1"></i>
            </div>
            <div class="ctList drop" v-if="showDrop1">
                <div class="li" v-for="(e, i) in srchCityList" :key="i" @click="chooseCity(e)">{{e.cityName || "--"}}</div>
                <div class="li empty" v-if="srchCityList.length <= 0">无数据</div>
            </div>
        </div>
        <!--搜索poi地址-->
        <div class="poiSel selGr" v-clickout="clickoutPoi">
            <div class="poiInput inputGr" :class="{focus: inFocus2, disabled: !canInputPoi, err: err}">
                <input class="input" @click="poiFocus" v-model="poiKey" placeholder="搜索地点" @input="poiInput">
                <i class="iconfont icon-home_icon_s link sdi" @click="clickDropIcon2"></i>
            </div>
            <div class="poiList drop" v-if="showDrop2">
                <div class="li" v-for="(item, i) in poiList" :key="i" @click="choosePoi(item)">
                    <i class="iconfont icon-didian posIc"></i>
                    <div class="poiInfo">
                        <div class="big">{{item.name}}</div>
                        <div class="small">{{item.nameEx}}</div>
                    </div>
                </div>
                <div class="li empty" v-if="poiList.length <= 0">无搜索结果</div>
            </div>
            <div class="poiList drop" v-if="showDropHis">
                <div class="li" v-for="(item, i) in srchHisPosList" :key="i" @click="chooseHisAddr(item)">
                    <i class="iconfont icon-didian posIc"></i>
                    <div class="poiInfo">
                        <div class="big">{{item.name}}</div>
                        <div class="small">{{item.nameEx}}</div>
                    </div>
                    <i class="iconfont icon-shanchu delIc link" @click.stop="delHisAddr(item)"></i>
                </div>
                <div class="li empty" v-if="srchHisPosList.length <= 0">无历史地址</div>
            </div>
            <div id="temp" style="display:none"></div>
        </div>
    </div>
</template>

<script>
import _ from "lodash";

export default {
    name: "poiInput",
    props: ["cityId", "err", "cityCode", "item"],
    data() {
        return {
            inFocus1: false,
            inFocus2: false,

            cityKey: "",
            cityItem: {},

            poiKey: "",
            poiList: null,
            poiItem: {},
        }
    },
    computed: {
        cityList() {
            return this.$store.state.main.cityList;
        },
        hisPoiList() {
            return this.$store.state.main.poiList;
        },
        srchCityList() {
            let key = this.cityKey || "";
            return this.cityList && this.cityList.filter(e => e.cityName.includes(key)) || [];
        },
        srchHisPosList() {
            let cid = this.cityItem.cityId;
            return this.hisPoiList && this.hisPoiList.filter(e => e.cityId == cid) || [];
        },
        canInputPoi() {
            return this.cityItem.cityName;
        },
        showDrop1() {
            return this.inFocus1 && !!this.cityList;
        },
        showDrop2() {
            return this.poiKey && this.inFocus2 && !!this.poiList;
        },
        showDropHis() {
            return !this.poiKey && this.inFocus2 && !!this.hisPoiList;
        }
    },
    watch: {
        inFocus1(val) {
            if(val) {
                this.cityKey = "";
            }else {
                this.autoChooseCity();
            }
        },
        inFocus2(val) {
            if(!val){
                this.poiKey = this.poiItem.name;
                this.$emit("blur");
            }
        },
        cityList: {
            immediate: true,
            handler(val) {
                val && this.initCity();
            }
        },
        cityId: {
            immediate: true,
            handler(cid) {
                // 城市联动
                if(cid && !this.poiItem.name) {
                    let cityItem = this.cityList.filter(e => e.cityId == cid)[0] || {};
                    this.chooseCity(cityItem);
                } 
            }
        },
        cityCode: {
            immediate: true,
            handler(val) {
                // 编辑订单
                val && this.initCity();
            }
        },
        item: {
            immediate: true,
            handler(val) {
                val = _.cloneDeep(val);
                val && this.initPoiItem(val);
            }
        },
    },
    beforeDestroy() {
        this.cityItem = null;
        this.poiItem = null;
        this.poiList = null;
    },
    methods: {
        initCity() {
            if(!this.cityList) {
                return;
            }
            let cityItem;
            if(this.cityCode) {
                cityItem = this.cityList.filter(e => e.gaodeCityCode == this.cityCode)[0] || {};
            }else {
                let ct = localStorage.getItemObj("companyInfo").cityName || "北京";
                cityItem = this.cityList.filter(e => e.cityName.includes(ct))[0] || {};
            }
            this.cityItem = cityItem;
            this.cityKey = cityItem.cityName;
        },
        initPoiItem(item) {
            this.poiItem = item;
            this.poiKey = item.name;
            this.poiList = null;
        },
        clickoutCity() {
            this.inFocus1 = false;
            this.autoChooseCity();
        },
        clickoutPoi() {
            this.inFocus2 = false;
            if(this.poiKey != this.poiItem.name) {
                this.poiKey = this.poiItem.name;
                this.poiList = null;
            }
        },
        clickDropIcon1() {
            this.inFocus1 = !this.inFocus1;
        },
        clickDropIcon2() {
            this.inFocus2 = !this.inFocus2;
        },
        ctFocus() {
            this.inFocus1 = true;
        },
        ctInput() {
            this.inFocus1 = true;
        },
        poiFocus() {
            this.inFocus2 = true;
            this.poiKey && this.poiInput();
        }, 
        poiInput: _.debounce(function() {
            this.inFocus2 = true;
            if(!this.poiKey) {
                this.poiList = null;
                return;
            }
            let cityCode = this.cityItem.gaodeCityCode;
            let poi = this.poiKey;
            let _this = this;
            let AMap = window.AMap;
            AMap.service(["AMap.PlaceSearch"], function() {
                let placeSearch = new AMap.PlaceSearch({
                    pageSize: 12, 
                    pageIndex: 1, 
                    city: cityCode,
                    citylimit: true, 
                    autoFitView: true,
                    panel: 'temp'
                });
                placeSearch.search(poi, function(status, result) {
                    if (status == 'complete' && result.info == 'OK') {
                        let poiList = result.poiList.pois || [];
                        poiList.map(e => {
                            e.nameEx = `${e.pname}${e.cityname}${e.address}`;
                        });
                        _this.poiList = poiList
                    }else {
                        _this.poiList = [];
                    }
                });
            });
        }, 300),
        chooseCity(item) {
            this.inFocus1 = false;
            this.cityKey = item.cityName;
            if(this.cityItem && this.cityItem.cityName == item.cityName) {
                return;
            }
            this.cityItem = item;
            this.$emit("changeCity", item);
            this.poiItem = {};
            this.poiKey = "";
            this.poiList = null;
        },
        choosePoi(item) {
            this.inFocus2 = false;
            if(this.poiItem && this.poiItem.name == item.name) {
                return;
            }
            item.cityId = this.cityItem.cityId;
            this.poiItem = item;
            this.poiKey = item.name;
            this.poiList = null;
            this.$emit("change", item);
        },
        chooseHisAddr(item) {
            this.inFocus2 = false;
            this.poiItem = item;
            this.poiKey = item.name;
            this.poiList = null;
            this.$emit("change", item);
        },
        autoChooseCity() {
            if(this.cityKey && this.srchCityList.length) {
                let item = this.srchCityList[0];
                this.chooseCity(item);
                return;
            }
            this.cityKey = this.cityItem.cityName;
        },
        async delHisAddr({ addressId }) {
            let op = await this.$dialog.delete("确定要删除此地址吗？");
            if(op != "ok") {
                return;
            }
            this.$api["delHisAddr"]({
                address_id: addressId,
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.$message.success("删除成功");
                this.$store.dispatch("main/getPoiList");
            }).catch(err => err);
        }
    }
}
</script>

<style lang="scss" scoped>
.positionInput {
    position: relative;
    .selGr {
        display: inline-block;
        vertical-align: top;
        position: relative;
        user-select: none;
        .inputGr {
            display: inline-flex;
            height: 35px;
            line-height: 33px;
            border: 1px solid rgba(53,65,79,0.25);
            border-radius: 3px;
            width: 100%;
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
                width: 100%;
                height: 100%;
                border-radius: 3px;
                padding: 0 0 0 12px;
                &::placeholder {
                    color: #E5E5E5;
                }
            }
            .sdi {
                font-size: 12px;
                transform: rotate(180deg);
                width: 30px;
                text-align: center;
                display: inline-block;
                flex-shrink: 0;
            }
        }
        .drop {
            position: absolute;
            top: calc(100% + 3px);
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            background: #fff;
            width: 100%;
            border: 1px solid rgba(53,65,79,0.25);
            border-radius: 3px;
            box-shadow: 0px 2px 8px 0px rgba(215,215,215,1);
            max-height: 360px;
            overflow: hidden auto;
            &::-webkit-scrollbar {
                width: 5px;
            }
            &::-webkit-scrollbar-thumb {
                background: #D8D8D8;
            }
            .li {
                margin: 5px 0;
                padding: 5px 16px;
                cursor: pointer;
                &:hover {
                    background: #F9F9FC;
                }
                &.empty {
                    pointer-events: none;
                    font-size: 12px;
                }
            }
            .empty {
                font-size: 12px;
                color: #888;
                padding: 5px 16px;
            }
        }
    }
    .citySel {
        margin-right: 9px;
        width: 100px;
        .drop {
            .li {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                &.title {
                    font-weight: 600;
                    font-size: 12px;
                    pointer-events: none;
                }
            }
        }
    }
    .poiSel {
        width: 300px;
        .poiInput {
            &.disabled {
                border-color: #e5e5e5;
                pointer-events: none;
                .sdi {
                    color: #e5e5e5;
                }
            }
        }
        .drop {
            .li {
                display: flex;
                align-items: center;
                .posIc {
                    color: #4A4A4A;
                    font-size: 16px;
                    margin-right: 13px;
                }
                .poiInfo {
                    flex-grow: 1;
                    .big {
                        font-size: 14px;
                        font-weight: 600;
                        color: #4A4A4A;
                        line-height: 20px;
                    }
                    .small {
                        font-size: 12px;
                        font-weight: 400;
                        line-height: 17px;
                        margin-top: 3px;
                        color: #888;
                    }
                }
                .delIc {
                    color: #989EB6;
                    font-size: 16px;
                    margin-left: 8px;
                }
            }
        }
    }
}
</style>
