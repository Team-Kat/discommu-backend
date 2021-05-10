import { Schema } from "mongoose";
import { ICommentDocument, ICommentModel } from "./comments.types";

const CommentSchema = new Schema<ICommentDocument, ICommentModel>({
    authorID: String,
    content: String,
    timestamp: Number,
    reply: {
        type: String,
        default: ""
    },
    postID: String,
    hearts: {
        type: Array,
        default: []
    }
});

export default CommentSchema;