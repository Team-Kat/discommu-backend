import { IAnnouncementDocument } from "./announcements.types";

export async function edit(this: IAnnouncementDocument, data: { title: string, content: string }): Promise<void> {
    this.title = data.title ?? this.title;
    this.content = data.content ?? this.content
    await this.save();
}