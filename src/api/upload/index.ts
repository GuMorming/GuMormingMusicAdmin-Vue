import {AxiosPromise} from "axios";
import {Result} from "@/model";
import request from "@/utils/request";

const baseURL = "/admin/upload"

/**
 * 上传图片
 * @returns 图片链接
 */
export function uploadImg(data: FormData): AxiosPromise<Result<string>> {
    return request({
        url: baseURL + "/img",
        headers: {"content-type": "multipart/form-data"},
        method: "post",
        data,
    });
}

/**
 * 上传歌手图片
 * @returns 歌手图片链接
 */
export function uploadSingerPic(data: FormData): AxiosPromise<Result<string>> {
    return request({
        url: baseURL + "/singerPic",
        headers: {"content-type": "multipart/form-data"},
        method: "post",
        data,
    });
}

/**
 * 上传歌曲图片
 * @returns 歌曲图片链接
 */
export function uploadSongPic(data: FormData): AxiosPromise<Result<string>> {
    return request({
        url: baseURL + "/songPic",
        headers: {"content-type": "multipart/form-data"},
        method: "post",
        data,
    });
}

/**
 * 上传歌曲
 * @returns 歌曲url
 */
export function uploadSong(data: FormData): AxiosPromise<Result<string>> {
    return request({
        url: baseURL + "/song",
        headers: {"content-type": "multipart/form-data"},
        method: "post",
        data,
    });
}