import { Document, Model } from "mongoose";

export interface ICategory {
    authorID: string;
    name: string;
    description: string;
    type: number;
}

export interface ICategoryDocument extends Document, ICategory { };
export interface ICategoryModel extends Model<ICategoryDocument> { };