import { MiddlewareFn } from "type-graphql";

import TContext from "../types/context";
import logger from "../utils/logger";

const Log: MiddlewareFn<TContext> = async ({ context, info }, next) => {
    await logger.debug(`${info.parentType.name}.${info.fieldName} called by ${context.user?.username ?? "guest"}`);
    return next();
}
export default Log;