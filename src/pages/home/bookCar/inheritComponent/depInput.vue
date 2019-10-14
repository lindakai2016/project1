<template>
    <div class="teminalSelect">
        <!--选择城市-->
        <div class="citySel selGr" v-clickout="clickoutCity">
            <div class="ctInput inputGr" :class="{focus: inFocus1}">
                <input class="input" type="text" @click="ctFocus" v-model="cityKey" @input="ctInput" placeholder="选择城市">
                <i class="iconfont icon-home_icon_s link sdi" @click="clickDropIcon1"></i>
            </div>
            <div class="ctList drop" v-if="showDrop1">
                <div class="li" v-for="(e, i) in srchCityList" :key="i" @click="chooseCity(e)">{{e.cityName || "--"}}</div>
                <div class="li empty" v-if="srchCityList.length <= 0">无数据</div>
            </div>
        </div>
        <!--搜索航站楼信息-->
        <div class="tmSel selGr" v-clickout="clickoutDep">
            <div class="tmInput inputGr" :class="{focus: inFocus2, disabled: !canInputDep, err: err}">
                <input class="input" type="text" @click="depFocus" v-model="depKey" :placeholder="placeholder" @input="depInput">
                <i class="iconfont icon-home_icon_s link sdi" @click="clickDropIcon2"></i>
            </div>
            <div class="tmList drop" v-if="showDrop2">
                <div class="li" v-for="(item, i) in srchDepList" :key="i" @click="chooseDep(item)">{{item.depotName || "--"}}</div>
                <div class="li empty" v-if="srchDepList.length <= 0">无搜索结果</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["type", "cityId", "err"],
    data() {
        return {
            inFocus1: 0,
            inFocus2: 0,

            cityKey: "",
            cityItem: {},

            depKey: "",
            depList: null,
            depItem: {},
        }
    },
    computed: {
        cityList() {
            return this.$store.state.home.cityList;
        },
        srchCityList() {
            let key = this.cityKey || "";
            return this.cityList && this.cityList.filter(e => e.cityName.includes(key)) || [];
        },
        srchDepList() {
            let key = this.depKey || "";
            return this.depList && this.depList.filter(e => e.depotName.includes(key)) || [];
        },
        canInputDep() {
            return this.cityItem.cityName;
        },
        showDrop1() {
            return this.inFocus1 && this.cityList;
        },
        showDrop2() {
            return this.inFocus2 && this.depList;
        },
        placeholder() {
            return {0: "请选择机场", 1: "请选择火车站"}[this.type];
        }
    },
    watch: {
        inFocus1(val) {
            !val && this.autoChooseCity();
        },
        inFocus2(val) {
            !val && (this.depKey = this.depItem.depotName);
        },
        cityList: {
            immediate: true,
            handler: function() {
                if(this.cityList) {
                    //默认选中北京
                    let cityItem = this.cityList.filter(e => e.cityName.includes("北京"))[0] || {};
                    this.cityItem = cityItem;
                    this.cityKey = cityItem.cityName;
                }
            }
        },
        cityId: {
            immediate: true,
            handler: function(cid) {
                if(cid && !this.depItem.depotName) {
                    let cityItem = this.cityList.filter(e => e.cityId == cid)[0] || {};
                    this.cityItem = cityItem;
                    this.cityKey = cityItem.cityName;
                } 
            }
        },
        cityItem: {
            immediate: true,
            handler: function() {
                this.depItem = {};
                this.depKey = "";
                this.getDepList();
            }
        }
    },
    methods: {
        clickoutCity() {
            this.inFocus1 = false;
            this.cityKey = this.cityItem.cityName;
        },
        clickoutDep() {
            this.inFocus2 = false;
            this.depKey = this.depItem.depotName;
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
        depFocus() {
            this.inFocus2 = true;
        },
        depInput() {
            this.inFocus2 = true;
        },
        chooseCity(item) {
            this.cityKey = item.cityName;
            this.cityItem = item;
            this.inFocus1 = false;
            this.$emit("changeCity", item);
        },
        chooseDep(item) {
            item.cityId = this.cityItem.cityId;
            this.depItem = item;
            this.inFocus2 = false;
            this.$emit("change", item);
        },
        getDepList() {
            let cityId = this.cityItem.cityId;
            let type = this.type;
            this.$api["depQuery"]({
                city_id:    cityId,
                type,
            }).then(res => {
                if(res.code != 100200) {
                    return;
                }
                this.depList = res.data || [];
            }).catch(err => err);
        },
        autoChooseCity() {
            if(this.cityKey && this.srchCityList.length) {
                let item = this.srchCityList[0];
                this.chooseCity(item);
                return;
            }
            this.cityKey = this.cityItem.cityName;
        },
    }
}
</script>

<style lang="scss" scoped>
.teminalSelect {
    position: relative;
    .selGr {
        display: inline-block;
        vertical-align: top;
        position: relative;
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
                cursor: pointer;
                font-size: 12px;
                transform: rotate(180deg);
                width: 30px;
                text-align: center;
                display: inline-block;
                flex-shrink: 0;
                &.down {
                    transform: none;
                }
                &:hover {
                    opacity: 0.8;
                }
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
            max-height: 260px;
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
                color: #4A4A4A;
                &:hover {
                    background: #F9F9FC;
                }
                &.empty {
                    font-size: 12px;
                    color: #888;
                    padding: 5px 16px;
                    pointer-events: none;
                }
            }
        }
    }
    .citySel {
        margin-right: 9px;
        width: 100px;
    }
    .tmSel {
        width: 300px;
        .tmInput {
            &.disabled {
                border-color: #e5e5e5;
                pointer-events: none;
                .sdi {
                    color: #e5e5e5;
                }
            }
        }
    }
}
</style>
