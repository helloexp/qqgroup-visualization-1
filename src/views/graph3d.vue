<!--局部样式-->
<style scoped>
    .viewGraph3d {
        position: fixed;
        top: 60px;
        left: 0px;
        width: 100%;
        bottom: 0px;
    }
</style>

<!--局部覆盖样式-->
<style>
    .qqWindow {
        display: inline-flex;
        align-items: center;
        box-sizing: border-box;
        padding: 10px;
        background-color: rgba(51, 51, 51, 0.7);
        border-radius: 4px;
        font-size: 12px;
        color: #ddd;
    }
    .qqWindow > img {
        width: 100px;
        height: 100px;
        border: solid 1px #999;
    }
    .qqWindow > .infoWarp {
        width: 150px;
        height: 100px;
        margin-left: 10px;
    }
    .qqWindow > .infoWarp label {
        color: white;
        font-weight: bold;
    }
    .qqWindow > .infoWarp > .fieldWarp {
        height: 20px;
    }
    .qqWindow > .infoWarp > .nickWarp {
        box-sizing: border-box;
        margin: 0px;
        padding: 0px;
        height: 60px;
        overflow-y: auto;
        border: solid 1px #999;
        background-color: rgba(51, 51, 51, 0.8);
    }

    .groupWindow {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        padding: 10px;
        background-color: rgba(51, 51, 51, 0.7);
        border-radius: 4px;
        font-size: 12px;
        color: #ddd;   
    }
    .groupWindow img {
        box-sizing: border-box;
        width: 100px;
        height: 100px;
        border: solid 1px #999;
    }
    .groupWindow label {
        color: white;
        font-weight: bold;
    }
    .groupWindow > .groupInfoWarp {
        width: 100%;
        height: 100px;
        display: flex;
    }
    .groupWindow > .groupInfoWarp > .fieldInfoWarp {
        width: 160px;
        height: 100px;
        padding-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .groupWindow > .groupInfoWarp > .fieldInfoWarp > div {
        height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .groupWindow > .groupInfoWarp > .fieldInfoWarp > div:last-child {
        height: 36px;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        white-space: unset;     
    }
    .groupWindow > .memberInfoWarp {
        margin-top: 10px;
        width: 260px;
        height: 160px;
        border: solid 1px #999;
        background-color: rgba(51, 51, 51, 0.8);
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>

<template>
    <div
        class="viewGraph3d"
        v-loading="loading"
        :element-loading-text="loadingText"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="graph"></div>
    </div>
</template>

<script>
    import * as THREE from "three";
    import ForceGraph3D from "3d-force-graph";
    import SpriteText from "three-spritetext";
    import api from "@/api";
    import defaultMemberImg from "@/assets/images/qq.jpeg";
    import defaultGroupImg from "@/assets/images/group.jpg";

    export default {
        name: "viewGraph3d",
        props: {

        },
        data () {
            return {
                //#region 页面对象
                    //力导向图对象
                    graph: null,
                    //图像摄像机
                    graphCamera: null,
                    //图像渲染器
                    graphRender: null,
                    //图像场景
                    graphScene: null,
                    //图片Map
                    imgMap: null,
                //#endregion

                //#region 页面内容绑定数据
                    searchType: "qq",
                    searchNum: "",

                    loading: false,
                    loadingText: "",
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
                //群成员默认头像
                autoDefaultMemberImg () {
                    let img = new Image();
                    img.src = defaultMemberImg;
                    return img;
                },
                //群默认头像
                autoDefaultGroupImg () {
                    let img = new Image();
                    img.src = defaultGroupImg;
                    return img;
                },
            //#endregion

            //#region 数据转换计算属性
            //#endregion
            
            //#region 样式计算属性
            //#endregion
        },
        methods: {
            //#region 页面事件方法
                //路由改变触发更新事件
                handleRouteChange (nv) {
                    this.b_updateRoute();
                },
            //#endregion

            //#region 业务逻辑方法
                //初始化图表
                b_graphInit () {
                    const forceGraph3D = ForceGraph3D();
                    this.graph = forceGraph3D(this.$el.querySelector(".graph"));
                    this.graphCamera = this.graph.camera();
                    this.graphRender = this.graph.renderer();
                    this.graphScene = this.graph.scene();
    
                    let loader = new THREE.CubeTextureLoader();
                    loader.setPath("/static/texture/");
                    let textureCube = loader.load([
                        'posx.jpg', 'negx.jpg',
                        'posy.jpg', 'negy.jpg',
                        'posz.jpg', 'negz.jpg',
                    ]);
                    this.graphScene.background = textureCube;

                    window.addEventListener("resize", this.onThreeResize, false);
                },
                //根据路由更新图表
                b_updateRoute () {
                    this.searchType = this.$route.query.search;
                    if (!this.searchType) {
                        this.searchType = "qq";
                    }
                    this.searchNum = this.$route.query.num;
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
                    this.b_updateGraph();
                },
                //更新图表
                async b_updateGraph () {
                    this.loading = true;
                    this.loadingText = "获取关系数据中...";
                    let result = null;
                    if (this.searchType == "qq") {
                        result = await api.queryQQExtGraph(this.searchNum);
                    }
                    else if (this.searchType == "group") {
                        result = await api.queryGroupGraph(this.searchNum);
                    }
                    if (result) {
                        let data = this.graphData(result);
                        if (data.nodes.length < 1) {
                            this.$message({
                                type: "success",
                                message: "未查询到关系信息！",
                            });
                        }
                        else {
                            this.loadingText = "获取头像资源中...";
                            let keyList = this.imgKeyList(result);
                            await this.b_updateImgMap(result);
                            this.loadingText = "开始绘制图表...";
                            this.graph
                            // .backgroundColor("#cae4f5")
                            .linkColor(link => {
                                let color = "rgb(140, 140, 140)";
                                let auth = link.linkValue.linkAuth;
                                if (auth == 4) {
                                    color = "red";
                                }
                                else if (auth == 2) {
                                    color = "green";
                                }
                                return color;
                            })
                            .linkOpacity(1)
                            .nodeId("nodeId")
                            .linkSource("sourceId")
                            .linkTarget("targetId")
                            .nodeAutoColorBy("nodeId")
                            .nodeThreeObject(node => {
                                return this.headBall(node);
                            })
                            .nodeLabel(node => {
                                if (node.nodeType == "group") {
                                    return this.groupWindowHtml(node);
                                }
                                else if (node.nodeType == "member") {
                                    return this.memberWindowHtml(node);
                                }
                                else {
                                    return "";
                                }
                            })
                            .graphData(data);
                        }
                    }
                    this.loading = false;
                },
                //更新头像Map
                async b_updateImgMap (data) {
                    let keyList = this.imgKeyList(data);
                    this.imgMap = await this.getImgMap(keyList);
                },
            //#endregion

            //#region 资源访问方法
                //传入图片Url获取图片资源，返回一个Promise对象
                getImg (url, timeout = 60000) {
                    return new Promise((resolve, reject) => {
                        try {
                            let imgObj = new Image();
                            imgObj.src = url;
                            let id = setTimeout(() => {
                                reject();
                            }, timeout);
                            imgObj.onload = () => {
                                clearTimeout(id);
                                resolve(imgObj);
                            };
                            imgObj.onerror = () => {
                                reject();
                            };
                        }
                        catch (e) {
                            reject();
                        }
                    });
                },
                //新建一个用于绘制图像的Canvas
                createCanvas () {
                    let canvas = document.createElement("canvas");
                    canvas.width = 128;
                    canvas.height = 64;
                    let ctx = canvas.getContext("2d");
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    return canvas;                
                },
                //把图像按照合适的方式绘制到空白Canvas之上
                drawImgToCanvas (img, cvs) {
                    let ctx = cvs.getContext("2d");
                    ctx.drawImage(img, 0, 0, 64, 64);
                    ctx.drawImage(img, 64, 0, 64, 64);
                },
                //根据图像生成适用于贴图的Canvas
                buildCanvas (img) {
                    let cvs = this.createCanvas();
                    this.drawImgToCanvas(img, cvs);
                    return cvs;
                },
            //#endregion

            //#region 数据转换方法
                //获取群成员头像的Url地址
                memberImgUrl (qqNum) {
                    return `/qqgroup3d/images/qq/${ qqNum }`;
                },
                //获取群头像的Url地址
                groupImgUrl (groupNum) {
                    return `/qqgroup3d/images/group/${ groupNum }`;
                },
                //根据接口返回数据格式整理出力导向图实际可用的数据格式
                graphData (data) {
                    let linkList = data.link.map(link => {
                        return {
                            sourceId: link.linkQQNum,
                            targetId: link.linkGroupNum,
                            linkLabel: link.linkNick,
                            linkValue: link,
                        };
                    });
                    let groupList = data.group.map(group => {
                        return {
                            nodeId: group.groupNum,
                            nodeType: "group",
                            nodeLabel: group.groupTitle,
                            nodeValue: group,
                        };
                    });
                    //回查群员昵称列表
                    groupList.forEach(group => {
                        let groupLinkList = linkList.filter(link => link.targetId == group.nodeId);
                        group.memberNickList = groupLinkList.map(link => link.linkLabel);
                    });
                    let memberList = data.member.map(member => {
                        return {
                            nodeId: member.memberQQNum,
                            nodeType: "member",
                            nodeLabel: "",
                            nodeValue: member,
                        };
                    });
                    //回查群成员群昵称信息
                    memberList.forEach(member => {
                        let memberLinkList = linkList.filter(link => link.sourceId == member.nodeId);
                        member.nickList = memberLinkList.map(link => link.linkLabel);
                        if (member.nickList.length > 0) {
                            member.nodeLabel = member.nickList[0];
                        }
                    });
                    let nodeList = groupList.concat(memberList);
                    return {
                        nodes: nodeList,
                        links: linkList,
                    };
                },
                //根据接口返回数据整理出去重后的图像Map键值
                imgKeyList (data) {
                    let list = data.group.map(item => `g${ item.groupNum }`);
                    list = list.concat(data.member.map(item => `m${ item.memberQQNum }`));
                    let dstSet = new Set(list);
                    return Array.from(dstSet);
                },

                //异步获取头像Map，这里返回一个Promise
                getImgMap (keyList) {
                    let imgMap = new Map();
                    if (keyList.length < 1) {
                        return imgMap;
                    }
                    else {
                        return new Promise((resolve, reject) => {
                            try {
                                keyList.forEach(async keyStr => {
                                    let imgUrl = "";
                                    let num = keyStr.substring(1);
                                    let type = "member";
                                    if (keyStr.startsWith("g")) {
                                        type = "group";
                                        imgUrl = this.groupImgUrl(num);
                                    }
                                    else if (keyStr.startsWith("m")) {
                                        type = "member";
                                        imgUrl = this.memberImgUrl(num);
                                    }
                                    try {
                                        let img = await this.getImg(imgUrl);
                                        imgMap.set(keyStr, img);
                                    }
                                    catch (e) {
                                        if (type == "member") {
                                            imgMap.set(keyStr, this.autoDefaultMemberImg);
                                        }
                                        else {
                                            imgMap.set(keyStr, this.autoDefaultGroupImg);
                                        }
                                    }
                                    this.loadingText = `获取头像资源中(${ imgMap.size }/${ keyList.length })...`;
                                    if (imgMap.size == keyList.length) {
                                        resolve(imgMap);
                                    }
                                });
                            }
                            catch (e) {
                                reject(e);
                            }
                        });
                    }
                },

                //生成成员信息浮动窗体
                memberWindowHtml (node) {
                    let nickSet = new Set(node.nickList);
                    let nickList = Array.from(nickSet);
                    let nickListText = nickList.join("，");
                    let temp = `
                        <div class="qqWindow">
                            <img src="${ this.memberImgUrl(node.nodeId) }" />
                            <div class="infoWarp">
                                <div class="fieldWarp">
                                    <label>QQ:</label>
                                    <span>${ node.nodeId }</span>
                                </div>
                                <div class="fieldWarp">
                                    <label>群内昵称：</label>
                                </div>
                                <div class="nickWarp">
                                    ${ nickListText }
                                </div>
                            </div>
                        </div>
                    `;
                    return temp;
                },
                //生成群信息浮动窗体
                groupWindowHtml (node) {
                    let nickSet = new Set(node.memberNickList);
                    let nickList = Array.from(nickSet);
                    let nickListText = nickList.join("，");
                    let temp = `
                        <div class="groupWindow">
                            <div class="groupInfoWarp">
                                <img src="${ this.groupImgUrl(node.nodeId) }" />
                                <div class="fieldInfoWarp">
                                    <div>
                                        <label>群名称：</label>
                                        <span>${ node.nodeValue.groupTitle }</span>
                                    </div>
                                    <div>
                                        <label>群号：</label>
                                        <span>${ node.nodeId }</span>
                                    </div>
                                    <div>
                                        <label>创建时间：</label>
                                        <span>${ node.nodeValue.groupCreateDate }</span>
                                    </div>
                                    <div>
                                        <label>群简介：</label>
                                        <span>${ node.nodeValue.groupSummary }</span>
                                    </div>
                                </div>
                            </div>
                            <div class="memberInfoWarp">
                                ${ nickListText }
                            </div>
                        </div>
                    `;
                    return temp;
                },

                //生成头像球体
                headBall (node) {
                    let num = node.nodeId;
                    let type = node.nodeType;
                    let keyStr = "";
                    if (type == "group") {
                        keyStr = `g${ num }`;
                    }
                    else if (type == "member") {
                        keyStr = `m${ num }`;
                    }
                    let img;
                    if (this.imgMap.has(keyStr)) {
                        img = this.imgMap.get(keyStr);
                    }
                    else {
                        img = null;
                    }
                    let cvs = this.createCanvas();
                    this.drawImgToCanvas(img, cvs);
                    let texture = new THREE.Texture(cvs);
                    //新建标准网孔材质
                    let ballMat = new THREE.MeshStandardMaterial( {
                        color: "white",
                        roughness: 0.4,
                        metalness: 0.4,
                        map: texture,
                    });
                    texture.needsUpdate = true;
                    let radius = 5;
                    if (node.nodeType == "group") {
                        radius = 9;
                    }
                    let ballGeometry = new THREE.SphereGeometry(radius, 16, 16);
                    let ballMesh = new THREE.Mesh(ballGeometry, ballMat);
                    ballMesh.rotation.y = Math.PI; 

                    //把头像球体和文字整合成为一个3D对象
                    let group = new THREE.Object3D();
                    group.add(ballMesh);
                    let nodeLabel = new SpriteText(node.nodeLabel);
                    nodeLabel.textHeight = 5;
                    nodeLabel.color = "white";
                    nodeLabel.position.y = -8;
                    group.add(nodeLabel);
                    return group;
                },
            //#endregion

            //#region 自动样式方法
            //#endregion

            //#region 其他方法
                //重置显示区域大小
                onThreeResize () {
                    let $this = $(this.$el);
                    let width = $this.width();
                    let height = $this.height();
                    this.graphCamera.aspect = width / height;
                    this.graphCamera.updateProjectionMatrix();
                    this.graphRender.setSize(width, height);
                },
            //#endregion
        },
        created () {

        },
        mounted () {
            this.b_graphInit();
            this.b_updateRoute();
        },
        components: {

        },
    };
</script>