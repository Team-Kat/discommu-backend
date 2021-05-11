import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";

@InputType()
export default class CreatePost {
    @Field({ description: "The post's title" })
    @MaxLength(100, {
        message: "Title is too long (Max 100 letters)",
        context: {
            code: "FIELD_LENGTH_OVER"
        }
    })
    title: string;

    @Field({ nullable: true, description: "The post's content" })
    content: string;

    @Field(type => [String], { nullable: true, description: "The post's tag" })
    tag: string[];
}