<template>
    <div class="charter">
        <div class="bookContent">
            <charterForm></charterForm>
        </div>
    </div>
</template>

<script>
import charterForm from "./charterType";

export default {
    components: {
        charterForm,
    },
    data () {
        return {
            
        }
    },
    computed: {
        
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
.charter {
    padding: 25px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.04);
    display: flex;
    justify-content: space-between;
    .bookContent {
        flex-shrink: 0;
    }
}
</style>
