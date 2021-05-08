import { Resolver, Query, Ctx, Arg, Info, Authorized } from "type-graphql";
import { GraphQLResolveInfo } from "graphql";

import graphqlFields from "graphql-fields";
import { ApolloError } from "apollo-server-errors";

import TContext from "../types/context";
import GraphQLTUser from "../types/graphql/User";

import { UserModel, CategoryModel } from "../database";

import config from "../../config.json";
import badges from "../data/json/badges.json";
import GraphQLTBadge from "../types/graphql/Badge";
import GraphQLTCategory from "../types/graphql/Category";

@Resolver()
export default class DefaultResolver {
    @Query(returns => String)
    loginURL() {
        return (
            `${config.discordAPIEndpoint}/oauth2/authorize?client_id=${config.oauth2.clientID}&redirect_uri=${config.oauth2.redirectURI}&scope=identify&response_type=code`
        )
    }

    @Authorized()
    @Query(returns => GraphQLTUser, { nullable: true })
    me(@Ctx() ctx: TContext) {
        return ctx.user;
    }

    @Query(returns => GraphQLTUser, { nullable: true })
    async user(@Ctx() ctx: TContext, @Arg("id") id: string) {
        const user = await ctx.userCache.getUser(id);
        if (!user)
            return null;

        return user;
    }

    @Query(returns => [GraphQLTUser])
    async users(
        @Ctx() ctx: TContext,
        @Info() info: GraphQLResolveInfo,
        @Arg("limit", { nullable: true, description: "How many users to divide" }) limit?: number,
        @Arg("limitIndex", { defaultValue: 1, description: "Index of divided users", nullable: true }) limitIndex?: number
    ) {
        if (limitIndex <= 0)
            throw new ApolloError("limitIndex should be a natural number", "TYPE_ERROR")

        let res = [];
        let users = await UserModel.find({}, Object.keys(graphqlFields(info)).join(" "), {
            limit: limit || undefined,
            skip: (limitIndex - 1) * limit
        }).exec();

        for (const dbUser of users) {
            const user = await dbUser.getUser(ctx.userCache);
            if (user)
                res.push(user)
        }

        return res;
    }

    @Query(returns => GraphQLTBadge, { nullable: true })
    async badge(@Arg("name") name: string) {
        if (!badges[name])
            return null;

        return {
            "name": name,
            ...badges[name]
        }
    }

    @Query(returns => [GraphQLTBadge])
    async badges() {
        let res = [];

        for (const badge of Object.keys(badges)) {
            if (!badges[badge])
                continue

            res.push({
                "name": badge,
                ...badges[badge]
            })
        }

        return res;
    }

    @Query(returns => GraphQLTCategory, { nullable: true })
    async category(@Arg("name") name: string) {
        const res = await CategoryModel.findOne({ name: name });
        if (!res)
            return null;

        return res;
    }
}