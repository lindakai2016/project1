<template>
    <div class="pageNavi">
        <span class="total">共{{maxPage}}页</span>
        <i class="iconfont icon-icon_arrow_right pgi" :class="{gray: !canPrev}" @click="clickPrev"></i>
        <span class="pgi" v-for="(e, i) in pageArr" :key="i" :class="{cur: page == e, gray: e=='...'}" @click="clickPage(e)">{{e}}</span>
        <i class="iconfont icon-icon_arrow_left pgi" :class="{gray: !canNext}" @click="clickNext"></i>
        <div class="goto"> 
            跳至<input type="text" class="inputGo" v-model="goPage" @blur="blurInput">页 
        </div>
        <div class="sel" :class="{showDrop: showDrop}">
            <p class="sLb" @click="toggleDrop" v-clickout="closeDrop">
                {{numPer}}条/页<i class="iconfont icon-home_icon_more_right_n downIc"></i>
            </p>
            <ul class="drop">
                <li class="di" v-for="(e, i) in numPerOpts" :key="i" @click="setNumPerPage(e)" :class="{selected: e == numPer}">{{e}}条</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: "pageNavi",
    props: ["page","total"],
    data() {
        return {
            goPage: "",

            numPer: 10,
            numPerOpts: [10, 20, 30, 50],

            showDrop: false,
        }
    },
    computed: {
        canPrev() {
            return this.page > 1;
        },
        canNext() {
            return this.page < this.maxPage;
        },
        maxPage() {
            return Math.ceil(this.total / this.numPer);
        },
        pageArr() {
            let n = this.page;
            let t = this.maxPage;
            if(t < 1 || n < 1 || n > t) return [];
            if(n <= 3) {
                return t <= 5 && Array.range(1, t) || [...Array.range(1, 5), "..."];
            }
            if(n >= t-2) {
                return t-4 > 1 && ["...", ...Array.range(t-4, t)] || Array.range(1, t);
            }
            if(n > 3 && n < t-2) {
                return ["...", ...Array.range(n-2, n+2), "..."];
            }
            return [];
        }
    },
    watch: {
        page: {
            immediate: true,
            handler(val) {
                this.goPage = val;
            }
        }
    },
    methods: {
        blurInput() {
            let p = Number(this.goPage);
            if(p >= 1 && p <= this.maxPage && p != this.page) {
                this.$emit("pageChange", p);
                return;
            }
            this.goPage = this.page;
        },
        clickPrev() {
            if(!this.canPrev) {
                return;
            }
            this.goPage = this.page - 1;
            this.$emit("pageChange", this.page - 1);
        },
        clickNext() {
            if(!this.canNext) {
                return;
            }
            this.goPage = this.page + 1;
            this.$emit("pageChange", this.page + 1);
        },
        clickPage(n) {
            if(n == "..." || n == this.page) {
                return;
            }
            this.goPage = n;
            this.$emit("pageChange", n);
        },
        setNumPerPage(n) {
            if(n == this.numPer) {
                return;
            }
            this.numPer = n;
            this.$emit("sizeChange", n);
        },
        toggleDrop() {
            this.showDrop = !this.showDrop;
        },
        closeDrop() {
            this.showDrop = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.pageNavi {  
    color: #2C3642;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 27px 0 120px 0;
    user-select: none;
    .total {
        margin-right: 12px;
    }
    .pgi {
        margin: 0 3px;
        display: inline-block;
        width: 28px;
        line-height: 26px;
        font-size: 12px;
        border: 1px solid #B2B2B2;
        text-align: center;
        border-radius: 2px;
        cursor: pointer;
        &:hover {
            color: #4780F7;
        }
        &.gray {
            cursor: default;
            pointer-events: none;
            opacity: 0.6;
        }
        &.cur {
            cursor: default;
            color: #4780F7;
            border-color: #4780F7;
        }
    }
    .goto {
        margin: 0 10px;
        .inputGo {
            height: 28px;
            width: 43px;
            border: 1px solid #B2B2B2;
            text-align: center;
            border-radius: 2px;
            background: #fff;
            margin: 0 6px;
        }
    }
    .sel {
        position: relative;
        cursor: pointer;
        &.showDrop {
            .drop {
                display: block;
            }
            .sLb .downIc {
                transform: rotate(270deg);
            }
        }
        .sLb {
            width: 90px;
            height: 28px;
            line-height: 26px;
            border: 1px solid #B2B2B2;
            border-radius: 2px;
            text-align: center;
            background: #fff;
            .downIc {
                margin-left: 4px;
                display: inline-block;
                font-size: 12px;
                transform: rotate(90deg) scale(0.8);
            }
        }
        .drop {
            position: absolute;
            width: 100%;
            background: #fff;
            border: 1px solid #b2b2b2;
            border-radius: 0 0 2px 2px;
            border-top: 0;
            top: 100%;
            left: 0;
            display: none;
            z-index: 1000;
            .di {
                padding: 0 10px;
                line-height: 28px;
                text-align: center;
                &:hover {
                    background: #F9F9FC;
                }
                &.selected {
                    color: #4780F7;
                }
            }
        }
    }
}
</style>
