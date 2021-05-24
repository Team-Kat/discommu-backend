import { Schema } from "mongoose";
import { ICategoryDocument, ICategoryModel } from "./categories.types";

const CategorySchema = new Schema<ICategoryDocument, ICategoryModel>({
    authorID: String,
    name: String,
    description: {
        type: String,
        default: ""
    },
    type: {
        type: Number,
        default: 1
    }
});
CategorySchema.index({ name: 'text', description: 'text' });

export default CategorySchema;