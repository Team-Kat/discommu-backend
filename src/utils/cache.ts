import safeFetch from "./fetch";
import { UserModel } from "../database";

import config from "../../config.json";

export class cacheManager {
    cache: { [key: string]: object } = {};

    get(key: string) {
        return this.cache[key] || null;
    }

    set(key: string, value: object): void {
        this.cache[key] = value;
    }
}

export class userCache extends cacheManager {
    cache: {
        [id: string]: {
            username: string,
            avatarURL: string,
            discriminator: string
        }
    } = {};

    async getDiscordUser(id: string) {
        if (this.get(id))
            return this.get(id);

        const res = await safeFetch(
            `${config.discordAPIEndpoint}/users/${id}`,
            {
                headers: {
                    Authorization: `Bot ${config.botToken}`
                }
            }
        );

        if (res.status !== 200) return null;
        const json = await res.json();
        const data = {
            username: json.username,
            avatarURL: json.avatar
                ? `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/${Number(json.discriminator) % 5}.png`,
            discriminator: json.discriminator
        };

        this.set(id, data);
        return data;
    }

    async getUser(id: string) {
        if (!this.get(id)) await this.getDiscordUser(id);
        const userDBInfo = await UserModel.findOne({ discordID: id });

        if (!userDBInfo) return null;
        return {
            discordID: id,
            description: userDBInfo.description,
            point: userDBInfo.point,
            permissions: userDBInfo.permissions,
            following: userDBInfo.following,
            badges: userDBInfo.badges,
            ...this.get(id)
        };
    }
}