<!--局部样式-->
<style scoped>
    .viewGraph2d {

    }
</style>

<!--局部覆盖样式-->
<style>
</style>

<template>
    <div class="viewGraph2d">
        2d图
    </div>
</template>

<script>
    import api from "@/api";

    export default {
        name: "viewGraph2d",
        props: {

        },
        data () {
            return {
                //#region 页面对象
                //#endregion

                //#region 页面内容绑定数据
                    searchType: "qq",
                    searchNum: "",
                //#endregion

                //#region 页面样式绑定数据
                //#endregion
            };
        },
        watch: {

        },
        computed: {
            //#region 常量计算属性
            //#endregion

            //#region 数据转换计算属性
            //#endregion
            
            //#region 样式计算属性
            //#endregion
        },
        methods: {
            //#region 页面事件方法
            //#endregion

            //#region 业务逻辑方法
                async b_updateGraph () {
                    let result = null;
                    if (this.searchType == "qq") {
                        result = await api.queryQQExtGraph(this.searchNum);
                    }
                    else if (this.searchType == "group") {
                        result = await api.queryGroupGraph(this.searchNum);
                    }
                    if (result) {
                        console.log(result);
                    }
                },
            //#endregion

            //#region 接口访问方法
            //#endregion

            //#region 数据转换方法
            //#endregion

            //#region 自动样式方法
            //#endregion

            //#region 其他方法
            //#endregion
        },
        created () {
            this.searchType = this.$route.query.search;
            if (!this.searchType) {
                this.searchType = "qq";
            }
            this.searchNum = this.$route.query.num;
            if (!this.searchNum) {
                this.searchNum = "10001";
            }
            this.b_updateGraph();
        },
        mounted () {

        },
        components: {

        },
    };
</script>