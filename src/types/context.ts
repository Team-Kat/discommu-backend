import TUser from "./user";
import { userCache } from "../utils/cache";

type TContext = {
    user?: TUser
    url?: string
    userCache: userCache
};
export default TContext;