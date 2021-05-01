import { Schema } from "mongoose";

import { findOneOrCreate } from "./users.statics";
import { getUser } from "./users.methods";
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
UserSchema.methods.getUser = getUser;

export default UserSchema;