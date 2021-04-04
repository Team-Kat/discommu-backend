import { Document, Model } from "mongoose";

export interface IUser {
    discordID: string;
    point?: number;
    permissions?: string[];
    following?: string[];
}

export interface IUserDocument extends Document, IUser {
    addFollowing: (this: IUserDocument, userID: string) => Promise<void>;
    removeFollowing: (this: IUserDocument, userID: string) => Promise<void>;
    addPermissions: (this: IUserDocument, permission: string) => Promise<void>;
    removePermissions: (this: IUserDocument, permission: string) => Promise<void>;
};

export interface IUserModel extends Model<IUserDocument> {
    findOneOrCreate: (data: IUser) => Promise<IUserDocument>;
};