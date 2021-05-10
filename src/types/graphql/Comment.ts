import { Field, ID, ObjectType } from "type-graphql";

import GraphQLTUser from "./User";
import GraphQLTPost from "./Post";

@ObjectType()
class GraphQLTComment {
    @Field(type => ID)
    id: string;

    @Field()
    content: string;

    @Field(type => GraphQLTUser)
    author;

    @Field(type => GraphQLTUser, { nullable: true })
    reply;

    @Field(type => GraphQLTPost)
    post;

    @Field()
    timestamp: number;

    @Field(type => [GraphQLTUser])
    hearts;
}
export default GraphQLTComment;