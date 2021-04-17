import { ICommentDocument } from "./comments.types";

export async function edit(this: ICommentDocument, content: string): Promise<void> {
    this.content = content;
    this.timestamp = Date.now();
    await this.save();
}