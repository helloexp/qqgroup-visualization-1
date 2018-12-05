
const Koa = require("koa");
const KoaRouter = require("koa-router");
const KoaStatic = require("koa-static");
const MSSQL = require("mssql");
const Moment = require("moment");
const colors = require("colors");
const fs = require("fs");

//服务端端口
const serverPort = 10241;
//数据库连接配置信息
const config = require("../../db.json");

//404中间件
function hold404 (ctx, next) {
    let code = 404;
    ctx.status = code;
    ctx.body = {
        code: code,
        data: null,
        msg: "资源不存在",
    };
}

//500中间件
function setCtx500 (ctx) {
    let code = 500;
    ctx.status = code;
    ctx.body = {
        code: code,
        data: null,
        msg: "服务器内部错误",
    };   
}

//记录每一次请求信息到日志文件的中间件
function holdAll (ctx, next) {
    let path = ctx.path;
    let ip = ctx.ip;
    fs.appendFile("log.txt", `${ ip } ${ Moment(new Date).format("YYYY-MM-DD HH:mm:ss") } ${ path }\r\n`, err => { });
    return next();
}

let lock = false;

function holdFuck (ctx, next) {
    if (lock == false) {
        lock = true;
        setTimeout(() => {
            lock = false;
        }, 1000);
        return next();
    }
    else {
        return false;
    }
}

//主函数
async function main () {
    try {
        let pool = await MSSQL.connect(config);
        let app = new Koa();
        let router = new KoaRouter();

        //根据QQ号查询关系图接口
        router.get("/qqgroup3d/api/qq/:num", async (ctx, next) => {
            try {
                let qqNum = Number(ctx.params.num);
                let result = await pool.request()
                                .input("QQNum", MSSQL.Int, qqNum)
                                .execute("queryByQQNum");
                let code = 200;
                ctx.status = code;
                ctx.body = {
                    code: code,
                    data: {
                        member: result.recordsets[0],
                        group: result.recordsets[1],
                        link: result.recordsets[2],
                    },
                    msg: "查询成功",
                };
            }
            catch (e) {
                setCtx500(ctx);   
            }
        });

        //根据QQ号二次迭代查询关系图接口
        router.get("/qqgroup3d/api/qqext/:num", async (ctx, next) => {
            try {
                let qqNum = Number(ctx.params.num);
                let result = await pool.request()
                                .input("QQNum", MSSQL.Int, qqNum)
                                .execute("queryByQQNumExt");
                let code = 200;
                ctx.status = code;
                ctx.body = {
                    code: code,
                    data: {
                        member: result.recordsets[0],
                        group: result.recordsets[1],
                        link: result.recordsets[2],
                    },
                    msg: "查询成功",
                };
            }
            catch (e) {
                setCtx500(ctx);
            }
        });

        //根据群号查询关系图接口
        router.get("/qqgroup3d/api/group/:num", async (ctx, next) => {
            try {
                let groupNum = Number(ctx.params.num);
                let result = await pool.request()
                                .input("groupNum", MSSQL.Int, groupNum)
                                .execute("queryByGroupNum");
                let code = 200;
                ctx.status = code;
                ctx.body = {
                    code: code,
                    data: {
                        member: result.recordsets[0],
                        group: result.recordsets[1],
                        link: result.recordsets[2],
                    },
                    msg: "查询成功",
                };
            }
            catch (e) {
                setCtx500(ctx);
            }
        });

        //QQ信息表查询接口
        router.get("/qqgroup3d/api/qqtable/:num", async (ctx, next) => {
            try {
                let qqNum = Number(ctx.params.num);
                let result = await pool.request()
                                .input("qqNum", MSSQL.Int, qqNum)
                                .execute("queryTableByQQNum");
                let code = 200;
                ctx.status = code;
                ctx.body = {
                    code: code,
                    data: result.recordsets[0],
                    msg: "查询成功",
                };
            }
            catch (e) {
                setCtx500(ctx);       
            }
        });

        //群信息表查询接口
        router.get("/qqgroup3d/api/grouptable/:num", async (ctx, next) => {
            try {
                let groupNum = Number(ctx.params.num);
                let result = await pool.request()
                                .input("groupNum", MSSQL.Int, groupNum)
                                .execute("queryTableByGroupNum");
                let code = 200;
                ctx.status = code;
                ctx.body = {
                    code: code,
                    data: {
                        group: result.recordsets[0],
                        member: result.recordsets[1],
                    },
                    msg: "查询成功",
                };
            }
            catch (e) {
                setCtx500(ctx);
            }
        });

        router.get("/qqgroup3d/api/querylog", async (ctx, next) => {
            try {
                let fileContent = fs.readFileSync("log.txt").toString();
                let logList = fileContent.split("\n").map(item => item.trim()).filter(item => item).map(text => {
                    let textSeg = text.split(" ");
                    let url = textSeg[3];
                    let urlSeg = url.split("/");
                    let apiName = urlSeg[2];
                    let apiNum = urlSeg[3];
                    return {
                        ip: textSeg[0],
                        time: Number(new Date(textSeg[1] + " " + textSeg[2])),
                        url: textSeg[3],
                        apiName: apiName,
                        apiNum: apiNum,
                    };
                }).sort((a, b) => b.time - a.time);
                let code = 200;
                ctx.status = code;
                ctx.body = {
                    code: code,
                    data: logList,
                    msg: "查询成功",
                };
            }
            catch (e) {
                setCtx500(ctx);
            }  
        });

        app
            .use(KoaStatic(__dirname + "/www"))
            .use(holdAll)
            .use(holdFuck)
            .use(router.routes())
            .use(hold404);

        app.listen(serverPort);
        console.log(`OK！现在后端服务已经启动，工作在 ${ serverPort } 端口，如需一直开启服务请不要关闭此进程...`.green);
    }
    catch (e) {
        console.error(e.message);
    }
}

main();