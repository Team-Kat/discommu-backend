import { model } from "mongoose";
import { ICategoryDocument, ICategoryModel } from "./categories.types";

import CategorySchema from "./categories.schema";

export const CategoryModel = model<ICategoryDocument, ICategoryModel>("category", CategorySchema);