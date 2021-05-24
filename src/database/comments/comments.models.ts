import { model } from "mongoose";

import CommentSchema from "./comments.schema";
import { ICommentDocument, ICommentModel } from "./comments.types";

export const CommentModel = model<ICommentDocument, ICommentModel>("comment", CommentSchema);