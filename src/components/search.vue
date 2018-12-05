<!--局部样式-->
<style scoped>
    .searchInput {
        width: 75%;
        max-width: 400px;
    }
</style>

<!--局部覆盖样式-->
<style>
</style>

<template>
    <el-input @keyup.enter.native="handleSearchClick" class="searchInput" :placeholder="autoPlaceholder" v-model="searchNum">
        <el-select v-model="searchType" slot="prepend">
            <el-option label="QQ关系图" value="qqgraph"></el-option>
            <el-option label="群关系图" value="groupgraph"></el-option>
            <el-option label="QQ关系表" value="qqtable"></el-option>
            <el-option label="群关系表" value="grouptable"></el-option>
        </el-select>
        <el-button @click="handleSearchClick" slot="append" icon="el-icon-search"></el-button>
    </el-input>
</template>

<script>

    export default {
        name: "search",
        props: {

        },
        data () {
            return {
                //#region 页面对象
                //#endregion

                //#region 页面内容绑定数据
                    searchNum: "",
                    searchType: "qqgraph",
                //#endregion

                //#region 页面样式绑定数据
                //#endregion
            };
        },
        watch: {
            searchType (nv) {
                this.searchNum = "";
            },
        },
        computed: {
            //#region 常量计算属性
            //#endregion

            //#region 数据转换计算属性
                autoPlaceholder () {
                    if (this.searchType.startsWith("qq")) {
                        return "请输入QQ号进行查找";
                    }
                    else if (this.searchType.startsWith("")) {
                        return "请输入群号进行查找";
                    }
                    else {
                        return "";
                    }
                },
            //#endregion
            
            //#region 样式计算属性
            //#endregion
        },
        methods: {
            //#region 页面事件方法
                handleSearchClick () {
                    if (this.searchNum.trim()) {
                        let dstUrl = "";
                        if (this.searchType == "qqgraph") {
                            dstUrl = `/3d?search=qq&num=${ this.searchNum }`;
                        }
                        else if (this.searchType == "groupgraph") {
                            dstUrl = `/3d?search=group&num=${ this.searchNum }`;
                        }
                        else if (this.searchType == "qqtable") {
                            dstUrl = `/qqtable/${ this.searchNum }`;
                        }
                        else if (this.searchType == "grouptable") {
                            dstUrl = `/grouptable/${ this.searchNum }`;
                        }
                        if (dstUrl) {
                            this.$router.push(dstUrl);
                        }
                    }
                    else {
                        this.$message({
                            type: "warning",
                            message: "请输入搜索信息！",
                        });
                    }
                },
            //#endregion

            //#region 业务逻辑方法
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

        },
        mounted () {

        },
        components: {

        },
    };
</script>