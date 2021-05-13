import { FieldResolver, Resolver, Root, Ctx, Mutation, Authorized, Arg, PubSub, PubSubEngine, Subscription } from "type-graphql";
import { ApolloError } from "apollo-server-errors";

import GraphQLTAnnouncement from "../types/graphql/Announcement";

import { TAnnouncement } from "../types/announcement";

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
}