import Vue from 'vue';
import Vuex from "vuex";

import login from "@/pages/login/store";
import main from "@/pages/main/store";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        login,
        main,
    }
});