import { model } from "mongoose";

import CategorySchema from "./categories.schema";
import { ICategoryDocument, ICategoryModel } from "./categories.types";

export const CategoryModel = model<ICategoryDocument, ICategoryModel>("category", CategorySchema);