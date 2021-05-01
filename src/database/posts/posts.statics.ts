import { UserModel } from "../index";

import { IPostDocument, IPostModel } from "./posts.types";

export async function createPost(
    this: IPostModel,
    data: IPostDocument
): Promise<IPostDocument> {
    return await this.create(data);
}

export async function findByTag(
    this: IPostModel,
    tag: string
): Promise<Array<IPostDocument>> {
    return (await this.find()).filter(user => user.tag.includes(tag));
}

export async function searchPosts(
    this: IPostModel,
    query: string
): Promise<Array<IPostDocument>> {
    return (await this.find()).filter(user => user.title.includes(query) || user.content.includes(query));
}