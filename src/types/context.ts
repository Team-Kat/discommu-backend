import { PubSub } from "graphql-subscriptions";

import TUser from "./user";
import { userCache } from "../utils/cache"

type TContext = {
    user: TUser
    userCache: userCache
    url: string
    pubsub: PubSub
}
export default TContext