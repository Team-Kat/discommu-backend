import { model } from "mongoose";

import PostSchema from "./posts.schema";
import { IPostDocument, IPostModel } from "./posts.types";

export const PostModel = model<IPostDocument, IPostModel>("post", PostSchema);