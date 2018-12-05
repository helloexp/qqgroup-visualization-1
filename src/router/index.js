import Vue from 'vue';
import Router from 'vue-router';
import viewQQTable from "@/views/qqTable";
import viewGroupTable from "@/views/groupTable";
import viewGraph2d from "@/views/graph2d";
import viewGraph3d from "@/views/graph3d";
import viewQueryLog from "@/views/queryLog";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "viewGraph3d",
            component: viewGraph3d,
        },
        {
            path: "/qqtable/:num",
            name: "viewQQTable",
            component: viewQQTable,
        },
        {
            path: "/grouptable/:num",
            name: "viewGroupTable",
            component: viewGroupTable,
        },
        {
            path: "/2d",
            name: "viewGraph2d",
            component: viewGraph2d,
        },
        {
            path: "/3d",
            name: "viewGraph3d",
            component: viewGraph3d,
        },
        {
            path: "/queryLog",
            name: "viewQueryLog",
            component: viewQueryLog,
        },
    ]
})
