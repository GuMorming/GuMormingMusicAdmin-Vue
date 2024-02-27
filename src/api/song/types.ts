import {PageQuery} from "@/model";

export interface Song {
    id: number;

    singerId: number;

    categoryId: number;

    name: string;

    album: string;

    pic: string;

    lyric: string;

    url: string;
}

export interface SongQuery extends PageQuery {
    name?: string;

    singerName?: string;

    categoryId?: number;
}

export interface SongForm {
    id?: number;

    singerId?: number;

    categoryId?: number;

    name: string;

    album: string;

    pic: string;

    lyric: string;

    url: string;
}

export interface SongBackResponse {
    id: number;

    singerId: number;

    categoryId: number;

    name: string;

    album: string;

    pic: string;

    lyric: string;

    url: string;
}