
import axios from "axios";
import { Message } from "element-ui";
const qs = require("qs");

axios.defaults.timeout = 50000;
axios.defaults.baseURL = '';

//显示错误信息
function showError (msg) {
    Message({
        type: "error",
        message: msg,
    });
}

//显示警报信息
function showWarning (msg) {
    Message({
        type: "warning",
        message: msg,
    });
}

function http (config) {
    return new Promise((resolve, reject) => {
        axios(config).then(response => {
            if (response.status == 200) {
                resolve(response.data);
            }
            else {
                showError("网络请求发生错误！");
                reject(err);
            }
        }).catch(err => {
            showError("网络请求发生错误！");
            reject(err);
        });
    });
}

/**
 * 封装get方法
 * @param url 要请求的url地址
 * @param params 请求的参数
 * @returns {Promise}
 */
function http_fetch(url, params = { }) {
    return http({
        method: 'GET',
        url: url,
        params: params,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
export const fetch = http_fetch;

/**
 * 封装post请求
 * @param url 要请求的url地址
 * @param data 请求的参数
 * @returns {Promise}
 */
function http_post(url, data = { }) {
    return http({
        method: 'POST',
        url: url,
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
export const post = http_post;

/**
 * 封装Post提交表单
 * @param url 要请求的url地址
 * @param formData 需要提交的表单
 * @returns {Promise}
 */
function http_formSub(url, formData = { }) {
    return http({
        method: 'POST',
        url: url,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
export const formSub = http_formSub;

/**
 * 封装patch请求
 * @param url 要请求的url地址
 * @param data 请求的参数
 * @returns {Promise}
 */
function http_patch(url, data = { }) {
    return http({
        method: 'PATCH',
        url: url,
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
export const patch = http_patch;

/**
 * 封装put请求
 * @param url 要请求的url地址
 * @param data 请求的参数
 * @returns {Promise}
 */
function http_put(url, data = { }) {
    return http({
        method: 'PUT',
        url: url,
        data: data,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
export const put = http_put;

export default {
    fetch: http_fetch,
    post: http_post,
    formSub: http_formSub,
    patch: http_patch,
    put: http_put,
};
