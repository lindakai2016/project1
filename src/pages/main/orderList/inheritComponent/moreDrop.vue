<template>
    <div class="moreDrop">
        <div class="head">
            <i class="iconfont icon-icon_moreoperations moreIc"></i>
        </div>
        <div class="drop">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.moreDrop {
    display: inline-block;
    user-select: none;
    text-align: left;
    position: relative;
    &:hover {
        .head {
            opacity: 0.8;
        }
        .drop {
            display: block;
        }
    }
    .head {
        cursor: pointer;
        padding-bottom: 12px;
        margin-top: 12px;
        .moreIc {
            font-size: 14px;
            color: #4780F7;
        }
    }
    .drop {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
        box-shadow: 0px 2px 8px 0px #d7d7d7;
        border-radius: 3px;
        padding: 2px 0;
        z-index: 1000;
        display: none;
        &::before {
            content: "";
            display: inline-block;
            border-bottom: 8px solid #fff;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            position: absolute;
            top: -6px;
            left: 50%;
            margin-left: -8px;
        }
    }
}
</style>
