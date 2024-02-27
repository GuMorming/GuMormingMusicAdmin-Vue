import {PageQuery} from "@/model";

/**
 * 歌手查询参数
 */
export interface SingerQuery extends PageQuery {
    /**
     * 关键词
     */
    keyword?: string;
    /**
     * 性别(0女 1男 2保密)
     */
    sex?: number;
}

export interface SingerForm {
    /**
     * 歌手id
     */
    id?: number;
    /**
     * 歌手姓名
     */
    name: string;
    /**
     * 歌手姓名
     */
    sex?: number;
    /**
     * 歌手图片
     */
    pic: string;
    /**
     * 出生日期
     */
    birth: string;
    /**
     * 歌手地区
     */
    location: string;
    /**
     * 歌手简介
     */
    introduction: string;
}

export interface Singer {
    /**
     * 歌手id
     */
    id: number;
    /**
     * 歌手姓名
     */
    name: string;
    /**
     * 歌手性别
     */
    sex: number;
    /**
     * 歌手图片
     */
    pic: string;
    /**
     * 出生日期
     */
    birth: string;
    /**
     * 歌手地区
     */
    location: string;
    /**
     * 歌手简介
     */
    introduction: string;

    songIdList: number[];
}