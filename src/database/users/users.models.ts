import { model } from "mongoose";
import { IUserDocument, IUserModel } from "./users.types";

import UserSchema from "./users.schema";

export const UserModel = model<IUserDocument, IUserModel>("user", UserSchema);