import { Ctx, FieldResolver, Resolver, Root, Mutation, Arg, Authorized } from "type-graphql";
import { ApolloError } from "apollo-server-errors";
import { UserModel } from "../database";

import TUser from "../types/user";
import TContext from "../types/context";
import GraphQLTUser from "../types/graphql/User";

import getElements from "../utils/getElements";

import EditUser from "../inputs/EditUser";

import badgesInfo from "../data/json/badges.json";
import permissionsInfo from "../data/json/permissions.json";

@Resolver(GraphQLTUser)
export default class {
    @FieldResolver()
    async discordID(@Root() root: TUser) {
        return root.discordID;
    }

    @FieldResolver()
    async username(@Root() root: TUser) {
        return root.username;
    }

    @FieldResolver()
    async discriminator(@Root() root: TUser) {
        return root.discriminator;
    }

    @FieldResolver()
    async avatarURL(@Root() root: TUser) {
        return root.avatarURL;
    }

    @FieldResolver()
    async description(@Root() root: TUser) {
        return root.description;
    }

    @FieldResolver()
    async point(@Root() root: TUser) {
        return root.point;
    }

    @FieldResolver()
    async permissions(@Root() root: TUser) {
        return root.permissions;
    }

    @FieldResolver()
    async badges(@Root() root: TUser) {
        let res = [];

        for (const badge of root.badges) {
            if (!badgesInfo[badge])
                continue;

            res.push({
                "name": badge,
                ...badgesInfo[badge]
            })
        }

        return res;
    }

    @FieldResolver()
    async following(@Root() root: TUser, @Ctx() ctx: TContext) {
        let res = [];
        for (const userID of root.following) {
            const user = await ctx.userCache.getUser(userID);
            if (user)
                res.push(user);
        }

        return res;
    }

    @FieldResolver()
    async follower(@Root() root: TUser, @Ctx() ctx: TContext) {
        const users = await UserModel.find({});
        let res = [];

        for (const dbUser of users) {
            if (dbUser.following.includes(root.discordID)) {
                const user = await dbUser.getUser(ctx.userCache);
                if (user)
                    res.push(user);
            }
        }

        return res;
    }


    @Authorized(["USER_EDIT"])
    @Mutation(returns => GraphQLTUser)
    async editUserDescription(@Ctx() ctx: TContext, @Arg("id") userID: string, @Arg("description") description: string) {
        if (description.length >= 100)
            throw new ApolloError("description must be shorter than or equal to 100 characters.", "FIELD_LENGTH_OVER");

        await UserModel.updateOne({ discordID: userID }, { $set: { description: description } });
        return await ctx.userCache.getUser(userID);
    }


    @Authorized(["USER_EDIT"])
    @Mutation(returns => GraphQLTUser)
    async editUserFollowing(@Ctx() ctx: TContext, @Arg("id") userID: string, @Arg("following", type => [String]) following: string[]) {
        let newFollowing = [];
        for (const fID of getElements(ctx.user.following, following)) {
            if (fID === userID)
                continue;
            if (await UserModel.exists({ discordID: fID }))
                newFollowing.push(fID);
        }

        await UserModel.updateOne({ discordID: userID }, { $set: { following: newFollowing } });
        return await ctx.userCache.getUser(userID);
    }


    @Authorized(["ADMIN"])
    @Mutation(returns => GraphQLTUser)
    async editUserBadges(@Ctx() ctx: TContext, @Arg("id") userID: string, @Arg("badges", type => [String]) badges: string[]) {
        let newBadges = [];
        for (const badge of getElements(ctx.user.badges, badges)) {
            if (badgesInfo[badge])
                newBadges.push(badge);
        }

        await UserModel.updateOne({ discordID: userID }, { $set: { badges: newBadges } });
        return await ctx.userCache.getUser(userID);
    }


    @Authorized(["ADMIN"])
    @Mutation(returns => GraphQLTUser)
    async editUserPermissions(@Ctx() ctx: TContext, @Arg("id") userID: string, @Arg("permissions", type => [String]) permissions: string[]) {
        let newPermissions = [];
        for (const permission of getElements(ctx.user.permissions, permissions)) {
            if (permissionsInfo.includes(permission))
                newPermissions.push(permission);
        }

        await UserModel.updateOne({ discordID: userID }, { $set: { permissions: newPermissions } });
        return await ctx.userCache.getUser(userID);
    }


    @Authorized(["USER_EDIT"])
    @Mutation(returns => GraphQLTUser, { nullable: true })
    async editUser(@Ctx() ctx: TContext, @Arg("id") userID: string, @Arg("data") data: EditUser) {
        if ((data.permissions || data.badges) && !ctx.user.permissions.includes("admin"))
            throw new ApolloError("To edit permissions or badges, you need the administer permission", "NO_PERMISSION");

        const user = await UserModel.findOne({ discordID: userID });
        if (!user)
            return null;

        if (data.description)
            await this.editUserDescription(ctx, userID, data.description);

        if (data.following)
            await this.editUserFollowing(ctx, userID, data.following);

        if (data.badges)
            await this.editUserBadges(ctx, userID, data.badges);

        if (data.permissions)
            await this.editUserPermissions(ctx, userID, data.permissions);

        return await ctx.userCache.getUser(userID);
    }
}