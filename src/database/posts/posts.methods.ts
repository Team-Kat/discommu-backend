import { UserModel } from "../index";

import { IPostDocument } from "./posts.types";


export async function addHeart(this: IPostDocument, userID: string): Promise<void> {
    if (this.hearts?.includes(userID)) return;
    const user = await UserModel.findOne({ id: userID });

    this.hearts?.push(userID);
    await this.save();
}

export async function removeHeart(this: IPostDocument, userID: string): Promise<void> {
    if (!this.hearts?.includes(userID)) return;
    const user = await UserModel.findOne({ id: userID });

    this.hearts = this.hearts?.filter(i => i !== userID);

    await this.save();
}

export async function watch(this: IPostDocument): Promise<IPostDocument> {
    this.views += 1;
    await this.save();
    return this;
}

export async function edit(this: IPostDocument, data: { title: string, content: string, tag: string[] }): Promise<void> {
    this.title = data.title ?? this.title;
    this.content = data.content ?? this.content
    this.tag = data.tag ?? this.tag
    await this.save();
}