import { Field, ID, ObjectType } from "type-graphql";

import { TUser } from "../user";

@ObjectType()
export class GraphQLTUser {
    @Field(type => ID)
    id: string;

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

    @Field(type => [String])
    badges: string[];

    @Field(type => [GraphQLTUser])
    following: TUser[];

    @Field(type => [GraphQLTUser])
    follower: TUser[]
}