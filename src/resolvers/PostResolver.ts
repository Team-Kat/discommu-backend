import { FieldResolver, Resolver, Root, Ctx, Subscription, Arg } from "type-graphql";
import GraphQLTPost from "../types/graphql/Post";

import TContext from "../types/context";
import TPost from "../types/post";
import { CategoryModel, CommentModel } from "../database";

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
    async category(@Root() root: TPost) {
        return await CategoryModel.findOne({ name: root.category });
    }

    @FieldResolver()
    async hearts(@Root() root: TPost, @Ctx() ctx: TContext) {
        let res = [];
        for (const userID of root.hearts) {
            const user = await ctx.userCache.getUser(userID);
            if (user)
                res.push(user);
        }
        return res;
    }

    @FieldResolver()
    async comments(@Root() root: TPost) {
        return await CommentModel.find({ postID: root._id })
    }

    @Subscription(() => GraphQLTPost, {
        topics: "postAdded",
        filter: ({ payload, args }) =>
            (args.authorID ? payload.authorID == args.authorID : true)
            && (args.tag ? args.tag.every(r => payload.tag.includes(r)) : true)
            && (args.query ? (payload.title + payload.content).includes(args.query) : true)
    })
    async postAdded(
        @Root() post: TPost,
        @Arg("query", { nullable: true }) query?: string,
        @Arg("authorID", { nullable: true, description: "The post's author's ID" }) authorID?: string,
        @Arg("tag", type => [String], { nullable: true, description: "The post's tag" }) tag?: string[]
    ) {
        return post;
    }
}