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

export interface IAnnouncementDocument extends Document, IAnnouncement { };
export interface IAnnouncementModel extends Model<IAnnouncementDocument> { };