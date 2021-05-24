import { FieldResolver, Resolver, Root, Mutation, Authorized, Arg } from "type-graphql";
import { ApolloError } from "apollo-server-errors";

import GraphQLTAnnouncement from "../types/graphql/Announcement";

import { TAnnouncement, announcementType } from "../types/announcement";

import CreateAnnouncement from "../inputs/CreateAnnouncement";
import { AnnouncementModel } from "../database";

@Resolver(GraphQLTAnnouncement)
export default class {
    @FieldResolver()
    async content(@Root() root: TAnnouncement) {
        return root.content;
    }

    @FieldResolver()
    async title(@Root() root: TAnnouncement) {
        return root.title;
    }

    @FieldResolver()
    async id(@Root() root: TAnnouncement) {
        return root._id;
    }

    @FieldResolver()
    async type(@Root() root: TAnnouncement) {
        return root.type;
    }

    @FieldResolver()
    async timestamp(@Root() root: TAnnouncement) {
        return root.timestamp;
    }

    @Authorized(["ADMIN"])
    @Mutation(returns => GraphQLTAnnouncement)
    async createAnnouncement(@Arg("data") data: CreateAnnouncement) {
        if (!Object.values(announcementType).includes(data.type)) {
            throw new ApolloError("Type does not exists", "UNDEFINED_TYPE");
        }

        const announcement = await AnnouncementModel.create({
            title: data.title,
            content: data.content,
            type: data.type,
            timestamp: Date.now()
        })
        return announcement;
    }

    @Authorized(["ADMIN"])
    @Mutation(returns => GraphQLTAnnouncement)
    async editAnnouncement(@Arg("id") id: string, @Arg("content") content: string) {
        if (!await AnnouncementModel.exists({ _id: id }))
            throw new ApolloError(`Announcement with id ${id} doesn't exists`, "UNKNOWN_ID");

        return await AnnouncementModel.findByIdAndUpdate(id,
            { $set: { content: content } },
            { new: true }
        );
    }
}