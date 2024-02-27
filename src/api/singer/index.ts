import {Axios, AxiosPromise} from "axios";
import {PageResult, Result} from "@/model";
import {Singer, SingerForm, SingerQuery} from "@/api/singer/types";
import request from "@/utils/request";

const baseURL = "/admin/singer";

export function getSingerList(params?: SingerQuery): AxiosPromise<Result<PageResult<Singer[]>>> {
    return request({
        url: baseURL + "/list",
        method: "get",
        params,
    });
}

/**
 * 删除歌手
 * @param data 歌手id集合
 */
export function deleteSinger(data: number[]): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/delete",
        method: "delete",
        data,
    });
}

/**
 * 添加歌手
 * @param data 歌手信息
 */
export function addSinger(data: SingerForm): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/add",
        method: "post",
        data,
    });
}

/**
 * 修改歌手
 * @param data 歌手信息
 */
export function updateSinger(data: SingerForm): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/update",
        method: "put",
        data,
    });
}