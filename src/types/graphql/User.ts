import { Field, ID, ObjectType } from "type-graphql";

import TUser from "../user";
import GraphQLTBadge from "./Badge";

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
    badges: GraphQLTBadge[];

    @Field(type => [GraphQLTUser])
    following: TUser[];

    @Field(type => [GraphQLTUser])
    follower: TUser[]
}
export default GraphQLTUser;