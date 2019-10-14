<template>
    <div class="accountProfile">
        <h3 class="title">账户概况</h3>
        <p class="subTitle">用车金额的统计未包含未报价订单</p>
        <div class="profile">
            <div class="pfi row">
                <i class="iconfont icon-home_icon_singularquantity vmid"/>
                <div class="gr vmid">
                    <p class="val">{{account.orderNum || "--"}}</p>
                    <p class="lb">总单量</p>
                </div>
            </div>
            <div class="pfi row">
                <i class="iconfont icon-hx_danzi vmid"/>
                <div class="gr vmid">
                    <p class="val">
                        <i class="rmb">¥</i>
                        <i class="rmbNum">{{account.orderPrice || "--"}}</i>
                    </p>
                    <p class="lb">用车金额</p>
                </div>
            </div>
            <div class="pfi row">
                <i class="iconfont icon-home_icon_numberofpeople vmid"/>
                <div class="gr vmid">
                    <p class="val">{{account.userNum || "--"}}</p>
                    <p class="lb">用车人数</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["data"],
    computed: {
        account() {
            return this.data || {};
        }
    }
}
</script>

<style lang="scss" scoped>
.accountProfile {
    position: relative;
    .title {
        font-size: 16px;
        line-height: 23px;
        font-weight: 600;
        color: #000;
    }
    .subTitle {
        font-size: 14px;
        line-height: 20px;
        color: #888;
        font-weight: 400;
        margin-top: 8px;
    }
    .profile {
        background: #fff;
        box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.04);
        border-radius: 4px;
        margin-top: 16px;
        display: flex;
        align-items: center;
        min-height: 159px;
        .pfi {
            width: 33%;
            text-align: center;
            position: relative;
            &:not(:last-of-type):after {
                content: "";
                display: inline-block;
                width: 1px;
                height: 50px;
                background: #D7D7D7;
                position: absolute;
                right: 0;
                top: 9px;
            }
            .iconfont {
                width: 48px;
                height: 48px;
                border-radius: 100%;
                background:rgba(71,128,247,0.1);
                line-height: 48px;
                text-align: center;
                font-size: 18px;
                color: #3688FF;
            }
            .gr {
                text-align: center;
                width: 120px;
                .val {
                    font-size: 35px;
                    line-height: 49px;
                    font-weight: 400;
                    color: #4780F7;
                    .rmb {
                        font-size: 20px;
                        line-height: 20px;
                        display: inline-block;
                    }
                    .rmbNum {
                        vertical-align: middle;
                    }
                }
                .lb {
                    font-size: 13px;
                    line-height: 18px;
                    color: #4A4A4A;
                }
            }
        }
    }
}
</style>
