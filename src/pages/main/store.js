import Vue from "vue";
const vue = new Vue();

export default {
    namespaced: true,
    state: { 
        cityList: null,
        userList: null,
        poiList: null,
    },
    getters: { 
        
    },
    mutations: {
        setCityList(state, list) {
            state.cityList = list;
        },
        setUserList(state, list) {
            state.userList = list;
        },
        setPoiList(state, list) {
            state.poiList = list;
        }
    },
    actions: { 
        getCityList(context) {
            vue.$api["cityList"]({}).then(res => {
                if(res.code != 100200) {
                    this.$message.warning(res.message || "请求失败");
                    return;
                }
                let cityList = res.data || [];
                context.commit("setCityList", cityList);
            }).catch(err => err);
        },
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
        },
        getPoiList(context) {
            vue.$api["hisAddrList"]({
                mapType: 1,
            }).then(res => {
                if(res.code != 100200) {
                    return;
                }
                let addrList = res.data && res.data.addressList || [];
                addrList.map(e => {
                    e.name = e.position;
                    e.nameEx = e.address;
                    e.location = {lng: e.longitude, lat: e.latitude};
                });
                context.commit("setPoiList", addrList);
            }).catch(err => err);
        }

    },
}