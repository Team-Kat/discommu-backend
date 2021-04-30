import { Resolver, Query, Ctx } from "type-graphql";

import { GraphQLTUser } from "../types/graphql/User";

import config from "../../config.json";

@Resolver()
export default class DefaultResolver {
    @Query(returns => String)
    loginURL() {
        return (
            `${config.discordAPIEndpoint}/oauth2/authorize?client_id=${config.oauth2.clientID}&redirect_uri=${config.oauth2.redirectURI}&scope=identify&response_type=code`
        )
    }

    @Query(returns => GraphQLTUser, { nullable: true })
    me(@Ctx() ctx) {
        if (!ctx.user)
            return null;

        return ctx.user;
    }
}