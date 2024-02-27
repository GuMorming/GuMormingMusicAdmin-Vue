import {PageQuery} from "@/model";

/**
 * 歌手查询参数
 */
export interface SongListQuery extends PageQuery {
    /**
     * 关键词
     */
    keyword?: string;
    /**
     * 分类id
     */
    categoryId?: number;
}

export interface SongListBackResponse {
    /**
     * 歌单id
     */
    id: number;
    /**
     * 歌单标题
     */
    title: string;
    /**
     * 歌单分类id
     */
    categoryId: number;
    /**
     * 歌单图片
     */
    pic: string;
    /**
     * 歌单简介
     */
    introduction: string;
    /**
     * 创建时间
     */
    createTime: string;
    /**
     * 更新时间
     */
    updateTime: string;
}

export interface SongListForm {
    /**
     * 歌单id
     */
    id?: number;
    /**
     * 歌单标题
     */
    title: string;
    /**
     * 歌单分类id
     */
    categoryId?: number;
    /**
     * 歌单图片
     */
    pic: string;
    /**
     * 歌单简介
     */
    introduction: string;
}

export interface SongList {
    /**
     * 歌单id
     */
    id: number;
    /**
     * 歌单标题
     */
    title: string;
    /**
     * 歌单分类id
     */
    categoryId: number;
    /**
     * 歌单图片
     */
    pic: string;
    /**
     * 歌单简介
     */
    introduction: string;

}