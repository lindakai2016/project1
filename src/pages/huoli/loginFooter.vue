<template>
    <div class="huoliLoginFooter">
        <img class="ftImg" src="@/static/images/login_img_copyright.png" @dragstart.prevent/>
    </div>
</template>

<style lang="scss" scoped>
.huoliLoginFooter {
    position: absolute;
    bottom: 0;
    padding-bottom: 26px;
    width: 100%;
    text-align: center;
    .ftImg {
        height: 16px;
        background-blend-mode: color;
    }
}
</style>
