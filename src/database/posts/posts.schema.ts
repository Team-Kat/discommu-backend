import { Schema } from "mongoose";
import { IPostDocument, IPostModel } from "./posts.types";

const PostSchema = new Schema<IPostDocument, IPostModel>({
    authorID: String,
    title: String,
    content: String,
    category: String,
    timestamp: Number,

    views: {
        type: Number,
        default: 0
    },

    tag: {
        type: Array,
        default: []
    },
    hearts: {
        type: Array,
        default: []
    }
});
PostSchema.index({ title: 'text', content: 'text' });

export default PostSchema;