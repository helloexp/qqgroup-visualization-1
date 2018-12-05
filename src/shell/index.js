
const shell = require("shelljs");
const colors = require("colors");

console.log("正在打开后端服务，请勿关闭...".cyan)
let child = shell.exec("node src/server/index.js", { async: true });
child.stdout.on("data", data => {
    console.log("正在打开前端服务，将会自动弹出浏览器...".cyan)
    shell.exec("webpack-dev-server --inline --progress --config build/webpack.dev.conf.js");
});