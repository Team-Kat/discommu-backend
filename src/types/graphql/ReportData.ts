import { createUnionType } from "type-graphql";

import GraphQLTUser from "./User";
import GraphQLTPost from "./Post";
import GraphQLTCategory from "./Category";

const GraphQLTReportData = createUnionType({
    name: "GraphQLTReportData",
    types: () => [GraphQLTCategory, GraphQLTPost, GraphQLTUser, String]
})
export default GraphQLTReportData;