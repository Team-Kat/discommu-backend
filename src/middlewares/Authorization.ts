import { AuthChecker } from "type-graphql";

import TContext from "../types/context";

const DiscommuAuthChecker: AuthChecker<TContext> = ({ context }, roles: string[]) => {
    if (!context.user)
        return false;

    if (!roles.length)
        return true;

    let res = true;
    for (const role of roles) {
        switch (role) {
            case "ADMIN":
                if (context.user.permissions.includes("admin"))
                    res = res;
                break;
        }
    }
    return res;
}
export default DiscommuAuthChecker;