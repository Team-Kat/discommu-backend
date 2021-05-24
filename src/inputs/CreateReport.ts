import { Field, InputType } from "type-graphql";

@InputType()
export default class CreateReport {
    @Field({ description: "The report's content" })
    content: string;

    @Field({ description: "The report's type" })
    type: number;

    @Field({ description: "The report's data" })
    data: string;
}