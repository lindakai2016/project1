<template>
    <div class="bctsInput">
        <!--包车天数-->
        <div class="selGr" v-clickout="blur">
            <div class="inputGr" :class="{focus: inFocus, err: err}">
                <input class="input" type="text" placeholder="请输入包车天数" @input="input($event)" @click="focus" :value="value">
                <i class="iconfont icon-home_icon_s sdi" @click="clickIcon"></i>
            </div>
            <div class="drop" v-if="inFocus">
                <div class="li" v-for="(e, i) in timeList" :key="i" @click="chooseTime(e)">{{e.label}}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "ctTimeInput",
    props: ["value", "err"],
    model: {
        prop: "value",
        event: "inputValue",
    },
    data() {
        return {
            inFocus: 0,
            timeList: [
                {label: "半天", value: 0.5},
                {label: "1天", value: 1},
                {label: "2天", value: 2},
                {label: "3天", value: 3},
                {label: "4天", value: 4},
                {label: "5天", value: 5},
                {label: "6天", value: 6},
                {label: "7天", value: 7},
                {label: "8天", value: 8},
                {label: "9天", value: 9},
                {label: "10天", value: 10},
            ]
        }
    },
    methods: {
        clickIcon() {
            this.inFocus = !this.inFocus;
        },
        blur() {
            this.inFocus = false;
            this.$emit("blur");
        },
        focus() {
            this.inFocus = true;
        },
        input(event) {
            let value = event.target.value;
            let reg = /^\d+(\.\d*)?/
            value = value && (value.match(reg) || [])[0];
            event.target.value = value;
            this.$emit("inputValue",  value);
        },
        chooseTime(item) {
            this.$emit("inputValue",  item.value);
            this.inFocus =false;
        }
    }
}
</script>

<style lang="scss" scoped>
.bctsInput {
    position: relative;
    .selGr {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
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
            }
            .empty {
                font-size: 14px;
                color: #888;
                padding: 5px 16px;
            }
        }
    }
}
</style>
