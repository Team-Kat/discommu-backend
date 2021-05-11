import { AuthChecker } from "type-graphql";

import { CategoryModel, PostModel } from "../database";

import TContext from "../types/context";

const DiscommuAuthChecker: AuthChecker<TContext> = async ({ context, args }, roles: string[]) => {
    if (!context.user)
        return false;

    if (!roles.length)
        return true;

    if (context.user.permissions.includes("admin"))
        return true;

    let res = true;
    for (const role of roles) {
        switch (role) {
            case "ADMIN":
                res = false;
                break;
            case "USER_EDIT":
                if (args.id && (args.id === context.user.discordID))
                    res = res;
                else
                    res = false;
                break;
            case "MODIFY_CATEGORIES":
                if (context.user.permissions.includes("MODIFY_CATEGORIES"))
                    res = res;
                else
                    res = false;
                break;
            case "SELF_CATEGORY":
                if (!context.user.permissions.includes("MODIFY_CATEGORIES"))
                    res = false;
                else {
                    const category = await CategoryModel.findOne({ name: args.name });
                    if (category?.authorID !== context.user.discordID)
                        res = false;
                    else
                        res = true;
                }

                break;
            case "SELF_POST":
                const post = await PostModel.findById(args.id);
                if (post?.authorID !== context.user.discordID)
                    res = false;
                else
                    res = true;
                break;
        }
    }
    return res;
}
export default DiscommuAuthChecker;