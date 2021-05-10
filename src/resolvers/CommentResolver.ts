import { FieldResolver, Resolver, Root, Ctx } from "type-graphql";
import GraphQLTComment from "../types/graphql/Comment";

import TContext from "../types/context";
import TComment from "../types/comment";
import { CategoryModel, PostModel } from "../database";

@Resolver(GraphQLTComment)
export default class {
    @FieldResolver()
    async id(@Root() root: TComment) {
        return root._id;
    }

    @FieldResolver()
    async content(@Root() root: TComment) {
        return root.content;
    }

    @FieldResolver()
    async timestamp(@Root() root: TComment) {
        return root.timestamp;
    }

    @FieldResolver()
    async author(@Root() root: TComment, @Ctx() ctx: TContext) {
        return await ctx.userCache.getUser(root.authorID);
    }

    @FieldResolver()
    async reply(@Root() root: TComment, @Ctx() ctx: TContext) {
        return root.reply ? await ctx.userCache.getUser(root.reply) : null;
    }

    @FieldResolver()
    async post(@Root() root: TComment) {
        return await PostModel.findOne({ _id: root.postID });
    }

    @FieldResolver()
    async hearts(@Root() root: TComment, @Ctx() ctx: TContext) {
        let res = [];
        for (const userID of root.hearts) {
            const user = await ctx.userCache.getUser(userID);
            if (user)
                res.push(user);
        }
        return res;
    }
}