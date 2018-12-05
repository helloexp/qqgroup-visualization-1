
<style scoped>
    .app {
        width: 100%;
        height: 100%;
    }

    .myHeader {
        background-color: #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .myHeader .webSiteName {
        font-size: 22px;
        color: white;
        width: 25%;
    }

    .searchInput {
        width: 75%;
        max-width: 400px;
    }
</style>

<style>
    html, body {
        width: 100%;
        height: 100%;
        margin: 0px;
        padding: 0px;
    }
</style>




<template>
    <el-container class="app">
        <el-header class="myHeader">
            <div class="webSiteName">搜QQ</div>
            <search />
        </el-header>
        <el-main>
            <router-view />
        </el-main>
    </el-container>
</template>

<script>
    import search from "@/components/search";

    export default {
        name: 'App',
        data () {
            return {

            };
        },
        watch: {

        },
        computed: {

        },
        methods: {

        },
        mounted () {

        },
        components: {
            search,
        },
    };
</script>
