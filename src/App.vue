<template>
    <div id="app">
        <router-view v-if="showRouter"/>
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
            showRouter: true,
        }
    },
    methods: {
        reload() {
            this.showRouter = false;
            this.$nextTick(() => {
                this.showRouter = true;
            })
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
