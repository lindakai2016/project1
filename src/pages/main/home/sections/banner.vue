<template>
    <div class="banner">
        <div class="big">{{company.customName}}</div>
        <div class="small">{{company.customMsg}}</div>
    </div>
</template>

<script>
export default {
    name: "bannner",
    data() {
        return {
            company: {},
        }
    },
    mounted() {
        this.company = localStorage.getItemObj("companyInfo");
    },
}
</script>

<style lang="scss" scoped>
.banner {
    box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.04);
    border-radius: 4px;
    background-image: url(../../../../static/images/home_img_banner.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: #fff;
    padding: 38px 0 38px 36px;
    min-height: 133px;
    .big {
        font-size: 24px;
        font-weight: 500;
        line-height: 38px;
    }
    .small {
        font-size: 14px;
        line-height: 18px;
        margin-top: 2px;
    }
}
</style>
