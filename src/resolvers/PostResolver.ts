import { FieldResolver, Resolver, Root, Ctx, Mutation, Authorized, Arg, PubSub, PubSubEngine, Subscription } from "type-graphql";
import { ApolloError } from "apollo-server-errors";
import GraphQLTPost from "../types/graphql/Post";

import TContext from "../types/context";
import TPost from "../types/post";
import { CategoryModel, PostModel } from "../database";

@Resolver(GraphQLTPost)
export default class {
    @FieldResolver()
    async id(@Root() root: TPost) {
        return root._id;
    }

    @FieldResolver()
    async title(@Root() root: TPost) {
        return root.title;
    }

    @FieldResolver()
    async content(@Root() root: TPost) {
        return root.content;
    }

    @FieldResolver()
    async timestamp(@Root() root: TPost) {
        return root.timestamp;
    }

    @FieldResolver()
    async views(@Root() root: TPost) {
        return root.views;
    }

    @FieldResolver()
    async tag(@Root() root: TPost) {
        return root.tag;
    }

    @FieldResolver()
    async author(@Root() root: TPost, @Ctx() ctx: TContext) {
        return await ctx.userCache.getUser(root.authorID);
    }

    @FieldResolver()
    async category(@Root() root: TPost, @Ctx() ctx: TContext) {
        return await CategoryModel.find({ name: root.category });
    }
}