<template>
    <div id="app">
        <router-view :key="rtVwKey"/>
    </div>
</template>

<script>
export default {
    name: 'App',
    provide () {
        return {
            reload: this.reload
        }
    },
    data() {
        return {
            rtVwKey: Date.now(),
        }
    },
    methods: {
        reload() {
            this.rtVwKey = Date.now();
        }
    }
}
</script>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: relative;
}
</style>
