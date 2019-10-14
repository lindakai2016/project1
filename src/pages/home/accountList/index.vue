<template>
    <div class="accountList">
        <h3 class="title">账号管理</h3>
        <div class="content" v-show="init">
            <button class="carBtn blue addBtn" @click="newAccount">
                <i class="iconfont icon-icon_add"></i>新增账号
            </button>
            <div class="filter">
                <div class="fi">
                    <label class="lb">员工姓名</label>
                    <inputGr class="input" placeholder="员工姓名搜索" v-model="name" clear="1"></inputGr>
                </div>
                <div class="fi">
                    <label class="lb">员工手机号</label>
                    <inputGr class="input" placeholder="员工手机号搜索" v-model="phone" clear="1"></inputGr>
                </div>
                <div class="fi">
                    <label class="lb">账号状态</label>
                    <selectGr class="stSel" v-model="state" placeholder="正常/停用">
                        <optionLi class="li" label="正常" :value="1"></optionLi>
                        <optionLi class="li" label="停用" :value="0"></optionLi>
                    </selectGr>
                </div>
                <button class="carBtn blue queryBtn" @click="getAccountList">查询</button>
            </div>
            <!--账号列表-->
            <accountList :data="accountList" @delOk="delAcOk" @editOk="editAcOk"></accountList>
            <pageNavi :total="total" :page="page" @pageChange="pageChange" @sizeChange="pageSizeChange" v-if="hasAcccount"></pageNavi>
        </div>
        <!--新建账号-->
        <basePopup v-model="showNewAc" :closeOnClickout="true">
            <newAccount @exit="exitNewAcDlg" @submitOk="newAcOk" :type="0"></newAccount>
        </basePopup>
    </div>
</template>

<script>
import inputGr from "./inheritComponent/Input";
import selectGr from "./inheritComponent/Select";
import optionLi from "@/commonComponents/baseOption";
import basePopup from "@/commonComponents/basePopup";
import accountList from "./components/accountList";
import newAccount from "./components/newAccount";
import pageNavi from "@/commonComponents/pageNavi";
import _ from "lodash";
// import testAccountList from "./testData/accountList";

export default {
    components: {
        inputGr,
        selectGr,
        optionLi,
        accountList,
        pageNavi,
        newAccount,
        basePopup
    },
    data () {
        return {
            name: "",
            phone: "",
            state: "",

            accountList: [],
            page: 1,
            pageSize: 10,
            total: 0,

            showAcDt: true,
            showNewAc: false,

            pgInit: 0,
        }
    },
    watch: {
        name() {
            this.filterChange();
        },
        phone() {
            this.filterChange();
        },
        state() {
            this.filterChange();
        },
        page() {
            this.getAccountList();
        }
    },
    computed: {
        init() {
            return this.pgInit > 0;
        },
        hasAcccount() {
            return this.accountList.length > 0;
        }
    },
    mounted() {
        this.pgInit = 0;
        this.getAccountList();
    },
    methods: {
        newAccount() {
            this.showNewAc = true;
        },
        exitNewAcDlg() {
            this.showNewAc = false;
        },
        filterChange() {
            this.page = 1;
            this.getAccountList();
        },
        pageChange(n) {
            this.page = n;
            this.getAccountList();
        },
        pageSizeChange(n) {
            this.page = 1;
            this.pageSize = n;
            this.getAccountList();
        },
        getAccountList: _.debounce(function() {
            let {name, phone, state, page, pageSize} = this;
            this.$api["accountList"]({
                name,
                phone,
                status:     state,
                page_index: page,
                page_size:  pageSize,
            }).then(res => {
                this.pgInit = 1;
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                let {count, customerList} = res.data || {};
                this.total = count || 0;
                this.accountList = customerList || [];
            }).catch(err => {
                this.pgInit = 1;
                console.log(err);
            });
        }, 300),
        delAcOk() {
            this.page = 1;
            this.getAccountList();
        },
        editAcOk() {
            this.getAccountList();
        },
        newAcOk() {
            this.page = 1;
            this.getAccountList();
        }
    }
}
</script>

<style lang="scss" scoped>
.accountList {
    padding: 27px 0 80px 0;
    .title {
        font-weight: 600;
        font-size: 16px;
        line-height: 23px;
        color: #000;
    }
    .content {
        background: #fff;
        box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.04);
        border-radius: 3px;
        padding: 25px;
        margin-top: 25px;
        .addBtn {
            height: 38px;
            line-height: 38px;
            width: 110px;
            .iconfont {
                font-size: 12px;
                margin-right: 3px;
            }
        }
        .filter {
            border-bottom: 1px solid #F5F5F5;
            padding: 25px 0;
            .fi {
                margin-right: 30px;
                display: inline-flex;
                align-items: center;
                height: 35px;
                .lb {
                    margin-right: 12px;
                    color: #888;
                    font-size: 13px;
                }
                .input {
                    width: 200px;
                    height: 35px;
                    line-height: 33px;
                }
                .stSel {
                    width: 100px;
                    .li {
                        width: 100px;
                    }
                }
            }
            .queryBtn {
                height: 35px;
                width: 70px;
                line-height: 35px;
                margin-left: calc(-30px + 8px);
            }
        }
    }
}
</style>
