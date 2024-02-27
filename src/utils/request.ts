import useStore from "@/store";
import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {ElMessage, ElNotification} from "element-plus";
import {messageConfirm} from "./modal";
import {getToken, removeToken, token_prefix, TokenKey} from "./token";

// 是否显示重新登录
export let isReLogin = {show: false};

const instance = axios.create({
    baseURL: "/api",
    timeout: 10000,
    // 请求头
    headers: {
        "Content-Type": "application/json;charset=UTF-8",
    },
});

// 请求拦截器
instance.interceptors.request.use(
    /*请求前的回调函数*/
    (config: InternalAxiosRequestConfig) => {
        // 请求带token
        if (getToken()) {
            config.headers[TokenKey] = getToken();
            config.headers["Authorization"] = token_prefix + getToken();
        }
        return config;
    },
    /*请求失败的回调函数*/
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 配置响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        switch (response.data.code) {
            case 200:
                break;
            case 400:
                ElNotification({
                    title: "失败",
                    message: response.data.msg,
                    type: "error",
                });
                break;
            case 402:
                const {user} = useStore();
                if (!isReLogin.show) {
                    isReLogin.show = true;
                    messageConfirm("登录状态已过期，请重新登录")
                        .then(() => {
                            isReLogin.show = false;
                            user.LogOut().then(() => {
                                location.href = "/login";
                            });
                        })
                        .catch(() => {
                            isReLogin.show = false;
                        })
                        .finally(() => {
                            if (getToken()) {
                                removeToken();
                            }
                        });
                }
                break;
            case 500:
                ElNotification({
                    title: "失败",
                    message: response.data.msg,
                    type: "error",
                });
                break;
            default:
                ElNotification({
                    title: "失败",
                    message: response.data.msg,
                    type: "error",
                });
        }
        return response;
    },
    (error: AxiosError) => {
        let {message} = error;
        if (message === "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substring(message.length - 3) + "异常";
        }
        ElMessage({
            message: message,
            type: "error",
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    }
);

// 对外暴露
export default instance;