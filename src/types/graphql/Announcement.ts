import { Field, ID, ObjectType } from "type-graphql";

import { announcementType } from "../announcement";

@ObjectType()
class GraphQLTAnnouncement {
    @Field(returns => ID)
    id: string;

    @Field()
    title: string;

    @Field()
    content: string;

    @Field(type => announcementType)
    type: announcementType;

    @Field()
    timestamp: number;
}
export default GraphQLTAnnouncement;