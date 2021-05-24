import { FieldResolver, Resolver, Root, Ctx } from "type-graphql";
import GraphQLTBadge from "../types/graphql/Badge";

import TContext from "../types/context";
import TBadge from "../types/badge";

import config from "../../config.json";

@Resolver(GraphQLTBadge)
export default class {
    @FieldResolver()
    async name(@Root() root: TBadge) {
        return root.name;
    }

    @FieldResolver()
    async icon(@Root() root: TBadge, @Ctx() ctx: TContext) {
        return ctx.url + "/" + config.staticDir + "/" + root.icon;
    }

    @FieldResolver()
    async permissions(@Root() root: TBadge) {
        return root.permissions;
    }
}