import { IUserDocument } from "./users.types";

import permissions from "../../data/json/permissions.json";
import badges from "../../data/json/badges.json";
import needPoints from "../../data/json/needPoints.json";
import getPoints from "../../data/json/getPoints.json";

import TUser from "../../types/user";
import { userCache } from "../../utils/cache";

export async function follow(this: IUserDocument, userID: string, noSave?: boolean): Promise<void> {
    if (needPoints.follow > this.point) return;
    if (this.following?.includes(userID)) return;
    this.following?.push(userID);

    await this.addPoint(getPoints.follow, false);
    if (!noSave)
        await this.save();
}

export async function unfollow(this: IUserDocument, userID: string, noSave?: boolean): Promise<void> {
    if (needPoints.follow > this.point) return;
    if (!this.following?.includes(userID)) return;
    this.following = this.following?.filter(i => i !== userID);

    await this.addPoint(getPoints.follow, false);
    if (!noSave)
        await this.save();
}

export async function addPermissions(this: IUserDocument, permission: string, noSave?: boolean): Promise<void> {
    if ((!permissions[permission]) || (this.permissions?.includes(permission))) return;
    this.permissions?.push(permission);

    if (!noSave)
        await this.save();
}

export async function removePermissions(this: IUserDocument, permission: string, noSave?: boolean): Promise<void> {
    if ((!permissions[permission]) || (!this.permissions?.includes(permission))) return;
    this.permissions = this.permissions?.filter(i => i !== permission);

    if (!noSave)
        await this.save();
}

export async function addPoint(this: IUserDocument, point: number, noSave?: boolean): Promise<void> {
    if (!point || point <= 0) return;
    this.point += point;
    Object.keys(permissions).forEach(async permissionKey => {
        const per = permissions[permissionKey];
        if (!per.need) return;
        await this.addPermissions(permissionKey, true);
    })

    if (!noSave)
        await this.save();
}

export async function addBadge(this: IUserDocument, badge: string, noSave?: boolean): Promise<void> {
    if ((!badges[badge]) || (this.badges?.includes(badge))) return;
    const badgeInfo = badges[badge];
    this.badges?.push(badge);
    this.addPoint(badgeInfo.point, true);
    badgeInfo.permissions.forEach(async per => {
        await this.addPermissions(per, true)
    })

    if (!noSave)
        await this.save();
}

export async function removeBadge(this: IUserDocument, badge: string, noSave?: boolean): Promise<void> {
    if ((!badges[badge]) || (!this.badges?.includes(badge))) return;
    this.badges = this.badges?.filter(i => i !== badge);

    if (!noSave)
        await this.save();
}

export async function editDesc(this: IUserDocument, description: string, noSave?: boolean): Promise<string> {
    this.description = description;

    if (!noSave)
        await this.save();
    return description;
}

export async function getUser(this: IUserDocument, userCache: userCache): Promise<TUser> {
    return (await userCache.getUser(this.discordID) as TUser);
}