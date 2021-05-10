import "reflect-metadata";

import Express, { static as ExpressStatic } from "express";
import { createServer } from "http";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { PubSub } from "graphql-subscriptions";
import { verify } from "jsonwebtoken";

import { dbConnect, dbDisconnect } from "./database";

import config from "../config.json";

import logger from "./utils/logger";
import { userCache } from "./utils/cache";

import Log from "./middlewares/Log";
import DiscommuAuthChecker from "./middlewares/Authorization";

import DefaultResolver from "./resolvers/DefaultResolver";
import MutationResolver from "./resolvers/MutationResolver";
import UserResolver from "./resolvers/UserResolver";
import BadgeResolver from "./resolvers/BadgeResolver";
import CategoryResolver from "./resolvers/CategoryResolver";
import PostResolver from "./resolvers/PostResolver";

import TContext from "./types/context";

process.on("exit", () => {
    logger.info("Exit");
    dbDisconnect();
});

(async () => {
    const pubSub = new PubSub();
    const schema = await buildSchema({
        pubSub,
        resolvers: [
            DefaultResolver,
            MutationResolver,
            UserResolver,
            BadgeResolver,
            CategoryResolver,
            PostResolver
        ],
        globalMiddlewares: [
            Log
        ],
        authChecker: DiscommuAuthChecker,
    });

    const apollo = new ApolloServer({
        schema,
        logger,
        formatError: error => {
            logger.error(`[${error.extensions?.code}] ${error.message}  (Path: ${error.path}, Original: ${error.originalError?.stack})`)
            return error
        },
        context: async ({ req }): Promise<TContext> => {
            const uCache = new userCache();
            let res = {
                userCache: uCache,
            }
            if (!req)
                return res

            let token = null;
            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer "))
                token = req.headers.authorization.slice("Bearer ".length);
            let user = null;

            if (token) {
                try { user = await uCache.getUser((verify(token, config.jwtSecret) as any).id) }
                catch { user = null }
            }

            return {
                ...res,
                user: user || null,
                url: req.protocol + "://" + req.get("host")
            }
        }
    });

    const app: Express.Application = Express();
    app.use('/static', ExpressStatic('src/data'));
    apollo.applyMiddleware({ app });

    const httpServer = createServer(app);
    apollo.installSubscriptionHandlers(httpServer);

    httpServer.listen(config.port || 3000, async () => {
        dbConnect();
        logger.info(`Server Start`);
    });
})()