import "reflect-metadata";

import Express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";

import config from "../config.json";

import DefaultResolver from "./resolvers/DefaultResolver";

process.on("exit", () => {
    console.log("\x1b[32mLOG>\x1b[0m Exit");
});

(async () => {
    const schema = await buildSchema({
        resolvers: [
            DefaultResolver
        ]
    });

    const apollo = new ApolloServer({
        schema,
        logger: {  
            warn(message?: any) {
                console.warn(message);
            },
            debug(message?: any) {
                console.debug(message);
            },
            error(message?: any) {
                console.error(message);
            },
            info(message?: any) {
                console.info(message);
            }
        }
    });

    const app: Express.Application = Express();
    apollo.applyMiddleware({ app });

    app.listen(config.port || 3000);
    console.log("\x1b[32mLOG>\x1b[0m Server Start");
})()