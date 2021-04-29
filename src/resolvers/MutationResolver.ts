import { Resolver, Mutation, Ctx, Arg } from "type-graphql";
import { ApolloError } from "apollo-server-errors";

import TContext from "../types/context"

@Resolver()
export default class MutationResolver {
    @Mutation(returns => String, { nullable: true })
    async login(@Ctx() ctx: TContext, @Arg("code") code: string) {
        if (ctx.user)
            throw new ApolloError('Already logged in! (token is valid)', 'TOKEN_VALID')
    }
}