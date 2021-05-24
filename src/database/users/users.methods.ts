import { IUserDocument } from "./users.types";

import TUser from "../../types/user";
import { userCache } from "../../utils/cache";

export async function getUser(this: IUserDocument, userCache: userCache): Promise<TUser> {
    return (await userCache.getUser(this.discordID) as TUser);
}