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
}

export interface IPostDocument extends Document, IPost {
    addHeart: (this: IPostDocument, userID: string) => Promise<void>;
    removeHeart: (this: IPostDocument, userID: string) => Promise<void>;
    watch: () => Promise<IPostDocument>;
    edit: (data: { title: string, content: string, tag: string[] }) => Promise<void>;
};

export interface IPostModel extends Model<IPostDocument> {
    findByTag: (tag: string) => Promise<Array<IPostDocument>>;
    searchPosts: (query: string) => Promise<Array<IPostDocument>>;
    createPost: (data: IPostDocument) => Promise<IPostDocument>;
};