import {PageResult, Result} from "@/model";
import request from "@/utils/request";
import {AxiosPromise} from "axios";
import {File, FileQuery, FolderForm} from "./types";

const baseURL = "/admin/file";

/**
 * 查看文件列表
 * @param params 查询条件
 * @returns 文件列表
 */
export function getFileList(params: FileQuery): AxiosPromise<Result<PageResult<File[]>>> {
    return request({
        url: baseURL + "/list",
        method: "get",
        params,
    });
}

/**
 * 删除文件
 * @param data 文件id集合
 */
export function deleteFile(data: number[]): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/delete",
        method: "delete",
        data,
    });
}

/**
 * 创建文件夹
 * @param data 文件夹信息
 */
export function createFolder(data: FolderForm): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/createFolder",
        method: "post",
        data,
    });
}

/**
 * 上传文件
 * @param data 文件
 */
export function uploadFile(data: FormData): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/upload",
        headers: {"content-type": "multipart/form-data"},
        method: "post",
        data,
    });
}

/**
 * 下载文件
 * @param fileId 文件id
 */
export function downloadFile(fileId: number): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/download/${fileId}",
        method: "get",
    });
}