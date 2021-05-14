import { FieldResolver, Resolver, Root, Ctx, Mutation, Authorized, Arg } from "type-graphql";
import { ApolloError } from "apollo-server-errors";

import GraphQLTReport from "../types/graphql/Report";

import TContext from "../types/context";
import { reportType, TReport } from "../types/report";

import CreateReport from "../inputs/CreateReport";
import { CategoryModel, PostModel, ReportModel, UserModel } from "../database";

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

    @Authorized()
    @Mutation(returns => GraphQLTReport)
    async createReport(@Ctx() ctx: TContext, @Arg("data") data: CreateReport) {
        switch (data.type ?? reportType.SUGGEST) {
            case reportType.SUGGEST:
                break;
            case reportType.CATEGORY:
                if (!(await CategoryModel.exists({ name: data.data })))
                    throw new ApolloError("Category does not exists", "REPORT_DATA_NOT_EXISTS");
                else
                    break;
            case reportType.POST:
                if (!(await PostModel.exists({ _id: data.data })))
                    throw new ApolloError("Post does not exists", "REPORT_DATA_NOT_EXISTS");
                else
                    break;
            case reportType.USER:
                if (!(await UserModel.exists({ discordID: data.data })))
                    throw new ApolloError("User does not exists", "REPORT_DATA_NOT_EXISTS");
                else
                    break;
        }

        const report = await ReportModel.create({
            content: data.content,
            type: data.type ?? reportType.SUGGEST,
            data: data.data,
            userID: ctx.user.discordID,
            timestamp: Date.now()
        })
        return report;
    }
}