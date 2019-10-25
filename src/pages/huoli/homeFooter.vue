<template>
    <div class="huoliHomeFooter">
        <img class="ftImg" src="@/static/images/home_img_copyright.png" @dragstart.prevent/>
    </div>
</template>

<style lang="scss" scoped>
.huoliHomeFooter {
    position: absolute;
    bottom: 0;
    padding-bottom: 26px;
    width: 100%;
    text-align: center;
    .ftImg {
        height: 14px;
    }
}
</style>
