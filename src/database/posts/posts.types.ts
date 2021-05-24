import { Document, Model } from "mongoose";

export interface IPost {
    authorID: string;
    title: string;
    content: string;
    category: string;
    timestamp: number;
    views?: number;

    tag?: string[];
    hearts?: string[];
};

export interface IPostDocument extends Document, IPost { };
export interface IPostModel extends Model<IPostDocument> { };