import { Document, Model } from "mongoose";

export enum announcementType {
    POST = 0,
    CATEGORY = 1,
    ETC = 2
}

export interface IAnnouncement {
    title: string;
    content: string;
    timestamp: number;
    type: announcementType;
}

export interface IAnnouncementDocument extends Document, IAnnouncement {
    addHeart: (this: IAnnouncementDocument, userID: string) => Promise<void>;
    removeHeart: (this: IAnnouncementDocument, userID: string) => Promise<void>;
    watch: () => Promise<IAnnouncementDocument>;
    edit: (data: { title: string, content: string, tag: string[] }) => Promise<void>;
};

export interface IAnnouncementModel extends Model<IAnnouncementDocument> {
    findByTag: (tag: string) => Promise<Array<IAnnouncementDocument>>;
    searchAnnouncements: (query: string) => Promise<Array<IAnnouncementDocument>>;
    createAnnouncement: (data: IAnnouncementDocument) => Promise<IAnnouncementDocument>;
};