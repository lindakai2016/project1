<template>
    <div class="bookCar">
        <ul class="tab">
            <li class="tbi" :class="{active: bookType == 0}" @click="selectBookType(0)">
                <i class="iconfont icon-icon_airplane_n tbIc"></i>接送机
            </li>
            <li class="tbi" :class="{active: bookType == 1}" @click="selectBookType(1)">
                <i class="iconfont icon-icon_pickupstation_n tbIc"></i>接送站
            </li>
            <li class="tbi" :class="{active: bookType == 2}" @click="selectBookType(2)">
                <i class="iconfont icon-icon_citycar_n tbIc"></i>市内用车
            </li>
            <li class="tbi" :class="{active: bookType == 3}" @click="selectBookType(3)">
                <i class="iconfont icon-icon_charteredcar_n tbIc"></i>包车
            </li>
        </ul>
        <airplane v-if="bookType == 0"></airplane>
        <train v-if="bookType == 1"></train>
        <cityCar v-if="bookType == 2"></cityCar>
        <charter v-if="bookType == 3"></charter>
        <!--下单成功-->
        <basePopup v-model="showScDlg">
            <bookSuccess @exit="closeScDlg"></bookSuccess>
        </basePopup>
    </div>
</template>

<script>
import airplane from "./bookType/airplane";
import train from "./bookType/train";
import cityCar from "./bookType/cityCar";
import charter from "./bookType/charter";
import basePopup from "@/commonComponents/basePopup";
import bookSuccess from "./components/bookSuccess";

export default {
    components: {
        airplane,
        train,
        cityCar,
        charter,
        basePopup,
        bookSuccess,
    },
    data() {
        return {
            bookType: 0,
            showScDlg: false,
        }
    },
    mounted() {
        this.getCityList();
        this.getRcUser();
    },
    methods: {
        selectBookType(n){
            this.bookType = n;
        },
        openScDlg() {
            this.showScDlg = true;
        },
        closeScDlg() {
            this.showScDlg = false;
        },
        // 获取城市列表
        getCityList() {
            this.$api["cityList"]({}).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                let cityList = res.data || [];
                this.$store.commit("home/setCityList", cityList);
            }).catch(err => err);
        },
        // 获取最近联系人
        getRcUser() {
            this.$store.dispatch("home/getUserList");
        },
    }
}
</script>

<style lang="scss" scoped>
.bookCar {
    padding: 25px 0 80px 0;
    .tab {
        display: flex;
        align-items: center;
        user-select: none;
        margin-bottom: 25px;
        .tbi {
            width: 120px;
            height: 40px;
            line-height: 40px;
            border-radius: 20px;
            text-align: center;
            background: #fff;
            color: #989EB6;
            font-size: 16px;
            cursor: pointer;
            margin-right: 20px;
            .tbIc {
                font-size: 16px;
                margin-right: 8px;
            }
            &:hover {
                opacity: 0.8;
            }
            &.active {
                background: #4780F7;
                color: #fff;
                opacity: 1;
                pointer-events: none;
            }
        }
    }
}
</style>
