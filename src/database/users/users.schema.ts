import { Schema } from "mongoose";

import { findOneOrCreate } from "./users.statics";
import { follow, unfollow, addPermissions, removePermissions, addBadge, removeBadge, addPoint, editDesc, getUser } from "./users.methods";
import { IUserDocument, IUserModel } from "./users.types";

const UserSchema = new Schema<IUserDocument, IUserModel>({
    discordID: String,
    description: {
        type: String,
        default: ''
    },
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
    },
    badges: {
        type: Array,
        default: []
    }
});

UserSchema.statics.findOneOrCreate = findOneOrCreate;

UserSchema.methods.follow = follow;
UserSchema.methods.unfollow = unfollow;
UserSchema.methods.addPermissions = addPermissions;
UserSchema.methods.removePermissions = removePermissions;
UserSchema.methods.addPoint = addPoint;
UserSchema.methods.addBadge = addBadge;
UserSchema.methods.removeBadge = removeBadge;
UserSchema.methods.editDesc = editDesc;
UserSchema.methods.getUser = getUser;

export default UserSchema;