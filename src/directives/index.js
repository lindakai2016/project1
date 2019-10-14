import Vue from "vue";

Vue.directive('clickout', {
    bind(el, binding) {
        const documentHandler = (e) => {
            if (el.contains(e.target)) return;
            binding.value(e);
        }
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    unbind(el) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    },
});