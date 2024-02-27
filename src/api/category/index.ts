import {AxiosPromise} from "axios";
import {PageResult, Result} from "@/model";
import request from "@/utils/request";
import {Category, CategoryForm, CategoryItem, CategoryQuery} from "@/api/category/types";

const baseURL = "/admin/category";

/**
 * 获取全部分类
 * @returns 分类列表
 */
export function getAllCategory(): AxiosPromise<Result<CategoryItem[]>> {
    return request({
        url: baseURL + "/optionList",
        method: "get"
    });
}

/**
 * 查看分类列表
 * @param params 查询条件
 * @returns 分类列表
 */
export function getCategoryList(params: CategoryQuery): AxiosPromise<Result<PageResult<Category[]>>> {
    return request({
        url: baseURL + "/list",
        method: "get",
        params,
    });
}

/**
 * 删除分类
 * @param data 分类id集合
 */
export function deleteCategory(data: number[]): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/delete",
        method: "delete",
        data,
    });
}

/**
 * 添加分类
 * @param data 分类信息
 */
export function addCategory(data: CategoryForm): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/add",
        method: "post",
        data,
    });
}

/**
 * 修改分类
 * @param data 分类信息
 */
export function updateCategory(data: CategoryForm): AxiosPromise<Result<null>> {
    return request({
        url: baseURL + "/update",
        method: "put",
        data,
    });
}