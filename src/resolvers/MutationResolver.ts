import { Resolver, Mutation, Ctx, Arg } from "type-graphql";
import { ApolloError } from "apollo-server-errors";
import { sign } from "jsonwebtoken";

import config from "../../config.json";

import safeFetch from "../utils/fetch";
import TContext from "../types/context";
import { UserModel } from "../database";

@Resolver()
export default class MutationResolver {
    @Mutation(returns => String, { nullable: true })
    async login(@Ctx() ctx: TContext, @Arg("code") code: string) {
        if (ctx.user)
            throw new ApolloError('Already logged in! (token is valid)', 'TOKEN_VALID');

        const loginRes = await safeFetch(`${config.discordAPIEndpoint}/oauth2/token`, {
            body: new URLSearchParams({
                code,
                client_id: config.oauth2.clientID,
                client_secret: config.oauth2.clientSecret,
                redirect_uri: config.oauth2.redirectURI,
                grant_type: "authorization_code",
                scope: "identify"
            }),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        });
        const loginJSON = await loginRes.json();

        if ((loginRes.status !== 200) || !loginJSON.access_token)
            throw new ApolloError('Wrong code', 'CODE_INVALID');

        const userRes = await safeFetch(
            `${config.discordAPIEndpoint}/users/@me`,
            {
                headers: {
                    Authorization: `${loginJSON.token_type} ${loginJSON.access_token}`
                }
            }
        );
        const userJSON = await userRes.json();

        if (userRes.status !== 200)
            throw new ApolloError('User Not Found', 'REQUEST_ERROR');

        await UserModel.findOneOrCreate({ discordID: userJSON.id });
        const data = {
            username: userJSON.username,
            avatarURL: userJSON.avatar
                ? `https://cdn.discordapp.com/avatars/${userJSON.id}/${userJSON.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/${Number(userJSON.discriminator) % 5}.png`,
            discriminator: userJSON.discriminator
        };
        ctx.userCache.set(userJSON.id, data);
        return sign({ id: userJSON.id, ...data }, config.jwtSecret, { expiresIn: '6h' });
    }
}