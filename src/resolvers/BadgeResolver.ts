import { FieldResolver, Resolver, Root, Ctx } from "type-graphql";
import TContext from "../types/context";
import GraphQLTBadge from "../types/graphql/Badge";

import config from "../../config.json";

@Resolver(GraphQLTBadge)
export default class {
    @FieldResolver()
    async name(@Root() root: GraphQLTBadge) {
        return root.name;
    }

    @FieldResolver()
    async icon(@Root() root: GraphQLTBadge, @Ctx() ctx: TContext) {
        return ctx.url + "/" + config.staticDir + "/" + root.icon;
    }

    @FieldResolver()
    async permissions(@Root() root: GraphQLTBadge) {
        return root.permissions;
    }
}