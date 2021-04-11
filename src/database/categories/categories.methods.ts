import { PostModel } from "../index";

import { ICategoryDocument } from "./categories.types";

export async function editDesc(this: ICategoryDocument, description: string): Promise<string> {
    this.description = description;
    return description;
}

export async function verify(this: ICategoryDocument): Promise<boolean> {
    if (this.type !== 1)
        return false;
    this.type = 2;
    return true;
}

export async function del(this: ICategoryDocument): Promise<boolean> {
    const posts = (await PostModel.find({ category: this.name }))
        .length;
    if (posts >= 10)
        return false;
    await this.delete();
    return true;
}