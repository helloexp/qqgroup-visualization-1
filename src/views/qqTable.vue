<!--局部样式-->
<style scoped>
    .headImg {
        width: 64px;
        height: 64px;
    }

    .pageLink {
        color: rgb(76, 162, 233);
        text-decoration: none;
    }

    .qqInfoWarp {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 30px;
    }

    .qqInfoWarp > img {
        width: 100px;
        height: 100px;
        margin-bottom: 20px;
    }

    .qqInfoWarp > span {
        font-size: 22px;
    }

    .tableLabel {
        font-size: 18px;
    }

    .groupTable {
        margin-top: 10px;
    }
</style>

<!--局部覆盖样式-->
<style>
</style>

<template>
    <div class="viewQQTable">
        <div class="qqInfoWarp">
            <img :src="`/qqgroup3d/images/qq/${ searchNum }`" />
            <span>{{ searchNum }}</span>
        </div>
        <label class="tableLabel">QQ加群信息：</label>
        <el-table
            v-loading="loading"
            class="groupTable"
            :data="tableData"
            stripe
            border>
            <el-table-column>
                <template slot-scope="scope">
                    <img class="headImg" :src="`/qqgroup3d/images/group/${ scope.row.groupNum }`" />
                </template>
            </el-table-column>
            <el-table-column
                label="加群名称">
                <template slot-scope="scope">
                    <a class="pageLink" :href="`/qqgroup3d/#/grouptable/${ scope.row.groupNum }`">{{ scope.row.groupTitle }}</a>
                </template>
            </el-table-column>
            <el-table-column
                label="群号">
                <template slot-scope="scope">
                    <a class="pageLink" :href="`/qqgroup3d/#/grouptable/${ scope.row.groupNum }`">{{ scope.row.groupNum }}</a>
                </template>
            </el-table-column>
            <el-table-column
                prop="groupSummary"
                label="群简介">
            </el-table-column>
            <el-table-column
                prop="groupCreateDate"
                label="群创建时间">
            </el-table-column>
            <el-table-column
                prop="groupClass"
                label="groupClass">
            </el-table-column>
            <el-table-column
                prop="groupMast"
                label="groupMast">
            </el-table-column>
            <el-table-column
                prop="userGroupNick"
                label="群内昵称">
            </el-table-column>
            <el-table-column
                label="群内性别">
                <template slot-scope="scope">
                    {{ scope.row.userGroupGender == "0" ? "男" : "女" }}
                </template>
            </el-table-column>
            <el-table-column
                prop="userGroupAge"
                label="群内年龄">
            </el-table-column>
            <el-table-column
                prop="userGroupAuth"
                label="群内权限">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import api from "@/api";

    export default {
        name: "viewQQTable",
        props: {

        },
        data () {
            return {
                //#region 页面对象
                //#endregion

                //#region 页面内容绑定数据
                    searchNum: "",
                    tableData: [],
                    loading: false,
                //#endregion

                //#region 页面样式绑定数据
                //#endregion
            };
        },
        watch: {
            "$route": "handleRouteChange",
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
                handleRouteChange (nv) {
                    this.searchNum = this.$route.params.num;
                    if (!this.searchNum) {
                        this.searchNum = "10001";
                    }
                    this.b_updateTable();
                },
            //#endregion

            //#region 业务逻辑方法
                async b_updateTable () {
                    this.loading = true;
                    try {
                        this.tableData = await api.queryQQTable(this.searchNum);
                        this.loading = false;
                    }
                    catch (e) {
                        this.loading = false;
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
            this.searchNum = this.$route.params.num;
            if (!this.searchNum) {
                this.searchNum = "10001";
            }
            let num = parseInt(this.searchNum);
            if (isNaN(num)) {
                this.$message({
                    type: "warning",
                    message: "查询内容输入非法！",
                });
                return;
            }
            if (num < 0 || num > 2147483647) {
                this.$message({
                    type: "warning",
                    message: "数据库暂未收录相关信息！",
                });
                return;
            }
            this.b_updateTable();
        },
        mounted () {

        },
        components: {

        },
    };
</script>