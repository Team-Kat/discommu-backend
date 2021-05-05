import { AuthChecker } from "type-graphql";
import { ApolloError } from "apollo-server-errors";

import TContext from "../types/context";

const DiscommuAuthChecker: AuthChecker<TContext> = ({ context, args }, roles: string[]) => {
    if (!context.user)
        return false;

    if (!roles.length)
        return true;

    let res = true;
    for (const role of roles) {
        switch (role) {
            case "ADMIN":
                if (context.user.permissions.includes("admin"))
                    return true;
                else
                    res = false;
                break;
            case "USER_EDIT":
                if (args.id && ((args.id === context.user.discordID) || context.user.permissions.includes("admin")))
                    res = res;
                else
                    res = false;
                break;
        }
    }
    return res;
}
export default DiscommuAuthChecker;