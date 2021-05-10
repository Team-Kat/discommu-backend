import { FieldResolver, Resolver, Root, Ctx, Mutation, Authorized, Arg, PubSub, PubSubEngine, Subscription } from "type-graphql";
import { ApolloError } from "apollo-server-errors";
import GraphQLTCategory from "../types/graphql/Category";

import TContext from "../types/context";
import { categoryType, TCategory } from "../types/category";

import CreateCategory from "../inputs/CreateCategory";
import EditCategory from "../inputs/EditCategory";
import { CategoryModel, PostModel } from "../database";

@Resolver(GraphQLTCategory)
export default class {
    @FieldResolver()
    async name(@Root() root: TCategory) {
        return root.name;
    }

    @FieldResolver()
    async description(@Root() root: TCategory) {
        return root.description;
    }

    @FieldResolver()
    async type(@Root() root: TCategory) {
        return root.type;
    }

    @FieldResolver()
    async author(@Root() root: TCategory, @Ctx() ctx: TContext) {
        return await ctx.userCache.getUser(root.authorID);
    }

    @Subscription(() => GraphQLTCategory, { topics: "categoryAdded" })
    async categoryAdded(@Root() category: TCategory) {
        return category;
    }

    @Authorized(["MODIFY_CATEGORIES"])
    @Mutation(returns => GraphQLTCategory)
    async createCategory(@PubSub() pubsub: PubSubEngine, @Ctx() ctx: TContext, @Arg("data") data: CreateCategory) {
        if (await CategoryModel.exists({ name: data.name }))
            throw new ApolloError(`Category with name ${data.name} exists`, "CATEGORY_EXISTS");

        const category = await CategoryModel.create({ name: data.name, description: data.description, type: 1, authorID: ctx.user.discordID })
        await pubsub.publish("categoryAdded", category)
        return category;
    }

    @Authorized(["SELF_CATEGORY"])
    @Mutation(returns => GraphQLTCategory, { nullable: true })
    async editCategoryDescription(@Arg("name") categoryName: string, @Arg("description") description: string) {
        if (description.length >= 100)
            throw new ApolloError("description must be shorter than or equal to 100 characters.", "FIELD_LENGTH_OVER");

        return await CategoryModel.findOneAndUpdate(
            { name: categoryName },
            { $set: { description: description } },
            { new: true }
        );
    }

    @Authorized(["ADMIN"])
    @Mutation(returns => GraphQLTCategory, { nullable: true })
    async editCategoryType(@Arg("name") categoryName: string, @Arg("type") type: categoryType) {
        return await CategoryModel.findOneAndUpdate(
            { name: categoryName },
            { $set: { type: type } },
            { new: true }
        );
    }

    @Authorized(["SELF_CATEGORY"])
    @Mutation(returns => GraphQLTCategory, { nullable: true })
    async editCategory(@Ctx() ctx: TContext, @Arg("name") categoryName: string, @Arg("data") data: EditCategory) {
        if (data.type && !ctx.user.permissions.includes("admin"))
            throw new ApolloError("To edit category type, you need the administer permission", "NO_PERMISSION");

        if (data.description)
            await this.editCategoryDescription(categoryName, data.description);

        if (data.type)
            await this.editCategoryType(categoryName, data.type);

        return await CategoryModel.findOne({ name: categoryName });
    }

    @Authorized(["SELF_CATEGORY"])
    @Mutation(returns => GraphQLTCategory, { nullable: true })
    async deleteCategory(@Ctx() ctx: TContext, @Arg("name") categoryName: string) {
        const posts = await PostModel.find({ category: categoryName });
        if (posts.length >= 10)
            throw new ApolloError("Category has posts more than 10", "TOO_MANY_POSTS")

        await posts.forEach(async post => await post.delete())
        return await CategoryModel.findOneAndDelete({ name: categoryName });
    }
}