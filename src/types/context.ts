import TUser from "./user";
import { userCache } from "../utils/cache"

type TContext = {
    user: TUser
    userCache: userCache
}
export default TContext