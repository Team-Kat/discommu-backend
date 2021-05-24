import { Field, ID, ObjectType } from "type-graphql";

import { reportType } from "../report";

import GraphQLTUser from "./User";
import GraphQLTReportData from "./ReportData";

@ObjectType()
class GraphQLTReport {
    @Field(returns => ID)
    id: string;

    @Field()
    content: string;

    @Field(type => GraphQLTUser)
    user;

    @Field(type => GraphQLTReportData)
    data;

    @Field()
    type: reportType;

    @Field()
    timestamp: number;
}
export default GraphQLTReport;