import { model } from "mongoose";
import { ICommentDocument, ICommentModel } from "./comments.types";

import CommentSchema from "./comments.schema";

export const CommentModel = model<ICommentDocument, ICommentModel>("comment", CommentSchema);