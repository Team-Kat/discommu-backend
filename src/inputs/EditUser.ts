import { Field, InputType } from "type-graphql";
import { MaxLength } from "class-validator";

@InputType()
export default class EditUser {
    @Field({ nullable: true, description: "The user's new description" })
    @MaxLength(100, {
        message: "Description is too long (Max 100 letters)",
        context: {
            code: "FIELD_LENGTH_OVER"
        }
    })
    description: string;

    @Field(type => [String], { nullable: true, description: "The user's new followings (ids)", defaultValue: undefined })
    following: string[];

    @Field(type => [String], { nullable: true, description: "The user's new badges", defaultValue: undefined })
    badges: string[];

    @Field(type => [String], { nullable: true, description: "The user's new permissions", defaultValue: undefined })
    permissions: string[];
}