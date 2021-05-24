import { createUnionType } from "type-graphql";

import GraphQLTUser from "./User";
import GraphQLTPost from "./Post";
import GraphQLTCategory from "./Category";

const GraphQLTReportData = createUnionType({
    name: "GraphQLTReportData",
    types: () => [GraphQLTCategory, GraphQLTPost, GraphQLTUser],
    resolveType: value => {
        if ("title" in value)
            return GraphQLTPost;
        else if ("discordID" in value)
            return GraphQLTUser;
        else if ("name" in value)
            return GraphQLTCategory;
    }
})
export default GraphQLTReportData;