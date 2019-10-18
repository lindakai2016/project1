<template>
    <!--重置密码-->
    <div class="bookSuccess">
        <i class="iconfont icon-icon_close_n link closeIcon" @click="exit"></i>
        <div class="bsInfo">
            <img class="scImg" src="@/static/images/img_success.svg"/>
            <div class="big">下单成功</div>
            <div class="small">已通知车队安排司机</div>
        </div>
        <button class="carBtn blue goBtn" @click="bookNext">继续订车</button>
        <button class="carBtn white backBtn" @click="backHome">查看订单列表</button>
    </div>
</template>

<script>
export default {
    data () {
        return {
            
        }
    },
    inject: ['reload'],
    methods: {
        exit() {
            this.bookNext();
        },
        backHome() {
            this.$router.push("/order");
        },
        bookNext() {
            this.reload();
            this.$emit("exit");
        }
    }
}
</script>

<style lang="scss" scoped>
.bookSuccess {
    background: #fff;
    width: 417px;
    background: #fff;
    box-shadow: 0px 2px 22px 0px rgba(0,64,255,0.04);
    border-radius: 3px;
    position: relative;
    padding: 44px 0;
    .closeIcon {
        position: absolute;
        top: 19px;
        right: 19px;
        color: #B2B2B2;
        font-size: 14px;
    }
    .bsInfo {
        text-align: center;
        .scImg {
            width: 188px;
            height: auto;
        }
        .big {
            margin-top: 18px;
            font-size: 22px;
            line-height: 33px;
            color: #4A4A4A;
            font-weight: 600;
        }
        .small {
            font-size: 14px;
            line-height: 21px;
            color: #888;
        }
    }
    .carBtn {
        display: block;
        width: 333px;
        height: 40px;
        line-height: 38px;
        margin: 0 auto;
        font-size: 15px;
        &.goBtn {
            margin-top: 30px;
        }
        &.backBtn {
            margin-top: 20px;
        }
    }
}
</style>
