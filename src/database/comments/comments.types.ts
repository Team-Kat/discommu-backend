import { Document, Model } from "mongoose";

export interface IComment {
    authorID: string;
    content: string;
    timestamp: number;
    reply: string;  // 답장 유저 ID
    postID: string;
    hearts: string[];
};

export interface ICommentDocument extends Document, IComment { };
export interface ICommentModel extends Model<ICommentDocument> { };