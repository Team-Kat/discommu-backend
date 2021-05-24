import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";

@InputType()
export default class EditCategory {
    @Field({ nullable: true, description: "The category's new description" })
    @MaxLength(100, {
        message: "Description is too long (Max 100 letters)",
        context: {
            code: "FIELD_LENGTH_OVER"
        }
    })
    description: string;

    @Field({ nullable: true, description: "The user's new type", defaultValue: undefined })
    type: number;
}