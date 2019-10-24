<template>
    <div class="accounts">
        <!--账号列表-->
        <h3 class="title">账号列表</h3>
        <div class="tbHeader">
            <div class="td col_xm">员工姓名</div>
            <div class="td col_sj">员工手机号</div>
            <div class="td col_zt">状态</div>
            <div class="td col_bz">备注</div>
            <div class="td col_cz">操作</div>
        </div>
        <div class="tbbody">
            <div class="acItem" v-for="(item, i) in accountList" :key="i">
                <div class="td col_xm">{{item.name || "--"}}</div>
                <div class="td col_sj">{{item.phone || "--"}}</div>
                <div class="td col_zt">{{item.statusStr}}</div>
                <div class="td col_bz">{{item.remark}}</div>
                <div class="td col_cz">
                    <i class="iconfont icon-icon_detail link czIc" title="查看详情" @click="detailAc(item)"></i>
                    <i class="iconfont icon-bianji link czIc hov" title="编辑" @click="editAc(item)" v-if="item.userId != loginInfo.userId"></i>
                    <i class="iconfont icon-shanchu link czIc hov" title="删除" @click="deleteAc(item)" v-if="item.userId != loginInfo.userId"></i>
                </div>
            </div>
            <div class="empty" v-if="!hasAccount">
                <img src="@/static/images/home_img_empty.svg">
                <p class="emTxt">暂无账号</p>
            </div>
        </div>
         <!--账号详情-->
        <basePopup v-model="showAcDt">
            <accountDetail @exit="exitDetail" :acItem="acItem" :key="+showAcDt"></accountDetail>
        </basePopup>
        <!--编辑账号-->
        <basePopup v-model="showAcEd">
            <newAccount @exit="exitEdit" @submitOk="submitEdit" :acItem="acItem" :type="1" :key="+showAcEd"></newAccount>
        </basePopup>
    </div>
</template>

<script>
import basePopup from "@/commonComponents/basePopup";
import accountDetail from "./accountDetail";
import newAccount from "./newAccount";
import _ from "lodash";

export default {
    name: "accounts",
    props: ["data"],
    components: {
        accountDetail,
        newAccount,
        basePopup
    },
    data () {
        return {
            accountList: [],

            showAcDt: false,
            acItem: {},

            showAcEd: false,

            loginInfo: {},
        }
    },
    computed: {
        hasAccount() {
            return !!this.accountList.length;
        }
    },
    watch: {
        data: {
            immediate: true,
            handler(val) {
                let list = _.cloneDeep(val) || [];
                list.map(e => {
                    e.statusStr = {0: "停用", 1: "正常"}[e.status] || "--";
                });
                this.accountList = list;
            }
        }
    },
    mounted() {
        this.loginInfo = localStorage.getItemObj("loginInfo") || {};
    },
    methods: {
        detailAc(item) {
            this.acItem = item;
            this.showAcDt = true;
        },
        exitDetail() {
            this.showAcDt = false;
        },
        editAc(item) {
            this.acItem = item;
            this.showAcEd = true;
        },
        exitEdit() {
            this.showAcEd = false;
        },
        submitEdit() {
            this.showAcEd = false;
            this.$emit("editOk");
        },
        // 删除账号
        async deleteAc({userId}) {
            let op = await this.$dialog.delete("删除后账号将被停用，确认删除？");
            if(op != "ok") {
                return;
            }
            this.$api["accountDel"]({
                user_id:    userId
            }).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                this.$message.success("删除成功");
                this.$emit("delOk");
            }).catch(err => err); 
        },
    }
}
</script>

<style lang="scss" scoped>
@import "../scss/accounts.scss";
.accounts {
    .empty {
        text-align: center;
        padding: 100px 0;
        .emTxt {
            color: #888;
            font-size: 14px;
        }
    }
}
</style>
