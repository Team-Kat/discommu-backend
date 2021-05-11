import { FieldResolver, Resolver, Root, Ctx, Subscription, Arg, Authorized, Mutation, PubSub, PubSubEngine } from "type-graphql";
import { ApolloError } from "apollo-server-errors";

import GraphQLTPost from "../types/graphql/Post";

import getElements from "../utils/getElements";

import TContext from "../types/context";
import TPost from "../types/post";

import CreatePost from "../inputs/CreatePost";
import EditPost from "../inputs/EditPost";
import { CategoryModel, CommentModel, PostModel } from "../database";

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

    @Authorized()
    @Mutation(returns => GraphQLTPost)
    async createPost(@PubSub() pubsub: PubSubEngine, @Ctx() ctx: TContext, @Arg("data") data: CreatePost) {
        if (!(await CategoryModel.exists({ name: data.category })))
            throw new ApolloError(`There is no category named ${data.category}`, "CATEGORY_DOES_NOT_EXISTS");

        const post = await PostModel.create({ title: data.title, content: data.content, tag: data.tag, authorID: ctx.user.discordID, timestamp: Date.now(), category: data.category });
        await pubsub.publish("postAdded", post);
        return post;
    }

    @Authorized(["SELF_POST"])
    @Mutation(returns => GraphQLTPost)
    async editPostTitle(@Arg("id") id: string, @Arg("title") title: string) {
        if (title.length >= 100)
            throw new ApolloError("title must be shorter than or equal to 100 characters.", "FIELD_LENGTH_OVER");

        return await PostModel.findByIdAndUpdate(id,
            { $set: { title: title } },
            { new: true }
        );
    }

    @Authorized(["SELF_POST"])
    @Mutation(returns => GraphQLTPost)
    async editPostContent(@Arg("id") id: string, @Arg("content") content: string) {
        return await PostModel.findByIdAndUpdate(id,
            { $set: { content: content } },
            { new: true }
        );
    }

    @Authorized(["SELF_POST"])
    @Mutation(returns => GraphQLTPost)
    async editPostTag(@Arg("id") id: string, @Arg("tag", type => [String]) tag: string[]) {
        const post = await PostModel.findById(id);
        return await PostModel.findByIdAndUpdate(id,
            { $set: { tag: getElements(post.tag, tag) } },
            { new: true }
        );
    }

    @Authorized(["SELF_POST"])
    @Mutation(returns => GraphQLTPost, { nullable: true })
    async editPost(@Arg("id") id: string, @Arg("data") data: EditPost) {
        if (data.title)
            await this.editPostTitle(id, data.title);

        if (data.content)
            await this.editPostContent(id, data.content);

        if (data.tag)
            await this.editPostTag(id, data.tag);

        return await PostModel.findById(id);
    }

    @Authorized()
    @Mutation(returns => GraphQLTPost, { nullable: true })
    async addHeart(@Ctx() ctx: TContext, @Arg("id") id: string) {
        const post = await PostModel.findById(id);
        if (!post)
            return null;

        if (post.hearts.includes(ctx.user.discordID))
            return null;

        return await PostModel.findByIdAndUpdate(id, { $push: { hearts: ctx.user.discordID } }, { new: true });
    }

    @Authorized()
    @Mutation(returns => GraphQLTPost, { nullable: true })
    async removeHeart(@Ctx() ctx: TContext, @Arg("id") id: string) {
        const post = await PostModel.findById(id);
        if (!post)
            return null;

        if (!post.hearts.includes(ctx.user.discordID))
            return null;

        return await PostModel.findByIdAndUpdate(id, { $pull: { hearts: ctx.user.discordID } }, { new: true });
    }
}