import { Resolver, Query } from "type-graphql";

import config from "../../config.json";

@Resolver()
export default class DefaultResolver {
    @Query((returns) => String)
    loginURL() {
        return (
            `${config.discordAPIEndpoint}/oauth2/authorize?client_id=${config.oauth2.clientID}&redirect_uri=${config.oauth2.redirectURI}&scope=identify&response_type=code`
        )
    }
}