import { Field, ID, ObjectType } from "type-graphql";

import GraphQLTBadge from "./Badge";
import GraphQLTPost from "./Post";

@ObjectType()
class GraphQLTUser {
    @Field(type => ID)
    discordID: string;

    @Field()
    discriminator: string;

    @Field()
    username: string;

    @Field()
    avatarURL: string;

    @Field()
    description: string;

    @Field()
    point: number;

    @Field(type => [String])
    permissions: string[];

    @Field(type => [GraphQLTBadge])
    badges;

    @Field(type => [GraphQLTUser])
    following;

    @Field(type => [GraphQLTUser])
    follower;

    @Field(type => [GraphQLTPost])
    posts;

    @Field(type => [GraphQLTPost])
    hearts;
}
export default GraphQLTUser;