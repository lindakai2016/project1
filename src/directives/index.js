import Vue from "vue";

Vue.directive('clickout', {
    bind(el, binding) {
        el.__vueClickOutside__ = (e) => {
            if (el.contains(e.target)) return;
            binding.value(e);
        }
        document.addEventListener('click', el.__vueClickOutside__);
    },
    unbind(el) {
        document.removeEventListener('click', el.__vueClickOutside__);
        el.__vueClickOutside__ = null;
    },
});