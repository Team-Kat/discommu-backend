import "reflect-metadata";

import Express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";

import config from "../config.json";

import logger from "./utils/logger";

import DefaultResolver from "./resolvers/DefaultResolver";

process.on("exit", () => {
    logger.info("Exit");
});

(async () => {
    const schema = await buildSchema({
        resolvers: [
            DefaultResolver
        ]
    });

    const apollo = new ApolloServer({
        schema,
        logger: logger
    });

    const app: Express.Application = Express();
    apollo.applyMiddleware({ app });

    app.listen(config.port || 3000);
    logger.info("Server Start");
})()