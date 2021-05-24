import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";

@InputType()
export default class CreateComment {
    @Field({ description: "The comment's content" })
    @MaxLength(500, {
        message: "Comment is too long (Max 500 letters)",
        context: {
            code: "FIELD_LENGTH_OVER"
        }
    })
    content: string;

    @Field({ description: "The comment's reply", nullable: true, defaultValue: undefined })
    reply: string;
}