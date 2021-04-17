import { Document, Model } from "mongoose";

export interface IComment {
    authorID: string;
    content: string;
    timestamp: number;
    reply: string;  // 답장 유저 ID
    postID: string;
}

export interface ICommentDocument extends Document, IComment {
    edit: (this: ICommentDocument, content: string) => Promise<void>;
};

export interface ICommentModel extends Model<ICommentDocument> {
    findByPost: (postID: string) => Promise<Array<any>>;
    createComment: (
        this: ICommentModel,
        postID: string,
        content: string,
        authorID: string,
        reply?: string
    ) => Promise<void>;
};