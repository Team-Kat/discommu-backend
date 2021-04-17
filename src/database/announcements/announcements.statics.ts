import { IAnnouncementModel, IAnnouncementDocument, announcementType } from "./announcements.types";

export async function createAnnouncement(
    this: IAnnouncementModel,
    title: string,
    type: announcementType,
    content: string
): Promise<IAnnouncementDocument> {
    return await this.create({
        title: title,
        type: type,
        content: content,
        timestamp: Date.now()
    });
}