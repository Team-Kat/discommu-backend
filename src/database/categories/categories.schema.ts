import { Schema } from "mongoose";

import { editDesc, del, verify } from "./categories.methods";
import { ICategoryDocument, ICategoryModel } from "./categories.types";

const CategorySchema = new Schema<ICategoryDocument, ICategoryModel>({
    authorID: String,
    name: String,
    description: String,
    type: {
        type: Number,
        default: 1
    }
});
CategorySchema.index({ name: 'text', description: 'text' })

CategorySchema.methods.editDesc = editDesc;
CategorySchema.methods.verify = verify;
CategorySchema.methods.del = del;

export default CategorySchema;