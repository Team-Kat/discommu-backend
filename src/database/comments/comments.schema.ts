import { Schema } from "mongoose";

import { findByPost, createComment } from "./comments.statics";
import { edit } from "./comments.methods";
import { ICommentDocument, ICommentModel } from "./comments.types";

const CommentSchema = new Schema<ICommentDocument, ICommentModel>({
    authorID: String,
    content: String,
    timestamp: Number,
    reply: {
        type: String,
        default: ""
    },
    postID: String
});

CommentSchema.statics.findByPost = findByPost;
CommentSchema.statics.createComment = createComment;
CommentSchema.methods.edit = edit;

export default CommentSchema;