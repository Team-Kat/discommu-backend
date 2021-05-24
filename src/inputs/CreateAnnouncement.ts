import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";

@InputType()
export default class CreateAnnouncement {
    @Field({ description: "The announcement's title" })
    @MaxLength(100, {
        message: "Title is too long (Max 100 letters)",
        context: {
            code: "FIELD_LENGTH_OVER"
        }
    })
    title: string;

    @Field({ description: "The announcement's content" })
    content: string;

    @Field({  description: "The announcement's type" })
    type: number;
}