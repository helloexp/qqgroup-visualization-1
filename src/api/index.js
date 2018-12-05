
import Http from "../http";

async function api_queryQQGraph (qqNum) {
    let reqUrl = `/qqgroup3d/api/qq/${ qqNum }`;
    let response = await Http.fetch(reqUrl);
    if (response.code == 200) {
        return response.data;
    }
    else {
        return null;
    }
}

async function api_queryQQExtGraph (qqNum) {
    let reqUrl = `/qqgroup3d/api/qqext/${ qqNum }`;
    let response = await Http.fetch(reqUrl);
    if (response.code == 200) {
        return response.data;
    }
    else {
        return null;
    }
}

async function api_queryGroupGraph (groupNum) {
    let reqUrl = `/qqgroup3d/api/group/${ groupNum }`;
    let response = await Http.fetch(reqUrl);
    if (response.code == 200) {
        return response.data;
    }
    else {
        return null;
    }
}

async function api_queryQQTable (qqNum) {
    let reqUrl = `/qqgroup3d/api/qqtable/${ qqNum }`;
    let response = await Http.fetch(reqUrl);
    if (response.code == 200) {
        return response.data;
    }
    else {
        return [];
    }
}

async function api_queryGroupTable (groupNum) {
    let reqUrl = `/qqgroup3d/api/grouptable/${ groupNum }`;
    let response = await Http.fetch(reqUrl);
    if (response.code == 200) {
        return response.data;
    }
    else {
        return null;
    }
}

async function api_queryLog () {
    let reqUrl = `/qqgroup3d/api/querylog`;
    let response = await Http.fetch(reqUrl);
    if (response.code == 200) {
        return response.data;
    }
    else {
        return [];
    }
}

export const queryQQGraph = api_queryQQGraph;
export const queryQQExtGraph = api_queryQQExtGraph;
export const queryGroupGraph = api_queryGroupGraph;
export const queryQQTable = api_queryQQTable;
export const queryGroupTable = api_queryGroupTable;
export const queryLog = api_queryLog;

export default {
    queryQQGraph: api_queryQQGraph,
    queryQQExtGraph: api_queryQQExtGraph,
    queryGroupGraph: api_queryGroupGraph,
    queryQQTable: api_queryQQTable,
    queryGroupTable: api_queryGroupTable,
    queryLog: api_queryLog,
};
