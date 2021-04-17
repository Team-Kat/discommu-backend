import { ICommentModel } from "./comments.types";

export async function findByPost(
    this: ICommentModel,
    postID: string
): Promise<Array<any>> {
    const res = await this.find({ postID: postID });
    if (!res) return [];
    return res;
}

export async function createComment(
    this: ICommentModel,
    postID: string,
    content: string,
    authorID: string,
    reply?: string
): Promise<void> {
    await this.create({
        postID: postID,
        reply: reply,
        content: content.trim(),
        authorID: authorID,
        timestamp: Date.now()
    })
}