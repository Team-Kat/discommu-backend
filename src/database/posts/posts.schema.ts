import { Schema } from "mongoose";

import { findByTag, searchPosts, createPost } from "./posts.statics";
import { addHeart, removeHeart, watch, edit } from "./posts.methods";
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
PostSchema.index({ title: 'text', content: 'text' })

PostSchema.statics.findByTag = findByTag;
PostSchema.statics.searchPosts = searchPosts;
PostSchema.statics.createPost = createPost;

PostSchema.methods.addHeart = addHeart;
PostSchema.methods.removeHeart = removeHeart;
PostSchema.methods.watch = watch;
PostSchema.methods.edit = edit;

export default PostSchema;