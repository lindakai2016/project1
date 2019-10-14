<template>
    <div class="userCarPersonSelect">
        <div class="selGr psSel" v-clickout="clickout">
            <div class="inputGr" :class="{focus: inFocus, err: err}">
                <input class="input" type="text" @input="input" @click="focus" :value="value" placeholder="请输入手机号">
                <i class="iconfont icon-home_icon_s sdi" @click="clickDropIcon"></i>
            </div>
            <div class="drop" v-if="showDrop">
                <div class="li" v-for="(item, i) in userListEx" :key="i" @click="chooseUser(item)">
                    <i class="iconfont icon-home_icon_numberofpeople posIc"></i>
                    <div class="psInfo">
                        <div class="big">{{item.contactName}}</div>
                        <div class="small">{{item.contactPhoneEx}}</div>
                    </div>
                    <i class="iconfont icon-shanchu delIc link" @click.stop="delRcUser(item)"></i>
                </div>
                <div class="li empty" v-if="userListEx.length <= 0">无最近联系人</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["value", "err"],
    model: {
        prop: "value",
        event: "inputValue",
    },
    data() {
        return {
            inFocus: 0,
        }
    },
    computed: {
        userList() {
            return this.$store.state.home.userList;
        },
        userListEx() {
            return this.userList && this.userList.filter(e => e.contactPhone.includes(this.value || "")) || [];
        },
        showDrop() {
            return this.inFocus && this.userList;
        },
    },
    methods: {
        clickout() {
            this.inFocus = false;
            this.$emit("blur");
        },
        clickDropIcon() {
            this.inFocus = !this.inFocus;
        },
        input() {
            this.$emit("inputValue",  event.target.value);
            this.inFocus = true;
        },
        focus() {
            this.inFocus = true;
        },
        chooseUser(item) {
            this.$emit("inputValue",  item.contactPhone);
            this.$emit("chooseUser", item);
            this.inFocus =false;
        },
        async delRcUser({ contactId }) {
            let op = await this.$dialog.delete("确定要删除此联系人？");
            if(op != "ok") {
                return;
            }
            this.$api["delHisUser"]({
                contact_id:  contactId
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.$message.success("删除成功");
                this.$store.dispatch("home/getUserList");
            }).catch(err => err);
        }
    }
}
</script>

<style lang="scss" scoped>
.userCarPersonSelect {
    position: relative;
    .selGr {
        display: inline-block;
        vertical-align: top;
        position: relative;
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
            max-height: 282px;
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
                &:hover {
                    background: #F9F9FC;
                }
                &.empty {
                    font-size: 12px;
                    color: #888;
                    padding: 5px 16px;
                    pointer-events: none;
                }
            }
        }
    }
    .psSel {
        width: 100%;
        .drop {
            .li {
                display: flex;
                align-items: center;
                .posIc {
                    color: #4A4A4A;
                    font-size: 16px;
                    margin-right: 13px;
                }
                .psInfo {
                    flex-grow: 1;
                    .big {
                        font-size: 14px;
                        font-weight: 600;
                        color: #4A4A4A;
                        line-height: 20px;
                    }
                    .small {
                        font-size: 12px;
                        font-weight: 400;
                        line-height: 17px;
                        margin-top: 3px;
                        color: #888;
                    }
                }
                .delIc {
                    color: #989EB6;
                    font-size: 16px;
                    margin-left: 8px;
                }
            }
        }
    }
}
</style>
