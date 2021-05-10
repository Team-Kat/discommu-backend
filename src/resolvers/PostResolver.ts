import { FieldResolver, Resolver, Root, Ctx } from "type-graphql";
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
}