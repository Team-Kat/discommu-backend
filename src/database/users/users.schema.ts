import { Schema } from "mongoose";

import { findOneOrCreate } from "./users.statics";
import { addFollowing, removeFollowing, addPermissions, removePermissions } from "./users.methods";
import { IUserDocument, IUserModel } from "./users.types";

const UserSchema = new Schema<IUserDocument, IUserModel>({
    discordID: String,
    point: {
        type: Number,
        default: 0
    },
    permissions: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    }
});

UserSchema.statics.findOneOrCreate = findOneOrCreate;

UserSchema.methods.addFollowing = addFollowing;
UserSchema.methods.removeFollowing = removeFollowing;
UserSchema.methods.addPermissions = addPermissions;
UserSchema.methods.removePermissions = removePermissions;

export default UserSchema;