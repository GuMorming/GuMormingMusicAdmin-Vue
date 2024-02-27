import {Online, OnlineQuery} from "@/api/user/types";
import {AxiosPromise,} from "axios";
import {PageResult, Result} from "@/model";
import request from "@/utils/request";

const baseURL = "/admin/online"

/**
 * 查看后台歌手列表
 * @param params 查询条件
 * @returns 后台歌手列表
 */
export function getOnlineList(params: OnlineQuery): AxiosPromise<Result<PageResult<Online[]>>> {
    return request({
        url: baseURL + "/list",
        method: "get",
        params,
    });
}

/**
 * 下线用户
 * @param token 在线token
 */
export function kickOutUser(token: string): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/kick/${token}",
        method: "get",
    });
}