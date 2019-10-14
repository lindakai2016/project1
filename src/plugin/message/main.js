
import template from "./index";

export default {
    install: function(Vue) {

        let Plugin = Vue.extend(template);
        let instance = new Plugin();

        document.body.appendChild(instance.$mount().$el);

        Vue.prototype.$message = instance;
    }
}

