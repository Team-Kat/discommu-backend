import { Field, ID, ObjectType } from "type-graphql";

import GraphQLTUser from "./User";
import { TCategory, categoryType } from "../category";

@ObjectType()
class GraphQLTCategory {
    @Field(type => ID)
    name: string;

    @Field()
    description: string;

    @Field()
    type: categoryType;

    @Field(type => GraphQLTUser)
    author: GraphQLTUser;
}
export default GraphQLTCategory;