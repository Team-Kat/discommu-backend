import { Document, Model } from "mongoose";

export interface ICategory {
    authorID: string;
    name: string;
    description: string;
    type: number;
}

export interface ICategoryDocument extends Document, ICategory {
    editDescription: (this: ICategoryDocument, description: string) => Promise<void>;
    verify: (this: ICategoryDocument) => Promise<boolean>;
    del: (this: ICategoryDocument) => Promise<boolean>;
};

export interface ICategoryModel extends Model<ICategoryDocument> { };