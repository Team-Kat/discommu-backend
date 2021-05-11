import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";

@InputType()
export default class CreateCategory {
    @Field({ description: "The category's name" })
    @MaxLength(20, {
        message: "Name is too long (Max 20 letters)",
        context: {
            code: "FIELD_LENGTH_OVER"
        }
    })
    name: string;

    @Field({ nullable: true, description: "The category's description" })
    @MaxLength(100, {
        message: "Description is too long (Max 100 letters)",
        context: {
            code: "FIELD_LENGTH_OVER"
        }
    })
    description: string;
}