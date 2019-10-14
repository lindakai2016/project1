<template>
    <div class="baseDrop" :class="{dropActive: active, notri: notri}">
        <div class="head" @click="toggle" v-clickout="close">
            <slot name="head" :active="active"></slot>
        </div>
        <div class="drop">
            <slot name="drop" :active="active"></slot>
        </div>
    </div>
</template>

<script>

export default {
    props: ["notri"],
    data() {
        return {
            active: false,
        }
    },
    methods: {
        toggle() {
            this.active = !this.active;
        },
        close() {
            this.active = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.baseDrop {
    position: relative;
    display: inline-block;
    &:hover {
        .head {
            opacity: 0.8;
        }
    }
    &.dropActive {
        .drop {
            display: block;
        }
    }
    &.notri {
        .drop {
            top: calc(100% + 2px);
            &::before {
                content: none;
            }
        }
    }
    .head {
        cursor: pointer;
    }
    .drop {
        position: absolute;
        top: calc(100% + 12px);
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
