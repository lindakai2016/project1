import Vue from 'vue';
import dialog from "@/plugin/dialog/main";
import message from "@/plugin/message/main";
import loading from "@/plugin/loading/main";
import mask from "@/plugin/mask/main";

Vue.use(dialog);
Vue.use(message);
Vue.use(loading);
Vue.use(mask);

import dialogH5 from "@/plugin/dialogH5/main";

Vue.use(dialogH5);