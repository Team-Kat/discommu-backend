import { UserModel } from "../index";

import { IPostDocument, IPostModel } from "./posts.types";

import needPoints from "../../data/json/needPoints.json";
import getPoints from "../../data/json/getPoints.json";

export async function createPost(
    this: IPostModel,
    data: IPostDocument
): Promise<IPostDocument> {
    const user = await UserModel.findOne({ id: data.authorID });
    if (needPoints.newPost > user.point) return;

    const post = await this.create(data);
    await user.addPoint(getPoints.newPost);
    return post;
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