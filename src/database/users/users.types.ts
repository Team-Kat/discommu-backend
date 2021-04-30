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
}

export interface IUserDocument extends Document, IUser {
    follow: (this: IUserDocument, userID: string, noSave?: boolean) => Promise<void>;
    unfollow: (this: IUserDocument, userID: string, noSave?: boolean) => Promise<void>;
    addPermissions: (this: IUserDocument, permission: string, noSave?: boolean) => Promise<void>;
    removePermissions: (this: IUserDocument, permission: string, noSave?: boolean) => Promise<void>;
    addPoint: (this: IUserDocument, point: number, noSave?: boolean) => Promise<void>;
    addBadge: (this: IUserDocument, badge: string, noSave?: boolean) => Promise<void>;
    removeBadge: (this: IUserDocument, badge: string, noSave?: boolean) => Promise<void>;
    editDesc: (this: IUserDocument, description: string, noSave?: boolean) => Promise<string>;
    getUser: (this: IUserDocument, userCache: userCache) => Promise<TUser>;
};

export interface IUserModel extends Model<IUserDocument> {
    findOneOrCreate: (data: IUser) => Promise<IUserDocument>;
};