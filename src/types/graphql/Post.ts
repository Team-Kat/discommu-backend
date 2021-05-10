import { Field, ID, ObjectType } from "type-graphql";

import GraphQLTUser from "./User";
import GraphQLTCategory from "./Category";

@ObjectType()
class GraphQLTPost {
    @Field(type => ID)
    id: string;

    @Field()
    title: string;

    @Field()
    content: string;

    @Field(type => GraphQLTUser)
    author;

    @Field(type => GraphQLTCategory)
    category;

    @Field()
    timestamp: number;

    @Field()
    views: number;

    @Field(type => [String])
    tags: string[];

    @Field(type => [GraphQLTComment])
    comments;
}
export default GraphQLTPost;