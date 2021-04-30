import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { GraphQLTUser } from "../types/graphql/User";

import TUser from "../types/user";
import TContext from "../types/context";
import { UserModel } from "../database";

@Resolver(GraphQLTUser)
export default class {
    @FieldResolver()
    async discordID(@Root() root: TUser) {
        return root.discordID
    }

    @FieldResolver()
    async username(@Root() root: TUser) {
        return root.username
    }

    @FieldResolver()
    async discriminator(@Root() root: TUser) {
        return root.discriminator
    }

    @FieldResolver()
    async avatarURL(@Root() root: TUser) {
        return root.avatarURL
    }

    @FieldResolver()
    async point(@Root() root: TUser) {
        return root.point
    }

    @FieldResolver()
    async permissions(@Root() root: TUser) {
        return root.permissions
    }

    @FieldResolver()
    async badges(@Root() root: TUser) {
        return root.badges
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
}