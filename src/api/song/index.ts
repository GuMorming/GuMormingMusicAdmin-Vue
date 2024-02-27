import {AxiosPromise} from "axios";
import {PageResult, Result} from "@/model";
import request from "@/utils/request";
import {SongBackResponse, SongForm, SongQuery} from "@/api/song/types";

const baseURL = "/admin/song"

export function getSongList(params?: SongQuery): AxiosPromise<Result<PageResult<SongBackResponse[]>>> {
    return request({
        url: baseURL + "/list",
        method: "get",
        params,
    });
}

/**
 * 删除歌单
 * @param data 歌单id集合
 */
export function deleteSong(data: number[]): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/delete",
        method: "delete",
        data,
    });
}

/**
 * 添加歌单
 * @param data 歌单信息
 */
export function addSong(data: SongForm): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/add",
        method: "post",
        data,
    });
}

/**
 * 修改歌单
 * @param data 歌单信息
 */
export function updateSong(data: SongForm): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/update",
        method: "put",
        data,
    });
}