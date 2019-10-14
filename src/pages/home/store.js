import Vue from "vue";
let vue = new Vue();

export default {
    namespaced: true,
    state: { 
        cityList: null,
        userList: null,
    },
    getters: { 
        
    },
    mutations: {
        setCityList(state, list){
            state.cityList = list;
        },
        setUserList(state, list){
            state.userList = list;
        }
    },
    actions: { 
        getUserList(context) {
            vue.$api["hisUserList"]({}).then(res => {
                if(res.code != 100200) {
                    return;
                }
                let userList = res.data && res.data.contactList || [];
                userList.map(e => {
                    e.contactPhoneEx = e.contactPhone && e.contactPhone.fmtPhone();
                });
                context.commit("setUserList", userList);
            }).catch(err => err);
        }
    },
}