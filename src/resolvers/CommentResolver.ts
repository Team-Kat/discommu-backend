import { FieldResolver, Resolver, Root, Ctx, Authorized, Mutation, Arg } from "type-graphql";
import { ApolloError } from "apollo-server-errors";

import GraphQLTComment from "../types/graphql/Comment";

import TContext from "../types/context";
import TComment from "../types/comment";

import CreateComment from "../inputs/CreateComment";
import { PostModel, CommentModel } from "../database";

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

    @Authorized()
    @Mutation(returns => GraphQLTComment)
    async createComment(@Ctx() ctx: TContext, @Arg("postID") postID: string, @Arg("data") data: CreateComment) {
        if (!(await PostModel.exists({ _id: postID })))
            throw new ApolloError(`There is no post`, "POST_DOES_NOT_EXISTS");

        return await CommentModel.create({ postID: postID, content: data.content, authorID: ctx.user.discordID, reply: data.reply, timestamp: Date.now() });
    }

    @Authorized(["SELF_COMMENT"])
    @Mutation(returns => GraphQLTComment)
    async editComment(@Arg("id") id: string, @Arg("content") content: string) {
        if (content.length >= 500)
            throw new ApolloError("content must be shorter than or equal to 100 characters.", "FIELD_LENGTH_OVER");

        return await CommentModel.findByIdAndUpdate(id,
            { $set: { content: content } },
            { new: true }
        )
    }

    @Authorized(["SELF_COMMENT"])
    @Mutation(returns => GraphQLTComment)
    async deleteComment(@Arg("id") id: string) {
        return await CommentModel.findByIdAndDelete(id)
    }
}