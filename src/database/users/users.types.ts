import { Document, Model } from "mongoose";

import TUser from "../../types/user";
import { userCache } from "../../utils/cache";

export interface IUser {
    discordID: string;
    description?: string;
    point?: number;
    permissions?: string[];
    following?: string[];
    badges?: string[];
};

export interface IUserDocument extends Document, IUser {
    getUser: (this: IUserDocument, userCache: userCache) => Promise<TUser>;
};

export interface IUserModel extends Model<IUserDocument> {
    findOneOrCreate: (data: IUser) => Promise<IUserDocument>;
};