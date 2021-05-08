import { FieldResolver, Resolver, Root, Ctx, Mutation, Authorized, Arg } from "type-graphql";
import { ApolloError } from "apollo-server-errors";
import GraphQLTCategory from "../types/graphql/Category";

import TContext from "../types/context";
import { TCategory } from "../types/category";

import CreateCategory from "../inputs/CreateCategory";
import { CategoryModel } from "../database";

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

    @Authorized(["MODIFY_CATEGORIES"])
    @Mutation(returns => GraphQLTCategory)
    async createCategory(@Ctx() ctx: TContext, @Arg("data") data: CreateCategory) {
        if (await CategoryModel.exists({ name: data.name }))
            throw new ApolloError(`Category with name ${data.name} exists`, "CATEGORY_EXISTS");

        return await CategoryModel.create({ name: data.name, description: data.description, type: 1, authorID: ctx.user.discordID });
    }
}