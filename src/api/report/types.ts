import {CategoryItem} from "../category/types";
import {TagItem} from "@/api/tag/types";


/**
 * 歌曲浏览量排行
 */
export interface SongRankVO {
    /**
     * 文章标题
     */
    songName: string;
    /**
     * 浏览量
     */
    viewCount: number;
}

/**
 * 用户浏览量
 */
export interface UserViewVO {
    /**
     * 日期
     */
    date: string;
    /**
     * uv
     */
    uv: number;
    /**
     * pv
     */
    pv: number;
}

export interface CategoryHomeItem {
    songCount: number;

    categoryName: string;
}

/**
 * 博客后台信息
 */
export interface BackInfo {
    /**
     * 访问量
     */
    viewCount: number;
    /**
     * 留言量
     */
    messageCount: number;
    /**
     * 用户量
     */
    userCount: number;
    /**
     * 歌曲量
     */
    songCount: number;
    /**
     * 文章分类
     */
    categoryVOList: CategoryHomeItem[];
    /**
     * 标签
     */
    tagVOList: TagItem[];

    /**
     * 歌曲浏览量排行
     */
    songRankVOList: SongRankVO[];
    /**
     * 用户浏览量
     */
    userViewVOList: UserViewVO[];
}