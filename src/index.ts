import "reflect-metadata";

import Express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { verify } from "jsonwebtoken";

import { dbConnect, dbDisconnect } from "./database";

import config from "../config.json";

import logger from "./utils/logger";
import { userCache } from "./utils/cache";

import Log from "./middlewares/Log";

import DefaultResolver from "./resolvers/DefaultResolver";

import TContext from "./types/context";

process.on("exit", () => {
    logger.info("Exit");
    dbDisconnect();
});

(async () => {
    const schema = await buildSchema({
        resolvers: [
            DefaultResolver
        ],
        globalMiddlewares: [
            Log
        ]
    });

    const apollo = new ApolloServer({
        schema,
        logger,
        context: async ({ req }): Promise<TContext> => {
            if (!req.headers.authorization) return null;
            if (!req.headers.authorization.startsWith("Bearer ")) return null;
            const token = req.headers.authorization.slice("Bearer ".length);

            const uCache = new userCache();
            let user;

            try { user = await uCache.getUser((verify(token, config.jwtSecret) as any).id) }
            catch { user = null }

            if (!user)
                user = null;

            return {
                userCache: uCache,
                user: user
            }
        }
    });

    const app: Express.Application = Express();
    apollo.applyMiddleware({ app });

    app.listen(config.port || 3000);
    dbConnect();
    logger.info("Server Start");
})()