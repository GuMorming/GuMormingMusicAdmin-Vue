import {Result} from "@/model";
import request from "@/utils/request";
import {AxiosPromise} from "axios";
import {BackInfo} from "./types";

/**
 * 获取后台信息
 * @returns 后台信息
 */
export function getBackInfo(): AxiosPromise<Result<BackInfo>> {
    return request({
        url: "/admin",
        method: "get",
    });
}

/**
 * 上传访客信息
 */
export function report(): AxiosPromise<Result<null>> {
    return request({
        url: "/report",
        method: "post",
    });
}