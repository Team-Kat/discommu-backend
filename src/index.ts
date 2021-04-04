import "reflect-metadata";

import Express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";

import { dbConnect, dbDisconnect } from "./database";

import config from "../config.json";

import logger from "./utils/logger";

import Log from "./middlewares/Log";

import DefaultResolver from "./resolvers/DefaultResolver";

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
        logger
    });

    const app: Express.Application = Express();
    apollo.applyMiddleware({ app });

    app.listen(config.port || 3000);
    dbConnect();
    logger.info("Server Start");
})()