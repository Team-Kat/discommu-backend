import { model } from "mongoose";
import { IPostDocument, IPostModel } from "./posts.types";

import PostSchema from "./posts.schema";

export const PostModel = model<IPostDocument, IPostModel>("post", PostSchema);