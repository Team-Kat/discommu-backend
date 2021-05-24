import { Resolver, Query, Ctx, Arg, Authorized, Mutation } from "type-graphql";
import { ApolloError } from "apollo-server-errors";
import { sign } from "jsonwebtoken";

import safeFetch from "../utils/fetch";

import { categoryType, categorySort } from "../types/category";
import { postSort } from "../types/post";
import TContext from "../types/context";
import GraphQLTUser from "../types/graphql/User";

import { UserModel, CategoryModel, PostModel, ReportModel } from "../database";

import config from "../../config.json";
import badges from "../data/json/badges.json";
import GraphQLTBadge from "../types/graphql/Badge";
import GraphQLTCategory from "../types/graphql/Category";
import GraphQLTPost from "../types/graphql/Post";
import GraphQLTReport from "../types/graphql/Report";

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
        @Arg("limit", { nullable: true, description: "How many users to divide" }) limit?: number,
        @Arg("limitIndex", { defaultValue: 1, description: "Index of divided users", nullable: true }) limitIndex?: number
    ) {
        if (limitIndex <= 0)
            throw new ApolloError("limitIndex should be a natural number", "TYPE_ERROR");

        let res = [];
        let users = await UserModel.find({}, undefined, {
            limit: limit ?? undefined,
            skip: (limitIndex - 1) * limit
        }).exec();

        for (const dbUser of users) {
            const user = await dbUser.getUser(ctx.userCache);
            if (user)
                res.push(user);
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

    @Query(returns => [GraphQLTCategory])
    async categories(
        @Arg("query", { nullable: true }) query?: string,
        @Arg("authorID", { nullable: true, description: "The category's author's ID" }) authorID?: string,
        @Arg("type", { nullable: true, description: "The category's type's type" }) type?: categoryType,
        @Arg("limit", { nullable: true, description: "How many categories to divide" }) limit?: number,
        @Arg("limitIndex", { defaultValue: 1, description: "Index of divided categories", nullable: true }) limitIndex?: number,
        @Arg("sort", { nullable: true, description: "How to sort the results", defaultValue: "newest" }) sort?: categorySort
    ) {
        if (limitIndex <= 0)
            throw new ApolloError("limitIndex should be a natural number", "TYPE_ERROR");

        let searchQuery = {};
        if (query)
            searchQuery["$text"] = { $search: query };
        if (authorID)
            searchQuery["authorID"] = authorID;
        if (type)
            searchQuery["type"] = type;

        let categories = await CategoryModel.find(searchQuery, undefined, {
            limit: limit ?? undefined,
            skip: limit && limitIndex ? (limitIndex - 1) * limit : undefined,
            sort: {
                newest: undefined,
                alphabetic: {
                    name: 1
                },
                posts: undefined
            }[sort]
        }).exec();

        if (sort === "posts") {
            categories = await categories.sort(async (a, b) => {
                const ap = await PostModel.countDocuments({ category: a.name }),
                    bp = await PostModel.countDocuments({ category: b.name });

                if (ap > bp)
                    return 1;
                else if (ap < bp)
                    return -1;
                else
                    return 0;
            })
        }

        return categories;
    }

    @Query(returns => GraphQLTPost, { nullable: true })
    async post(@Arg("id") id: string) {
        const res = await PostModel.findById(id);
        if (!res)
            return null;

        return res;
    }

    @Query(returns => [GraphQLTPost])
    async posts(
        @Arg("query", { nullable: true }) query?: string,
        @Arg("authorID", { nullable: true, description: "The post's author's ID" }) authorID?: string,
        @Arg("category", { nullable: true, description: "The post's category" }) category?: string,
        @Arg("tag", type => [String], { nullable: true, description: "The post's tag" }) tag?: string[],
        @Arg("limit", { nullable: true, description: "How many posts to divide" }) limit?: number,
        @Arg("limitIndex", { defaultValue: 1, description: "Index of divided posts", nullable: true }) limitIndex?: number,
        @Arg("sort", { nullable: true, description: "How to sort the results", defaultValue: "newest" }) sort?: postSort
    ) {
        if (limitIndex <= 0)
            throw new ApolloError("limitIndex should be a natural number", "TYPE_ERROR");

        let searchQuery = {};
        if (query)
            searchQuery["$text"] = { $search: query };
        if (tag)
            searchQuery["tag"] = { $all: tag };
        if (authorID)
            searchQuery["authorID"] = authorID;
        if (category)
            searchQuery["category"] = category;

        let posts = await PostModel.find(searchQuery, undefined, {
            limit: limit ?? undefined,
            skip: limit && limitIndex ? (limitIndex - 1) * limit : undefined,
            sort: {
                newest: undefined,
                alphabetic: {
                    title: 1
                },
                hearts: {
                    hearts: -1
                },
                views: {
                    views: -1
                }
            }[sort]
        }).exec();

        return posts;
    }

    @Authorized(["ADMIN"])
    @Query(returns => GraphQLTReport, { nullable: true })
    async report(@Arg("id") id: string) {
        const res = await ReportModel.findById(id);
        if (!res)
            return null;

        return res;
    }

    @Authorized(["ADMIN"])
    @Query(returns => [GraphQLTReport])
    async reports(
        @Arg("query", { nullable: true }) query?: string,
        @Arg("userID", { nullable: true, description: "The report's author's ID" }) userID?: string,
        @Arg("data", { nullable: true, description: "The report's data" }) data?: string,
        @Arg("type", { nullable: true, description: "The report's type" }) type?: number,
        @Arg("limit", { nullable: true, description: "How many reports to divide" }) limit?: number,
        @Arg("limitIndex", { defaultValue: 1, description: "Index of divided reports", nullable: true }) limitIndex?: number
    ) {
        if (limitIndex <= 0)
            throw new ApolloError("limitIndex should be a natural number", "TYPE_ERROR");

        let searchQuery = {};
        if (query)
            searchQuery["$text"] = { $search: query };
        if (userID)
            searchQuery["userID"] = userID;
        if (data)
            searchQuery["data"] = data;
        if (type >= 0)
            searchQuery["type"] = type;

        let reports = await ReportModel.find(searchQuery, undefined, {
            limit: limit ?? undefined,
            skip: limit && limitIndex ? (limitIndex - 1) * limit : undefined
        }).exec();

        return reports;
    }

    @Mutation(returns => String, { nullable: true })
    async login(@Ctx() ctx: TContext, @Arg("code") code: string) {
        if (ctx.user)
            throw new ApolloError("Already logged in! (token is valid)", "TOKEN_VALID");

        const loginRes = await safeFetch(`${config.discordAPIEndpoint}/oauth2/token`, {
            body: new URLSearchParams({
                code,
                client_id: config.oauth2.clientID,
                client_secret: config.oauth2.clientSecret,
                redirect_uri: config.oauth2.redirectURI,
                grant_type: "authorization_code",
                scope: "identify"
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        });
        const loginJSON = await loginRes.json();

        if ((loginRes.status !== 200) || !loginJSON.access_token)
            throw new ApolloError("Wrong code", "CODE_INVALID");

        const userRes = await safeFetch(
            `${config.discordAPIEndpoint}/users/@me`,
            {
                headers: {
                    Authorization: `${loginJSON.token_type} ${loginJSON.access_token}`
                }
            }
        );
        const userJSON = await userRes.json();

        if (userRes.status !== 200)
            throw new ApolloError("User Not Found", "REQUEST_ERROR");

        await UserModel.findOneOrCreate({ discordID: userJSON.id });
        const data = {
            username: userJSON.username,
            avatarURL: userJSON.avatar
                ? `https://cdn.discordapp.com/avatars/${userJSON.id}/${userJSON.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/${Number(userJSON.discriminator) % 5}.png`,
            discriminator: userJSON.discriminator
        };
        ctx.userCache.set(userJSON.id, data);
        return sign({ id: userJSON.id, ...data }, config.jwtSecret, { expiresIn: "6h" });
    }
}