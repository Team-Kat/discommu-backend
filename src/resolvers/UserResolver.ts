import { Ctx, FieldResolver, Resolver, Root, Mutation, Arg, Authorized } from "type-graphql";
import { ApolloError } from "apollo-server-errors";
import { UserModel } from "../database";

import TUser from "../types/user";
import TContext from "../types/context";
import GraphQLTUser from "../types/graphql/User";

import EditUser from "../inputs/EditUser";

import badges from "../data/json/badges.json";

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
            if (!badges[badge])
                continue;

            res.push({
                "name": badge,
                ...badges[badge]
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

    @Authorized()
    @Mutation(returns => GraphQLTUser, { nullable: true })
    async editUser(@Ctx() ctx: TContext, @Arg("id") userID: string, @Arg("data") data: EditUser) {
        if ((userID !== ctx.user.discordID) && !ctx.user.permissions.includes("admin"))
            throw new ApolloError("You can only edit your info", "NO_PERMISSION")

        if ((data.permissions || data.badges) && !(ctx.user.permissions.includes("MODIFY_POINTS") || ctx.user.permissions.includes("admin")))
            throw new ApolloError("To edit permissions, you need the administer permission", "NO_PERMISSION");

        return await ctx.userCache.getUser(
            (await UserModel.findOneAndUpdate(
                { discordID: userID },
                { ...data },
                { new: true })).discordID
        );
    }
}