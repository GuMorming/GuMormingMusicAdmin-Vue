import {AxiosPromise} from "axios";
import {PageResult, Result} from "@/model";
import request from "@/utils/request";
import {SongList, SongListBackResponse, SongListForm, SongListQuery} from "@/api/songList/types";

const baseURL = "/admin/songList";

export function getSongListList(params?: SongListQuery): AxiosPromise<Result<PageResult<SongListBackResponse[]>>> {
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
export function deleteSongList(data: number[]): AxiosPromise<Result<null>> {
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
export function addSongList(data: SongListForm): AxiosPromise<Result<null>> {
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
export function updateSongList(data: SongListForm): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/update",
        method: "put",
        data,
    });
}