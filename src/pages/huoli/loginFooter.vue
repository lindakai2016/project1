<template>
    <div class="huoliLoginFooter">
        <img class="ftImg" src="@/static/images/login_img_copyright.svg" @dragstart.prevent/>
    </div>
</template>

<style lang="scss" scoped>
.huoliLoginFooter {
    position: absolute;
    bottom: 0;
    padding-bottom: 31px;
    width: 100%;
    text-align: center;
    .ftImg {
        height: auto;
        background-blend-mode: color;
    }
}
</style>
