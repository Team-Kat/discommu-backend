import { Field, InputType } from "type-graphql";

import { reportType } from "../types/report";

@InputType()
export default class CreateReport {
    @Field({ description: "The report's content" })
    content: string;

    @Field({ description: "The report's type", defaultValue: reportType.SUGGEST })
    type: reportType;

    @Field({ nullable: true, description: "The report's data" })
    data: string;
}