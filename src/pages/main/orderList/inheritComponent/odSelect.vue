<template>
    <div class="odSelect" v-clickout="close">
        <div class="head" :class="{check: hasCheck}" @click="toggle">
            <span class="sdv">{{odSelTitle}}</span>
            <i class="iconfont icon-home_icon_s sdi" :class="{down: drop}"></i>
        </div>
        <div class="odDrop" :class="{drop: drop}">
            <div class="sec">
                <p class="title">订单状态</p>
                <div class="row">
                    <span class="ri" :class="{active: e.check}" v-for="(e, i) in odStatus" :key="i" @click="clickRi(e)">{{e.name}}</span>
                </div>
            </div>
            <div class="sec">
                <p class="title">订单类型</p>
                <div class="row">
                    <span class="ri" :class="{active: e.check}" v-for="(e, i) in odType" :key="i" @click="clickRi(e)">{{e.name}}</span>
                </div>
            </div>
            <div class="sec">
                <p class="title">结算状态</p>
                <div class="row">
                     <span class="ri" :class="{active: e.check}" v-for="(e, i) in odSett" :key="i" @click="clickRi(e)">{{e.name}}</span>
                </div>
            </div>
            <div class="ops">
                <button class="carBtn white resetBtn" @click="reset">重置</button>
                <button class="carBtn blue okBtn" @click="close">确认</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            drop: false,
            odStatus: [
                {name: "待安排", value: 0, check: 0},
                {name: "待接单", value: 10, check: 0},
                {name: "已接单", value: 20, check: 0},
                {name: "服务完成", value: 30, check: 0},
                {name: "已取消", value: 40, check: 0},
            ],
            odType: [
                {name: "接机", value: 1, check: 0},
                {name: "送机", value: 2, check: 0},
                {name: "接站", value: 3, check: 0},
                {name: "送站", value: 4, check: 0},
                {name: "市内用车", value: 5, check: 0},
                {name: "包车", value: 10, check: 0},
            ],
            odSett: [
                {name: "未结算", value: 0, check: 0},
                {name: "已结算", value: 1, check: 0},
            ],

            cache: "",
        }
    },
    computed: {
        hasCheck() {
            return this.odStatus.some(e => e.check) || this.odType.some(e => e.check) || this.odSett.some(e => e.check);
        },
        odSelTitle() {
            let s = "";
            let s1 = this.odStatus.filter(e => e.check).map(e => e.name).join("、");
            s1 && (s += s1 + "，");
            let s2 = this.odType.filter(e => e.check).map(e => e.name).join("、");
            s2 && (s += s2 + "，");
            let s3 = this.odSett.filter(e => e.check).map(e => e.name).join("、");
            s3 && (s += s3 + "，");
            s = s.replace(/，$/g, "");
            return this.hasCheck ? s : "筛选";
        }
    },
    watch: {
        drop(bol) {
            bol && this.onOpen() || this.onClose();
        }
    },
    methods: {
        close() {
            this.drop = false;
        },
        toggle() {
            this.drop = !this.drop;
        },
        clickRi(item) {
            item.check = !item.check;
        },
        reset() {
            this.odStatus.map(e => e.check = 0);
            this.odType.map(e => e.check = 0);
            this.odSett.map(e => e.check = 0);
        },
        onOpen() {
            this.cache = this.odStatus.map(e => +e.check).join("") + this.odType.map(e => +e.check).join("") + this.odSett.map(e => +e.check).join("");
        },
        onClose() {
            let curCc = this.odStatus.map(e => +e.check).join("") + this.odType.map(e => +e.check).join("") + this.odSett.map(e => +e.check).join("");
            if(curCc != this.cache) {
                let status = this.odStatus.filter(e => e.check).map(e => e.value).join(",");
                let type = this.odType.filter(e => e.check).map(e => e.value).join(",");
                let sett = this.odSett.filter(e => e.check).map(e => e.value).join(",");
                this.$emit("change", status, type, sett);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.odSelect {
    position: relative;
    display: inline-block;
    user-select: none;
    text-align: left;
    &:hover {
        .head {
            opacity: 0.8;
        }
    }
    .head {
        background: #fff;
        width: 100%;
        height: 38px;
        line-height: 38px;
        padding: 0 12px;
        border-radius: 2px;
        color: #2C3642;
        cursor: pointer;
        &.check {
            color: #4780F7;
            .sdi {
                color: #4780F7;
            }
        }
        .sdv {
            font-size: 12px;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
        }
        .sdi {
            float: right;
            font-size: 12px;
            color: #B8BCC1;
            margin-left: 4px;
            transform: rotate(180deg);
            &.down {
                transform: none;
            }
        }
    }
    .odDrop {
        position: absolute;
        top: calc(100% + 6px);
        right: 0;
        background: #fff;
        box-shadow: 0px 2px 8px 0px #d7d7d7;
        border-radius: 3px;
        z-index: 1000;
        padding: 18px;
        display: none;
        &.drop {
            display: block;
        }
        .sec {
            margin-top: 16px;
            &:first-of-type {
                margin-top: 0;
            }
            .title {
                color: #4A4A4A;
                font-size: 14px;
                font-weight: 600;
            }
            .row {
                margin-top: 8px;
                white-space: nowrap;
                display: flex;
                .ri {
                    display: inline-block;
                    border-radius: 13px;
                    border: 1px solid #e5e5e5;
                    width: 70px;
                    height: 24px;
                    line-height: 22px;
                    text-align: center;
                    font-size: 12px;
                    color: #4A4A4A;
                    cursor: pointer;
                    margin-right: 8px;
                    &:last-of-type {
                        margin-right: 0;
                    }
                    &:hover {
                        opacity: 0.8;
                    }
                    &.active {
                        background: rgba(71,128,247,0.1);
                        color: #4780F7;
                        border-color: transparent;
                    }
                }
            }
        }
        .ops {
            margin-top: 20px;
            text-align: center;
            .carBtn {
                margin: 0 6px;
                height: 25px;
                line-height: 23px;
                width: 50px;
                border-radius: 4px;
                font-size: 12px;
            }
        }
    }
}
</style>
