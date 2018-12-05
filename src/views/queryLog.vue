<!--局部样式-->
<style scoped>
    .headImg {
        width: 32px;
        height: 32px;
    }
</style>

<!--局部覆盖样式-->
<style>
</style>

<template>
    <div class="viewQueryLog">
        <el-table
            v-loading="loading"
            :data="tableData"
            stripe
            border>
            <el-table-column
                prop="ip"
                label="地址">
            </el-table-column>
            <el-table-column
                label="访问时间">
                <template slot-scope="scope">
                    {{ timeFormat(scope.row.time) }}
                </template>
            </el-table-column>
            <el-table-column
                prop="url"
                label="Url">
            </el-table-column>
            <el-table-column
                prop="apiName"
                label="访问接口">
            </el-table-column>
            <el-table-column
                sortable=""
                label="查询类型">
                <template slot-scope="scope">
                    <span style="color: salmon" v-if="scope.row.apiName == 'qq'">查QQ关系图</span>
                    <span style="color: red" v-else-if="scope.row.apiName == 'qqext'">查QQ二层关系图</span>
                    <span style="color: teal" v-else-if="scope.row.apiName == 'group'">查群关系图</span>
                    <span style="color: pink" v-else-if="scope.row.apiName == 'qqtable'">查QQ加群信息表</span>
                    <span style="color: cyan" v-else-if="scope.row.apiName == 'grouptable'">查群信息表</span>
                    <span style="color: royalblue" v-else-if="scope.row.apiName == 'querylog'">查接口访问日志</span>
                    <span v-else>其他</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="apiNum"
                label="查询号码">
                <template slot-scope="scope">
                    <a v-if="scope.row.apiNum" :href="pageUrl(scope.row)">{{ scope.row.apiNum }}</a>
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <img
                        class="headImg"
                        v-if="scope.row.apiName && scope.row.apiName.startsWith('qq')"
                        :src="`/qqgroup3d/images/qq/${ scope.row.apiNum }`" />
                    <img
                        class="headImg"
                        v-if="scope.row.apiName && scope.row.apiName.startsWith('group')"
                        :src="`/qqgroup3d/images/group/${ scope.row.apiNum }`" />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import api from "@/api";
    import Moment from "moment";

    export default {
        name: "viewQueryLog",
        props: {

        },
        data () {
            return {
                //#region 页面对象
                //#endregion

                //#region 页面内容绑定数据
                    loading: false,
                    tableData: [],
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
                async b_updateTable () {
                    this.loading = true;
                    try {
                        this.tableData = await api.queryLog();
                    }
                    catch (e) { }
                    this.loading = false;
                },
            //#endregion

            //#region 接口访问方法
            //#endregion

            //#region 数据转换方法
                timeFormat (time) {
                    return Moment(new Date(time)).format("YYYY-MM-DD HH:mm:ss");
                },

                pageUrl (row) {
                    let url = "/#/";
                    let num = row.apiNum;
                    if (row.apiName == "qqext") {
                        url = `/qqgroup3d/#/3d?search=qq&num=${ num }`;
                    }
                    else if (row.apiName == "group") {
                        url = `/qqgroup3d/#/3d?search=group&num=${ num }`;
                    }
                    else if (row.apiName == "qqtable") {
                        url = `/qqgroup3d/#/qqtable/${ num }`;
                    }
                    else if (row.apiName == "grouptable") {
                        url = `/qqgroup3d/#/grouptable/${ num }`;
                    }
                    return url;
                },
            //#endregion

            //#region 自动样式方法
            //#endregion

            //#region 其他方法
            //#endregion
        },
        created () {
            this.b_updateTable();
        },
        mounted () {

        },
        components: {

        },
    };
</script>