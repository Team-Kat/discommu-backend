import { FieldResolver, Resolver, Root, Ctx, Mutation, Authorized, Arg, PubSub, PubSubEngine, Subscription } from "type-graphql";
import { ApolloError } from "apollo-server-errors";

import GraphQLTReport from "../types/graphql/Report";

import TContext from "../types/context";
import { reportType, TReport } from "../types/report";

import { CategoryModel, PostModel } from "../database";

@Resolver(GraphQLTReport)
export default class {
    @FieldResolver()
    async content(@Root() root: TReport) {
        return root.content;
    }

    @FieldResolver()
    async id(@Root() root: TReport) {
        return root._id;
    }

    @FieldResolver()
    async type(@Root() root: TReport) {
        return root.type;
    }

    @FieldResolver()
    async timestamp(@Root() root: TReport) {
        return root.timestamp;
    }

    @FieldResolver()
    async user(@Root() root: TReport, @Ctx() ctx: TContext) {
        return await ctx.userCache.getUser(root.userID);
    }

    @FieldResolver()
    async data(@Root() root: TReport, @Ctx() ctx: TContext) {
        let res;
        switch (root.type) {
            case reportType.USER:
                res = await ctx.userCache.getUser(root.data);
                break;
            case reportType.CATEGORY:
                res = await CategoryModel.findOne({ name: root.data });
                break;
            case reportType.POST:
                res = await PostModel.findById(root.data);
                break;
            case reportType.SUGGEST:
                res = root.data;
                break;
        }

        return res;
    }
}