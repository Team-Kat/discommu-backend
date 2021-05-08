import { FieldResolver, Resolver, Root, Ctx } from "type-graphql";
import GraphQLTCategory from "../types/graphql/Category";

import TContext from "../types/context";
import { TCategory } from "../types/category";

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
}