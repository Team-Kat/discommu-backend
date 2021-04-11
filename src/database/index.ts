import Mongoose from "mongoose";

import config from "../../config.json";
import logger from "../utils/logger";


export let db: Mongoose.Connection;


export const dbConnect = () => {
    if (db) dbDisconnect();

    Mongoose.connect(`mongodb+srv://admin:${config.db.password}@${config.db.url}/discommu?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

    db = Mongoose.connection;
    db.once("open", async () => {
        logger.info("Database connect");
    });
    db.on("error", () => {
        logger.error("Error while connecting");
    });
}

export const dbDisconnect = () => {
    if (!db) return;
    Mongoose.disconnect();
    logger.info("Database disconnect");
}

export { UserModel } from "./users/users.models";
export { PostModel } from "./posts/posts.models";
export { CategoryModel } from "./categories/categories.models";